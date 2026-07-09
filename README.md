# 🚨 Internship Scam Detection System

A **hybrid intelligent system** designed to detect fraudulent internship postings using a combination of:

* Rule-Based Detection
* Natural Language Processing (NLP)
* Machine Learning
* Domain Intelligence

---

## 📌 Overview

Internship scams are increasingly common across platforms like LinkedIn, Telegram, and job portals. These scams often involve fake companies, registration fees, and misleading job descriptions.

This project provides an **automated detection system** that analyzes internship data and classifies it as:

* 🔴 Scam
* 🟡 Suspicious
* 🟢 Genuine

Along with a **risk score (0–100)** and **explainable reasoning**.

---

## ⚙️ System Architecture

The system processes input through multiple intelligence layers:

```
Input Data (Title, Description, Email, Source)
        ↓
 ┌──────────────────────────────┐
 │   Rule-Based Engine          │
 │   NLP Pattern Detection      │
 │   Machine Learning Model     │
 │   Domain Intelligence        │
 └──────────────────────────────┘
        ↓
   Hybrid Score Fusion
        ↓
Final Output (Score + Verdict + Explanation)
```

---

## 🧠 Key Features

### 🔹 Rule-Based Detection

* Keyword and pattern-based rules stored in the database
* Field-specific matching (title, description, email, source)
* Weighted scoring system

---

### 🔹 NLP Pattern Detection

* Detects scam phrases beyond simple keywords
* Examples:

  * “registration fee required”
  * “no interview process”
  * “limited seats available”

---

### 🔹 Machine Learning Model

* TF-IDF Vectorization (1–3 grams)
* Random Forest Classifier
* Hybrid feature input:

  * Text features
  * Structured signals (pattern score, suspicious words, etc.)

---

### 🔹 Domain Intelligence

* Domain age analysis
* MX record validation
* Domain resolution checks
* Detection of suspicious sources (Telegram, WhatsApp)

---

### 🔹 Explainable AI

* Each detection includes **reasoning**
* RuleContribution system shows:

  * Which rule triggered
  * How much score it added

---

## 🗄️ Database Design

### Core Tables

* **Company**
* **Internship**
* **DetectionResult**
* **RuleContribution**
* **ScamRule**
* **RuleKeyword**

### Key Relationships

* Company → Internship (1:N)
* Internship → DetectionResult (1:1)
* DetectionResult → RuleContribution (1:N)
* ScamRule → RuleKeyword (1:N)

---

### Constraints

* ✅ Unique fingerprint (prevents duplicates)
* ✅ One-to-One detection mapping
* ✅ Check constraints (e.g., stipend ≥ 0)
* ✅ Foreign key integrity

---

## 🧮 Normalization

The database is normalized up to **Third Normal Form (3NF)**:

* 1NF → Atomic fields
* 2NF → Full dependency on primary key
* 3NF → Separation of:

  * Company data
  * Internship data
  * Detection data

This ensures:

* Minimal redundancy
* Better data integrity
* Efficient updates

---

## 🚀 Implementation

### Tech Stack

* **Backend:** Django (Python)
* **Machine Learning:** Scikit-learn
* **Database:** SQLite / PostgreSQL
* **Libraries:**

  * TF-IDF Vectorizer
  * Random Forest Classifier

---

### Core Modules

* `core/detector.py` → Detection engine
* `core/ml_model.py` → ML model
* `core/features.py` → Feature extraction
* `core/models.py` → Database models

---

## 📊 Sample Output

| Internship Title            | Score | Verdict    |
| --------------------------- | ----- | ---------- |
| Work From Home Internship   | 87    | Scam       |
| Software Engineering Intern | 1     | Genuine    |
| Urgent Hiring Intern        | 74    | Suspicious |

---

## 🔍 How It Works

1. Input internship data
2. Extract features (text + structured)
3. Apply rule-based scoring
4. Run ML prediction
5. Perform domain checks
6. Combine all signals
7. Generate final score + explanation

---

## 📈 Results

* ✔ Accurate scam detection
* ✔ Handles ambiguous cases
* ✔ Works on real-world-like data
* ✔ Provides explainable outputs

---

## 🔮 Future Enhancements

* Integration with job portals APIs
* Advanced NLP (BERT / Transformers)
* Real-time domain reputation services
* Cloud deployment (AWS / Railway)
* User authentication & dashboards

---

## 👨‍💻 Author

**Jmail Vahid**
B.Tech CSE (AI & ML)
MEA Engineering College

---

## 📄 License

This project is developed for academic purposes.
