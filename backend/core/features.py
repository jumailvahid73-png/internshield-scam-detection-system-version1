import re
from .patterns import PATTERN_DEFINITIONS


# ======================================================
# TEXT NORMALIZATION (NEW)
# ======================================================

def normalize_text(text):
    if not text:
        return ""

    text = text.lower()

    # remove special chars but keep words
    text = re.sub(r"[^\w\s]", " ", text)

    # collapse multiple spaces
    text = re.sub(r"\s+", " ", text).strip()

    return text


# ======================================================
# PATTERN EXTRACTION (UPGRADED)
# ======================================================

def extract_pattern_features(text):

    text = normalize_text(text)

    features = {}
    total_score = 0

    for name, config in PATTERN_DEFINITIONS.items():

        patterns = config["patterns"]
        weight = config["weight"]

        count = 0

        for p in patterns:
            try:
                matches = re.findall(p, text)
                count += len(matches)
            except re.error:
                continue  # skip bad regex safely

        # 🔥 CAP COUNT (prevents score explosion)
        capped_count = min(count, 5)

        features[name] = capped_count

        if capped_count > 0:
            total_score += capped_count * weight

    features["pattern_score"] = total_score

    return features