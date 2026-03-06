import random
from django.core.management.base import BaseCommand
from core.models import Company, Internship
from core.detector import detect_scam


class Command(BaseCommand):
    help = "Seed large internship dataset"

    def handle(self, *args, **kwargs):

        print("Seeding data...")

        companies = []
        domains = ["techcorp.com", "innovatex.io", "futurelabs.ai", "hirequick.xyz"]

        # Create companies
        for i in range(10):
            company, _ = Company.objects.get_or_create(
                name=f"Company {i}",
                defaults={
                    "website": f"https://company{i}.com",
                    "email_domain": random.choice(domains),
                    "verified_status": random.choice(
                        ["verified", "unverified", "unverified", "blacklisted"]
                    )
                }
            )
            companies.append(company)

        scam_descriptions = [
            "Pay registration fee to confirm your internship seat. Limited seats available. Apply fast.",
            "No interview required. Instant selection. Deposit processing charge.",
            "Urgent hiring! Send money for training kit."
        ]

        genuine_descriptions = [
            "We are looking for a backend developer intern to work on Django APIs and PostgreSQL.",
            "Frontend internship opportunity working with React and UI design systems.",
            "AI research internship focusing on machine learning model optimization."
        ]

        titles = [
            "Backend Developer Intern",
            "Frontend Internship",
            "AI Work From Home Internship",
            "Data Science Program",
            "Online Job Opportunity"
        ]

        for i in range(300):

            is_scam = random.choice([True, False, False])  # 1/3 scams

            description = random.choice(
                scam_descriptions if is_scam else genuine_descriptions
            )

            internship = Internship.objects.create(
                company=random.choice(companies) if random.random() > 0.2 else None,
                company_name_text=None,
                title=random.choice(titles),
                description=description,
                stipend=random.randint(0, 50000),
                contact_email=random.choice([
                    "hr@techcorp.com",
                    "jobs@gmail.com",
                    "contact@futurelabs.ai"
                ]),
                source=random.choice(["LinkedIn", "Indeed", "Telegram", "Unknown"])
            )

            detect_scam(internship.id)

        print("DONE. 300 internships created.")
