import os
import joblib
import numpy as np

from scipy.sparse import hstack
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier

from .features import extract_pattern_features


MODEL_PATH = "ml_model.pkl"
VECTORIZER_PATH = "ml_vectorizer.pkl"


# ======================================================
# TRAIN MODEL
# ======================================================

def train_model(texts, labels, structured_features):

    vectorizer = TfidfVectorizer(
        max_features=10000,
        ngram_range=(1, 3),
        stop_words="english",
        min_df=2,
        max_df=0.85
    )

    X_text = vectorizer.fit_transform(texts)

    X_struct = np.array(structured_features)

    X = hstack([X_text, X_struct])

    model = RandomForestClassifier(
        n_estimators=300,
        max_depth=14,
        min_samples_split=4,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1
    )

    model.fit(X, labels)

    joblib.dump(model, MODEL_PATH)
    joblib.dump(vectorizer, VECTORIZER_PATH)

    print("✅ Hybrid model trained")


# ======================================================
# LOAD MODEL
# ======================================================

_MODEL = None
_VECTORIZER = None


def load_model():
    global _MODEL, _VECTORIZER

    if _MODEL is not None and _VECTORIZER is not None:
        return _MODEL, _VECTORIZER

    if not os.path.exists(MODEL_PATH):
        return None, None

    _MODEL = joblib.load(MODEL_PATH)
    _VECTORIZER = joblib.load(VECTORIZER_PATH)

    return _MODEL, _VECTORIZER


# ======================================================
# FEATURE BUILDER (CRITICAL FIX)
# ======================================================

def build_structured_features(text):
    features = extract_pattern_features(text)

    pattern_score = features.get("pattern_score", 0)

    pattern_count = sum(
        1 for k, v in features.items()
        if k != "pattern_score" and v > 0
    )

    word_count = len(text.split())
    text_length = len(text)

    suspicious_words = ["fee", "pay", "urgent", "limited", "certificate"]
    suspicious_count = sum(
        1 for w in suspicious_words if w in text.lower()
    )

    source_flag = 1 if any(x in text.lower() for x in ["telegram", "whatsapp"]) else 0

    legit_words = [
        "mentorship", "learning", "experience",
        "project", "team", "development",
        "opportunity", "skills", "training"
    ]

    legit_count = sum(1 for w in legit_words if w in text.lower())

    return np.array([[
        pattern_score / 50,
        pattern_count / 10,
        word_count / 100,
        text_length / 1000,
        suspicious_count / 10,
        source_flag,
        legit_count / 10
    ]])


# ======================================================
# PREDICT
# ======================================================

def predict_score(text):

    model, vectorizer = load_model()

    if model is None:
        return 0

    # TEXT FEATURES
    X_text = vectorizer.transform([text])

    # STRUCTURED FEATURES (CONSISTENT NOW)
    X_struct = build_structured_features(text)

    # COMBINE
    X = hstack([X_text, X_struct])

    # PREDICT
    prob = model.predict_proba(X)[0][1]

    # ==================================================
    # CALIBRATION (KEEPED BUT CLEAN)
    # ==================================================

    if prob < 0.2:
        prob = prob * 0.5
    elif prob > 0.6:
        prob = 0.6 + (prob - 0.6) * 1.8

    prob = max(0.01, min(prob, 0.99))

    return float(prob)