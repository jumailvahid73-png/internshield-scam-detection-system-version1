from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta
import json

from .models import Internship, Company, RuleContribution
from .forms import ReportForm
from .detector import detect_scam


# ==========================================================
# PUBLIC SCAM CHECK (NO REDIRECT — CLEAN FLOW)
# ==========================================================
def check_internship(request):

    result = None

    if request.method == "POST":

        title = request.POST.get("title")
        description = request.POST.get("description")
        email = request.POST.get("email")
        stipend = request.POST.get("stipend")

        internship = Internship.objects.create(
            title=title,
            description=description,
            contact_email=email,
            stipend=int(stipend) if stipend else None,
            source="Public Form"
        )

        # Run detection immediately
        result = detect_scam(internship.id)

    return render(
        request,
        "check.html",
        {
            "result": result
        }
    )


# ==========================================================
# INTERNSHIP DETAIL (Optional Deep View)
# ==========================================================
def internship_detail(request, internship_id):

    internship = get_object_or_404(Internship, id=internship_id)

    detect_scam(internship.id)

    result = internship.detection
    contributions = result.contributions.all()

    return render(
        request,
        "internship_detail.html",
        {
            "internship": internship,
            "result": result,
            "contributions": contributions
        }
    )


# ==========================================================
# REPORT SUBMISSION
# ==========================================================
@login_required
def report_internship(request, internship_id):

    internship = get_object_or_404(Internship, id=internship_id)

    if request.method == "POST":
        form = ReportForm(request.POST)
        if form.is_valid():
            report = form.save(commit=False)
            report.internship = internship
            report.user = request.user
            report.save()

            return redirect("internship_detail", internship_id=internship.id)
    else:
        form = ReportForm()

    return render(
        request,
        "report.html",
        {
            "form": form,
            "internship": internship
        }
    )


# ==========================================================
# ANALYTICS DASHBOARD
# ==========================================================
def analytics_dashboard(request):

    # -------------------------
    # Verdict Distribution
    # -------------------------
    verdict_data = (
        Internship.objects
        .select_related("detection")
        .values("detection__verdict")
        .annotate(count=Count("id"))
    )

    verdict_labels = []
    verdict_counts = []

    for item in verdict_data:
        if item["detection__verdict"]:
            verdict_labels.append(item["detection__verdict"])
            verdict_counts.append(item["count"])

    # -------------------------
    # Risk Score Distribution
    # -------------------------
    risk_data = (
        Internship.objects
        .select_related("detection")
        .values("detection__risk_score")
    )

    risk_scores = [
        item["detection__risk_score"]
        for item in risk_data
        if item["detection__risk_score"] is not None
    ]

    # -------------------------
    # High Risk Internships
    # -------------------------
    high_risk = (
        Internship.objects
        .select_related("detection")
        .filter(detection__risk_score__gte=70)
        .order_by("-detection__risk_score")[:5]
    )

    # -------------------------
    # Most Triggered Rules
    # -------------------------
    top_rules = (
        RuleContribution.objects
        .values("rule_name")
        .annotate(count=Count("id"))
        .order_by("-count")[:5]
    )

    # -------------------------
    # Weekly Trend (last 7 days)
    # -------------------------
    one_week_ago = timezone.now() - timedelta(days=7)

    weekly_data = (
        Internship.objects
        .filter(created_at__gte=one_week_ago)
        .extra(select={"day": "date(created_at)"})
        .values("day")
        .annotate(count=Count("id"))
        .order_by("day")
    )

    trend_labels = [str(item["day"]) for item in weekly_data]
    trend_counts = [item["count"] for item in weekly_data]

    context = {
        "verdict_labels": json.dumps(verdict_labels),
        "verdict_counts": json.dumps(verdict_counts),
        "trend_labels": json.dumps(trend_labels),
        "trend_counts": json.dumps(trend_counts),
        "risk_scores": json.dumps(risk_scores),
        "high_risk": high_risk,
        "top_rules": top_rules,
    }

    return render(request, "analytics.html", context)