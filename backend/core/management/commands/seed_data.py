from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from core.models import (
    Company, Internship, DetectionResult,
    ScamRule, RuleKeyword, RuleContribution, Report
)
import random


class Command(BaseCommand):
    help = "Seed realistic scam detection data"

    def handle(self, *args, **kwargs):

        # Create user
        user, _ = User.objects.get_or_create(username="admin")

        # -------------------------
        # REALISTIC RULES
        # -------------------------
        rules_data = [
            ("Payment Request", "Internship asks for upfront payment", 10, ["payment", "fees", "deposit"]),
            ("Fake Domain", "Email domain doesn't match company", 9, ["gmail.com", "yahoo.com"]),
            ("High Salary", "Unrealistic stipend offered", 6, ["10000$", "instant payout"]),
            ("No Website", "Company has no valid website", 7, ["no website"]),
            ("Generic Description", "Copied or vague description", 5, ["easy job", "quick money"]),
        ]

        rules = []

        for name, desc, weight, keywords in rules_data:
            rule = ScamRule.objects.create(
                name=name,
                description=desc,
                weight=weight,
                active=True
            )
            rules.append(rule)

            for kw in keywords:
                RuleKeyword.objects.create(
                    rule=rule,
                    keyword=kw,
                    field="description"
                )

        # -------------------------
        # COMPANIES
        # -------------------------
        companies = []
        for i in range(15):
            c = Company.objects.create(
                name=f"TechCorp {i}",
                email_domain=f"tech{i}.com",
                verified_status=random.choice(["verified", "unverified"]),
                reputation_score=random.randint(-5, 15)
            )
            companies.append(c)

        # -------------------------
        # INTERNSHIPS + DETECTIONS
        # -------------------------
        for i in range(100):

            company = random.choice(companies)

            internship = Internship.objects.create(
                company=company,
                title=f"ML Intern {i}",
                description=random.choice([
                    "Work on AI models",
                    "Easy job earn money fast payment required",
                    "High paying internship no experience needed",
                    "Serious ML internship with training"
                ]),
                source=random.choice(["linkedin", "internshala"]),
                status="processed",
                is_active=True
            )

            prob = random.random()

            verdict = (
                "scam" if prob > 0.7 else
                "suspicious" if prob > 0.4 else
                "genuine"
            )

            detection = DetectionResult.objects.create(
                internship=internship,
                probability=prob,
                risk_score=prob,
                verdict=verdict,
                engine_version=1,
                is_latest=True
            )

            # Rule contributions
            selected_rules = random.sample(rules, random.randint(1, 3))

            for rule in selected_rules:
                RuleContribution.objects.create(
                    detection=detection,
                    rule=rule,
                    score_added=random.uniform(0.1, 1.0),
                    weight_snapshot=rule.weight
                )

            # Reports (some internships only)
            if prob > 0.5:
                Report.objects.create(
                    internship=internship,
                    user=user,
                    reason="Suspicious listing",
                    details="Looks like scam"
                )

        self.stdout.write(self.style.SUCCESS("✅ Realistic data seeded"))