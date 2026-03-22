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

from .ml_model import predict_score
from .features import extract_pattern_features


# ======================================================
# ENGINE VERSION
# ======================================================

ENGINE_VERSION = 7   # bumped


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
                Prefetch("keywords", queryset=RuleKeyword.objects.all())
            )
        )

    return ACTIVE_RULES_CACHE


# ======================================================
# TOKENIZER
# ======================================================

def tokenize(text):
    if not text:
        return set()
    return set(re.findall(r"\b\w+\b", text.lower()))


# ======================================================
# LOW QUALITY CHECK
# ======================================================

def is_low_quality_text(text):
    if not text:
        return True

    text = text.strip()

    if len(text) < 25:
        return True

    if len(text.split()) < 5:
        return True

    if re.search(r"(.)\1{4,}", text):
        return True

    return False


# ======================================================
# VERDICT LOGIC
# ======================================================

def _derive_verdict(score):

    if score >= 75:
        return "scam", "high"

    elif score >= 40:
        return "suspicious", "medium"

    else:
        return "genuine", "low"


# ======================================================
# DOMAIN REPUTATION (NEW - SAFE ADDITION)
# ======================================================

def _evaluate_domain(email, company):
    score = 0
    contributions = []

    if not email or "@" not in email:
        return score, contributions

    domain = email.split("@")[-1]

    # Disposable email
    if domain in ["mailinator.com", "tempmail.com", "10minutemail.com"]:
        score += 15
        contributions.append(("Disposable email domain", 15))

    # Suspicious TLD
    if domain.split(".")[-1] in ["xyz", "top", "click", "buzz"]:
        score += 8
        contributions.append(("Suspicious domain TLD", 8))

    # Existing company checks (UNCHANGED LOGIC)
    if company:
        if company.domain_resolves is False:
            score += 8
            contributions.append(("Domain not resolving", 8))

        if company.has_mx_record is False:
            score += 6
            contributions.append(("No MX record", 6))

        if company.domain_age_days:
            if company.domain_age_days < 15:
                score += 15
                contributions.append(("Very new domain (<15 days)", 15))
            elif company.domain_age_days < 30:
                score += 8
                contributions.append(("New domain (<30 days)", 8))

    return score, contributions


# ======================================================
# CORE SCORING ENGINE (SAFE MODIFIED)
# ======================================================

def _compute_score(internship, rules):

    rule_score = 0
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

    full_text = f"{title} {description}"

    # ---------------------------------
    # HARD OVERRIDE
    # ---------------------------------

    if company and company.verified_status == "blacklisted":
        return 100, [("Blacklisted company", 100)]

    # ---------------------------------
    # STRUCTURAL CHECKS (UNCHANGED)
    # ---------------------------------

    if not company:
        if not email:
            rule_score += 25
            contributions.append(("No company and no contact email", 25))
        else:
            rule_score += 10
            contributions.append(("No registered company object", 10))

    if len(source.strip()) < 3:
        rule_score += 8
        contributions.append(("Missing source information", 8))

    if not email:
        rule_score += 8
        contributions.append(("No contact email", 8))

    if is_low_quality_text(description):
        rule_score += 8
        contributions.append(("Low-quality description", 8))

    if title in {"internship", "work", "job", "part"}:
        rule_score += 8
        contributions.append(("Generic job title", 8))

    # ---------------------------------
    # DOMAIN REPUTATION (INSERTED HERE)
    # ---------------------------------

    d_score, d_contrib = _evaluate_domain(email, company)
    rule_score += d_score
    contributions.extend(d_contrib)

    # ---------------------------------
    # RULE ENGINE (UNCHANGED)
    # ---------------------------------

    triggered_rules = set()

    for rule in rules:
        for keyword_obj in rule.keywords.all():

            keyword = keyword_obj.keyword.lower()

            if keyword_obj.field == "title" and keyword in title_tokens:
                triggered_rules.add(rule)
                break

            elif keyword_obj.field == "description" and keyword in description_tokens:
                triggered_rules.add(rule)
                break

            elif keyword_obj.field == "email" and keyword in email_tokens:
                triggered_rules.add(rule)
                break

            elif keyword_obj.field == "source" and keyword in source_tokens:
                triggered_rules.add(rule)
                break

    for rule in triggered_rules:

        weight = abs(rule.weight)

        if rule.is_negative:
            rule_score -= weight
            contributions.append((rule.name, -weight))
        else:
            rule_score += weight
            contributions.append((rule.name, weight))

    # ---------------------------------
    # PATTERN ENGINE (UNCHANGED)
    # ---------------------------------

    pattern_features = extract_pattern_features(full_text)

    pattern_score = pattern_features.get("pattern_score", 0)

    if pattern_score > 0:
        rule_score += pattern_score
        contributions.append(("Pattern signals", pattern_score))

    for key, value in pattern_features.items():
        if key != "pattern_score" and value > 0:
            contributions.append((f"{key}_count", value))

    # ---------------------------------
    # SOURCE RISK
    # ---------------------------------

    if source in {"telegram", "whatsapp"}:
        rule_score += 5
        contributions.append(("High-risk source", 5))

    # ---------------------------------
    # NORMALIZATION
    # ---------------------------------

    if rule_score >= 60:
        rule_score += 6
    elif rule_score >= 40:
        rule_score += 3

    rule_score = max(0, min(rule_score, 100))

    # ---------------------------------
    # ML
    # ---------------------------------

    try:
        ml_input = f"{title} {description} {email} {source}"
        ml_prob = predict_score(ml_input)
        ml_score = ml_prob * 100
    except:
        ml_score = 0

    # ---------------------------------
    # HYBRID (UNCHANGED)
    # ---------------------------------

    if ml_score > 70:
        final_score = int((0.5 * rule_score) + (0.5 * ml_score))

    elif ml_score < 30:
        final_score = int((0.8 * rule_score) + (0.2 * ml_score))

    else:
        final_score = int((0.7 * rule_score) + (0.3 * ml_score))

    if 40 <= final_score <= 65:
        final_score += 5

    if final_score >= 65:
        final_score += 4
    elif final_score >= 50:
        final_score += 2

    if len(triggered_rules) >= 4:
        final_score += 2
        contributions.append(("Multiple risk signals", 2))

    final_score = max(0, min(final_score, 100))

    return final_score, contributions


# ======================================================
# EVERYTHING BELOW IS UNTOUCHED
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


def detect_outdated():

    outdated = Internship.objects.filter(
        detection__engine_version__lt=ENGINE_VERSION
    )

    return detect_scam_bulk(outdated)


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