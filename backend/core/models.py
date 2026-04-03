from django.db import models
from django.db.models import Q, Count
from django.db.models.functions import Lower
from django.contrib.auth.models import User
from django.utils import timezone
import hashlib


# =====================================================
# COMPANY MODEL (HARDENED IDENTITY + DOMAIN INTELLIGENCE)
# =====================================================

class Company(models.Model):

    STATUS_CHOICES = [
        ("verified", "Verified"),
        ("unverified", "Unverified"),
        ("blacklisted", "Blacklisted"),
    ]

    name = models.CharField(max_length=255)

    # 🔥 STRICT identity (no NULL allowed)
    email_domain = models.CharField(
        max_length=255,
        unique=True
    )

    website = models.URLField(blank=True, null=True)

    verified_status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="unverified",
        db_index=True
    )

    # Domain Intelligence
    domain_resolves = models.BooleanField(null=True, blank=True, db_index=True)
    has_mx_record = models.BooleanField(null=True, blank=True, db_index=True)
    domain_age_days = models.IntegerField(null=True, blank=True)
    domain_last_checked = models.DateTimeField(null=True, blank=True)

    reputation_score = models.IntegerField(default=0, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                Lower("name"),
                name="unique_company_name_ci"
            ),
            models.CheckConstraint(
                condition=Q(domain_age_days__gte=0) | Q(domain_age_days__isnull=True),
                name="domain_age_non_negative"
            ),
        ]
        indexes = [
            models.Index(fields=["verified_status"]),
            models.Index(fields=["created_at"]),
        ]

    def save(self, *args, **kwargs):
        if self.email_domain:
            self.email_domain = self.email_domain.strip().lower()
        super().save(*args, **kwargs)

    def calculate_reputation(self):
        data = self.internships.aggregate(
            total=Count("id"),
            scam=Count(
                "id",
                filter=Q(detections__is_latest=True, detections__verdict="scam")
            )
        )
        total = data["total"] or 0
        scam = data["scam"] or 0
        genuine = total - scam
        return (genuine * 2) - (scam * 10)

    def refresh_reputation(self):
        self.reputation_score = self.calculate_reputation()
        self.save(update_fields=["reputation_score"])

    def __str__(self):
        return self.name


# =====================================================
# INTERNSHIP MODEL (DEDUP + RAW DATA + STATUS)
# =====================================================

class Internship(models.Model):

    class ProcessingStatus(models.TextChoices):
        PENDING = "pending"
        PROCESSED = "processed"
        FAILED = "failed"

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="internships"
    )

    company_name_text = models.CharField(max_length=255, blank=True)

    title = models.CharField(max_length=255)
    description = models.TextField()
    contact_email = models.EmailField(blank=True, null=True)

    stipend = models.IntegerField(blank=True, null=True)

    source = models.CharField(max_length=255, db_index=True)

    # 🔥 RAW scraped data
    raw_data = models.JSONField(null=True, blank=True)

    # 🔥 ACTIVE FLAG
    is_active = models.BooleanField(default=True, db_index=True)

    # 🔥 Processing state
    status = models.CharField(
        max_length=20,
        choices=ProcessingStatus.choices,
        default=ProcessingStatus.PENDING,
        db_index=True
    )

    fingerprint = models.CharField(
        max_length=64,
        unique=True,
        editable=False,
        db_index=True
    )

    created_at = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.CheckConstraint(
                condition=(
                    Q(company__isnull=False) |
                    Q(company_name_text__gt="")
                ),
                name="internship_company_or_text_required"
            ),
            models.CheckConstraint(
                condition=Q(stipend__gte=0) | Q(stipend__isnull=True),
                name="stipend_non_negative"
            ),
        ]
        indexes = [
            models.Index(fields=["source"]),
            models.Index(fields=["created_at"]),
            models.Index(fields=["fingerprint"]),
            models.Index(fields=["status"]),
            models.Index(fields=["is_active"]),
        ]

    def generate_fingerprint(self):
        base_string = f"""
        {self.title.strip().lower() if self.title else ""}
        {self.description.strip().lower() if self.description else ""}
        {self.contact_email.strip().lower() if self.contact_email else ""}
        {self.source.strip().lower() if self.source else ""}
        """

        normalized = " ".join(base_string.split())
        return hashlib.sha256(normalized.encode("utf-8")).hexdigest()

    def save(self, *args, **kwargs):
        self.fingerprint = self.generate_fingerprint()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


