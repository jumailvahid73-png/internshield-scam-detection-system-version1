from django.utils import timezone
from .domain_utils import domain_resolves, has_mx_record


def update_company_domain_reputation(company, domain):
    """
    SAFE VERSION — No WHOIS
    Only DNS + MX checks.
    """

    company.domain_resolves = domain_resolves(domain)
    company.has_mx_record = has_mx_record(domain)

    # REMOVE WHOIS completely
    company.domain_age_days = None

    company.domain_last_checked = timezone.now()
    company.save()