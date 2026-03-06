import socket
import dns.resolver
import time


DNS_TIMEOUT = 1
MX_TIMEOUT = 1

FREE_EMAIL_DOMAINS = {
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com"
}

# In-memory cache
DOMAIN_CACHE = {}
CACHE_TTL_SECONDS = 3600  # 1 hour


# ------------------------------------------
# Extract domain
# ------------------------------------------

def extract_domain_from_email(email):
    if not email or "@" not in email:
        return None
    return email.split("@")[-1].lower()


def extract_domain_from_url(url):
    if not url:
        return None
    url = url.lower().replace("https://", "").replace("http://", "")
    return url.split("/")[0]


# ------------------------------------------
# DNS Resolution
# ------------------------------------------

def domain_resolves(domain):
    try:
        socket.setdefaulttimeout(DNS_TIMEOUT)
        socket.gethostbyname(domain)
        return True
    except Exception:
        return False


# ------------------------------------------
# MX Record Check
# ------------------------------------------

def has_mx_record(domain):
    try:
        resolver = dns.resolver.Resolver()
        resolver.timeout = MX_TIMEOUT
        resolver.lifetime = MX_TIMEOUT
        records = resolver.resolve(domain, "MX")
        return len(records) > 0
    except Exception:
        return False


# ------------------------------------------
# Cached Evaluation
# ------------------------------------------

def evaluate_domain(domain):

    if not domain:
        return None

    if domain in FREE_EMAIL_DOMAINS:
        return {
            "resolves": True,
            "has_mx": True,
            "age_days": None
        }

    if domain in DOMAIN_CACHE:
        cached_data, timestamp = DOMAIN_CACHE[domain]
        if time.time() - timestamp < CACHE_TTL_SECONDS:
            return cached_data

    data = {
        "resolves": domain_resolves(domain),
        "has_mx": has_mx_record(domain),
        "age_days": None
    }

    DOMAIN_CACHE[domain] = (data, time.time())

    return data