# =====================================================
# REPORT MODEL (USER FEEDBACK SIGNAL)
# =====================================================

class Report(models.Model):

    internship = models.ForeignKey(
        Internship,
        on_delete=models.CASCADE,
        related_name="reports",
        db_index=True
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="internship_reports",
        db_index=True
    )

    reason = models.CharField(max_length=200)
    details = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["internship", "user"],
                name="unique_user_report"
            )
        ]

    def __str__(self):
        return f"{self.user.username} → {self.internship.title}"


# =====================================================
# SCAM RULE MODEL
# =====================================================

class ScamRule(models.Model):

    name = models.CharField(max_length=200)
    description = models.TextField()
    weight = models.IntegerField()

    is_negative = models.BooleanField(default=False)

    active = models.BooleanField(default=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-weight"]
        indexes = [
            models.Index(fields=["active"]),
        ]

    def __str__(self):
        return self.name


# =====================================================
# RULE KEYWORDS
# =====================================================

class RuleKeyword(models.Model):

    FIELD_CHOICES = [
        ("title", "Title"),
        ("description", "Description"),
        ("email", "Email"),
    ]

    rule = models.ForeignKey(
        ScamRule,
        on_delete=models.CASCADE,
        related_name="keywords"
    )

    keyword = models.CharField(max_length=100)

    field = models.CharField(
        max_length=20,
        choices=FIELD_CHOICES,
        default="description"
    )

    class Meta:
        indexes = [
            models.Index(fields=["keyword"]),
        ]

    def __str__(self):
        return f"{self.rule.name} → {self.keyword}"


# =====================================================
# DETECTION RESULT (FULL HISTORY + ML SAFE)
# =====================================================

class DetectionResult(models.Model):

    internship = models.ForeignKey(
        Internship,
        on_delete=models.CASCADE,
        related_name="detections"
    )

    # 🔥 ML outputs
    risk_score = models.FloatField()
    probability = models.FloatField()

    verdict = models.CharField(
        max_length=20,
        choices=[
            ('genuine', 'Genuine'),
            ('suspicious', 'Suspicious'),
            ('scam', 'Scam'),
        ],
        db_index=True
    )

    engine_version = models.IntegerField(db_index=True)

    # 🔥 versioning control
    is_latest = models.BooleanField(default=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.CheckConstraint(
                condition=Q(probability__gte=0) & Q(probability__lte=1),
                name="probability_range"
            ),
        ]
        indexes = [
            models.Index(fields=["internship", "-created_at"]),
            models.Index(fields=["is_latest"]),
            models.Index(fields=["verdict"]),
            models.Index(fields=["engine_version"]),
        ]

    def save(self, *args, **kwargs):
        # 🔥 ensure only one latest per internship
        if self.is_latest:
            DetectionResult.objects.filter(
                internship=self.internship,
                is_latest=True
            ).update(is_latest=False)

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.internship.title} - {self.verdict}"


# =====================================================
# RULE CONTRIBUTION (NORMALIZED + SNAPSHOT SAFE)
# =====================================================

class RuleContribution(models.Model):

    detection = models.ForeignKey(
        DetectionResult,
        on_delete=models.CASCADE,
        related_name="contributions",
        db_index=True
    )

    # 🔥 FIXED (normalized)
    rule = models.ForeignKey(
        ScamRule,
        on_delete=models.CASCADE
    )

    # 🔥 snapshot of weight at detection time
    weight_snapshot = models.IntegerField()

    score_added = models.FloatField()

    class Meta:
        ordering = ["-score_added"]

    def __str__(self):
        return f"{self.rule.name} ({self.score_added})"