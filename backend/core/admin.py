from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count, Prefetch

from .models import (
    Company,
    Internship,
    Report,
    ScamRule,
    RuleKeyword,
    DetectionResult,
    RuleContribution
)

from .detector import detect_scam, clear_rule_cache
from .domain_service import update_company_domain_reputation


# =====================================================
# RULE KEYWORD INLINE
# =====================================================

class RuleKeywordInline(admin.TabularInline):
    model = RuleKeyword
    extra = 1


# =====================================================
# RULE CONTRIBUTION INLINE
# =====================================================

class RuleContributionInline(admin.TabularInline):
    model = RuleContribution
    extra = 0
    readonly_fields = ("rule", "score_added", "weight_snapshot")
    can_delete = False


# =====================================================
# DETECTION RESULT ADMIN
# =====================================================

@admin.register(DetectionResult)
class DetectionResultAdmin(admin.ModelAdmin):

    list_display = (
        "internship",
        "risk_meter",
        "verdict_badge",
        "probability",
        "engine_version",
        "is_latest",
        "created_at",
    )

    list_filter = ("verdict", "engine_version", "is_latest")
    search_fields = ("internship__title",)
    readonly_fields = ("risk_meter",)
    inlines = [RuleContributionInline]
    actions = ["recalculate_detection"]

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("internship")

    def risk_meter(self, obj):
        score = int((obj.probability or 0) * 100)

        if score >= 70:
            color = "#dc3545"
        elif score >= 40:
            color = "#fd7e14"
        else:
            color = "#28a745"

        return format_html(
            '<div style="width:160px;border:1px solid #ccc;border-radius:6px;overflow:hidden;">'
            '<div style="width:{}%;background:{};color:white;text-align:center;padding:4px 0;">'
            '{}%'
            '</div></div>',
            score,
            color,
            score
        )

    risk_meter.short_description = "Risk Level"

    def verdict_badge(self, obj):
        if obj.verdict == "scam":
            color = "red"
        elif obj.verdict == "suspicious":
            color = "orange"
        else:
            color = "green"

        return format_html(
            '<b style="color:{};">{}</b>',
            color,
            obj.verdict.upper()
        )

    verdict_badge.short_description = "Verdict"

    def recalculate_detection(self, request, queryset):
        for obj in queryset:
            detect_scam(obj.internship.id)
        self.message_user(request, "Detection recalculated.")


# =====================================================
# COMPANY ADMIN
# =====================================================

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "verified_status",
        "email_domain",
        "post_count",
        "reputation_display",
        "domain_health",
        "created_at"
    )

    list_filter = ("verified_status",)
    search_fields = ("name", "email_domain")
    actions = ["refresh_domain_reputation"]

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .annotate(post_count_value=Count("internships"))
        )

    def post_count(self, obj):
        return obj.post_count_value

    post_count.short_description = "Total Posts"

    def reputation_display(self, obj):
        score = obj.reputation_score or 0

        if score >= 10:
            color = "green"
        elif score >= 0:
            color = "orange"
        else:
            color = "red"

        return format_html('<b style="color:{};">{}</b>', color, score)

    reputation_display.short_description = "Reputation"

    def domain_health(self, obj):
        resolves = getattr(obj, "domain_resolves", None)
        mx = getattr(obj, "has_mx_record", None)

        if resolves is None or mx is None:
            return format_html('<span style="color:gray;">{}</span>', "Unknown")

        if resolves and mx:
            return format_html(
                '<span style="color:green;font-weight:bold;">{}</span>',
                "Healthy"
            )

        return format_html(
            '<span style="color:red;font-weight:bold;">{}</span>',
            "Risky"
        )

    domain_health.short_description = "Domain Status"

    def refresh_domain_reputation(self, request, queryset):
        for company in queryset:
            if company.email_domain:
                update_company_domain_reputation(company, company.email_domain)
        self.message_user(request, "Domain reputation refreshed.")


# =====================================================
# INTERNSHIP ADMIN
# =====================================================

@admin.register(Internship)
class InternshipAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "company_display",
        "source",
        "risk_badge",
        "report_count",
        "created_at",
    )

    list_filter = ("source", "created_at")
    search_fields = ("title", "company__name", "company_name_text", "fingerprint")
    actions = ["run_detection"]

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related("company")
            .prefetch_related(
                Prefetch(
                    "detections",
                    queryset=DetectionResult.objects.filter(is_latest=True),
                    to_attr="latest_detection"
                )
            )
            .annotate(report_count_value=Count("reports"))
        )

    def company_display(self, obj):
        return obj.company.name if obj.company else (obj.company_name_text or "—")

    company_display.short_description = "Company"

    def risk_badge(self, obj):
        latest_list = getattr(obj, "latest_detection", None)
        latest = latest_list[0] if latest_list else None

        if latest:
            score = int((latest.probability or 0) * 100)

            if score >= 70:
                color = "red"
            elif score >= 40:
                color = "orange"
            else:
                color = "green"

            return format_html('<b style="color:{};">{}%</b>', color, score)

        return "—"

    risk_badge.short_description = "Risk"

    def report_count(self, obj):
        return obj.report_count_value

    report_count.short_description = "Reports"

    def run_detection(self, request, queryset):
        for internship in queryset:
            detect_scam(internship.id)
        self.message_user(request, "Detection executed.")


# =====================================================
# REPORT ADMIN
# =====================================================

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):

    list_display = ("internship", "user", "reason", "created_at")
    list_filter = ("created_at",)
    search_fields = ("internship__title", "reason", "user__username")


# =====================================================
# SCAM RULE ADMIN
# =====================================================

@admin.register(ScamRule)
class ScamRuleAdmin(admin.ModelAdmin):

    list_display = ("name", "weight", "is_negative", "active")
    list_filter = ("is_negative", "active")
    search_fields = ("name",)
    list_editable = ("weight", "is_negative", "active")
    inlines = [RuleKeywordInline]

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        clear_rule_cache()

    def delete_model(self, request, obj):
        super().delete_model(request, obj)
        clear_rule_cache()


# =====================================================
# RULE KEYWORD ADMIN
# =====================================================

@admin.register(RuleKeyword)
class RuleKeywordAdmin(admin.ModelAdmin):

    list_display = ("rule", "keyword", "field")
    list_filter = ("field",)
    search_fields = ("keyword",)

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        clear_rule_cache()

    def delete_model(self, request, obj):
        super().delete_model(request, obj)
        clear_rule_cache()


# =====================================================
# RULE CONTRIBUTION ADMIN
# =====================================================

@admin.register(RuleContribution)
class RuleContributionAdmin(admin.ModelAdmin):

    list_display = (
        "detection",
        "rule",
        "score_added",
        "weight_snapshot"
    )

    search_fields = ("rule__name",)