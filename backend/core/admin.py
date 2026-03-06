from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count

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
    readonly_fields = ("rule_name", "score_added")
    can_delete = False


# =====================================================
# DETECTION RESULT ADMIN
# =====================================================

@admin.register(DetectionResult)
class DetectionResultAdmin(admin.ModelAdmin):

    list_display = (
        "internship",
        "risk_meter",
        "verdict",
        "confidence",
        "checked_at",
    )

    list_filter = ("verdict", "confidence", "checked_at")
    search_fields = ("internship__title",)
    readonly_fields = ("risk_meter",)
    inlines = [RuleContributionInline]
    actions = ["recalculate_detection"]

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("internship")

    def risk_meter(self, obj):
        score = min(obj.risk_score or 0, 100)

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

    def recalculate_detection(self, request, queryset):
        for obj in queryset:
            detect_scam(obj.internship.id)
        self.message_user(request, "Detection recalculated.")

    recalculate_detection.short_description = "Recalculate selected detections"


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

        return format_html(
            '<span style="color:{}; font-weight:bold;">{}</span>',
            color,
            score
        )

    reputation_display.short_description = "Reputation"

    def domain_health(self, obj):
        if obj.domain_resolves and obj.has_mx_record:
            return format_html(
                '<span style="color:green;font-weight:bold;">Healthy</span>'
            )
        return format_html(
            '<span style="color:red;font-weight:bold;">Risky</span>'
        )

    domain_health.short_description = "Domain Status"

    def refresh_domain_reputation(self, request, queryset):
        for company in queryset:
            if company.email_domain:
                update_company_domain_reputation(company, company.email_domain)
        self.message_user(request, "Domain reputation refreshed.")

    refresh_domain_reputation.short_description = "Refresh domain reputation"


# =====================================================
# INTERNSHIP ADMIN
# =====================================================

@admin.register(Internship)
class InternshipAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "company_display",
        "source",
        "risk_score_display",
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
            .select_related("company", "detection")
            .annotate(report_count_value=Count("reports"))
        )

    def company_display(self, obj):
        if obj.company:
            return obj.company.name
        return obj.company_name_text or "—"

    company_display.short_description = "Company"

    def risk_score_display(self, obj):
        if hasattr(obj, "detection"):
            return obj.detection.risk_score
        return "—"

    risk_score_display.short_description = "Risk"

    def report_count(self, obj):
        return obj.report_count_value

    report_count.short_description = "Reports"

    def run_detection(self, request, queryset):
        for internship in queryset:
            detect_scam(internship.id)
        self.message_user(request, "Detection executed.")

    run_detection.short_description = "Run scam detection"


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

    list_display = (
        "name",
        "weight",
        "is_negative",
        "active",
    )

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
        "rule_name",
        "score_added"
    )

    search_fields = ("rule_name",)