import re
from django.db import transaction
from django.db.models import Prefetch

from .models import (
    Internship,
    ScamRule,
    DetectionResult,
    RuleContribution,
    RuleKeyword,
)

# ======================================================
# ENGINE VERSION (CRITICAL FOR FUTURE UPGRADES)
# ======================================================

ENGINE_VERSION = 2

# ======================================================
# GLOBAL RULE CACHE
# ======================================================

ACTIVE_RULES_CACHE = None


def clear_rule_cache():
    global ACTIVE_RULES_CACHE
    ACTIVE_RULES_CACHE = None


def get_active_rules():
    global ACTIVE_RULES_CACHE

    if ACTIVE_RULES_CACHE is None:
        ACTIVE_RULES_CACHE = list(
            ScamRule.objects
            .filter(active=True)
            .prefetch_related(
                Prefetch(
                    "keywords",
                    queryset=RuleKeyword.objects.all()
                )
            )
        )

    return ACTIVE_RULES_CACHE


# ======================================================
# TOKENIZER (STRICT WORD MATCHING)
# ======================================================

def tokenize(text):
    if not text:
        return set()

    return set(
        re.findall(r"\b\w+\b", text.lower())
    )


# ======================================================
# LOW QUALITY CHECK
# ======================================================

def is_low_quality_text(text):
    if not text:
        return True

    text = text.strip()

    if len(text) < 25:
        return True

    words = text.split()
    if len(words) < 5:
        return True

    if re.search(r"(.)\1{4,}", text):
        return True

    return False


# ======================================================
# CORE SCORING ENGINE (STRICT + DATABASE DRIVEN)
# ======================================================

def _compute_score(internship, rules):

    score = 0
    contributions = []

    title = (internship.title or "").lower()
    description = (internship.description or "").lower()
    email = (internship.contact_email or "").lower()
    source = (internship.source or "").lower()

    company = internship.company

    title_tokens = tokenize(title)
    description_tokens = tokenize(description)
    email_tokens = tokenize(email)
    source_tokens = tokenize(source)

    # ---------------------------------
    # BLACKLIST OVERRIDE
    # ---------------------------------

    if company and company.verified_status == "blacklisted":
        return 100, [("Blacklisted company", 100)]

    # ---------------------------------
    # STRUCTURAL CHECKS
    # ---------------------------------

    if not company:
        if not email:
            score += 25
            contributions.append(("No company and no contact email", 25))
        else:
            score += 10
            contributions.append(("No registered company object", 10))

    if len(source.strip()) < 3:
        score += 15
        contributions.append(("Missing source information", 15))

    if not email:
        score += 10
        contributions.append(("No contact email", 10))

    if is_low_quality_text(description):
        score += 20
        contributions.append(("Low-quality description", 20))

    if title in {"internship", "work", "job", "part"}:
        score += 20
        contributions.append(("Generic job title", 20))

    # ---------------------------------
    # DATABASE-DRIVEN RULE ENGINE
    # ---------------------------------

    for rule in rules:

        triggered = False

        for keyword_obj in rule.keywords.all():

            keyword = keyword_obj.keyword.lower()

            if keyword_obj.field == "title":
                if keyword in title_tokens:
                    triggered = True

            elif keyword_obj.field == "description":
                if keyword in description_tokens:
                    triggered = True

            elif keyword_obj.field == "email":
                if keyword in email_tokens:
                    triggered = True

            elif keyword_obj.field == "source":
                if keyword in source_tokens:
                    triggered = True

            if triggered:
                break

        if triggered:
            weight = abs(rule.weight)

            if rule.is_negative:
                score -= weight
                contributions.append((rule.name, -weight))
            else:
                score += weight
                contributions.append((rule.name, weight))

    score = max(0, min(score, 100))
    return score, contributions


# ======================================================
# SINGLE DETECTION
# ======================================================

def detect_scam(internship_id):

    internship = (
        Internship.objects
        .select_related("company")
        .get(id=internship_id)
    )

    score, contributions = _compute_score(
        internship,
        get_active_rules()
    )

    verdict, confidence = _derive_verdict(score)

    return _save_result(
        internship,
        score,
        verdict,
        confidence,
        contributions
    )


# ======================================================
# BULK DETECTION (SCALABLE)
# ======================================================

def detect_scam_bulk(queryset):

    rules = get_active_rules()

    internships = list(
        queryset.select_related("company")
    )

    detection_objects = []
    detection_map = {}
    contribution_objects = []

    for internship in internships:

        score, contributions = _compute_score(internship, rules)
        verdict, confidence = _derive_verdict(score)

        detection_objects.append(
            DetectionResult(
                internship=internship,
                risk_score=score,
                verdict=verdict,
                confidence=confidence,
                engine_version=ENGINE_VERSION
            )
        )

        detection_map[internship.id] = contributions

    with transaction.atomic():

        DetectionResult.objects.bulk_create(
            detection_objects,
            update_conflicts=True,
            unique_fields=["internship"],
            update_fields=[
                "risk_score",
                "verdict",
                "confidence",
                "engine_version"
            ]
        )

        detections = DetectionResult.objects.filter(
            internship__in=internships
        )

        RuleContribution.objects.filter(
            detection__in=detections
        ).delete()

        for detection in detections:

            contributions = detection_map[detection.internship_id]

            for name, value in contributions:
                contribution_objects.append(
                    RuleContribution(
                        detection=detection,
                        rule_name=name,
                        score_added=value
                    )
                )

        RuleContribution.objects.bulk_create(contribution_objects)

    return len(internships)


# ======================================================
# OUTDATED DETECTION
# ======================================================

def detect_outdated():

    outdated = Internship.objects.filter(
        detection__engine_version__lt=ENGINE_VERSION
    )

    return detect_scam_bulk(outdated)


# ======================================================
# VERDICT DERIVATION
# ======================================================

def _derive_verdict(score):

    if score >= 70:
        return "scam", "high"
    elif score >= 30:
        return "suspicious", "medium"
    else:
        return "genuine", "low"


# ======================================================
# SAVE RESULT
# ======================================================

def _save_result(internship, score, verdict, confidence, contributions):

    result, _ = DetectionResult.objects.update_or_create(
        internship=internship,
        defaults={
            "risk_score": score,
            "verdict": verdict,
            "confidence": confidence,
            "engine_version": ENGINE_VERSION
        }
    )

    RuleContribution.objects.filter(detection=result).delete()

    RuleContribution.objects.bulk_create([
        RuleContribution(
            detection=result,
            rule_name=name,
            score_added=value
        )
        for name, value in contributions
    ])

    return {
        "internship": internship.title,
        "score": score,
        "verdict": verdict,
        "confidence": confidence,
        "contributions": contributions
    }