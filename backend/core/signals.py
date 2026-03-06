from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

from .models import Internship, Report, Company
from .detector import detect_scam
from .domain_utils import extract_domain_from_email


FREE_EMAIL_DOMAINS = {
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com"
}


# --------------------------------------------------
# AUTO-CREATE COMPANY ON INTERNSHIP SAVE
# --------------------------------------------------

@receiver(post_save, sender=Internship)
def auto_create_company(sender, instance, created, **kwargs):

    # Prevent recursive saves
    if instance.company:
        return

    if not instance.contact_email:
        return

    domain = extract_domain_from_email(instance.contact_email)

    if not domain or domain in FREE_EMAIL_DOMAINS:
        return

    company_obj, _ = Company.objects.get_or_create(
        email_domain=domain,
        defaults={
            "name": domain.split(".")[0].capitalize(),
            "website": f"https://{domain}"
        }
    )

    # Avoid infinite signal loop
    Internship.objects.filter(id=instance.id).update(
        company=company_obj,
        company_name_text=None
    )


# --------------------------------------------------
# AUTO-RUN DETECTION ON INTERNSHIP SAVE
# --------------------------------------------------

@receiver(post_save, sender=Internship)
def auto_detect_on_internship_save(sender, instance, created, **kwargs):

    # Allow disabling during stress tests
    if getattr(settings, "DISABLE_AUTO_DETECTION", False):
        return

    detect_scam(instance.id)


# --------------------------------------------------
# AUTO-RUN DETECTION ON REPORT SAVE
# --------------------------------------------------

@receiver(post_save, sender=Report)
def auto_detect_on_report_save(sender, instance, created, **kwargs):

    if getattr(settings, "DISABLE_AUTO_DETECTION", False):
        return

    detect_scam(instance.internship.id)