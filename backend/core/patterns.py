PATTERN_DEFINITIONS = {
    "fee_required": {
        "patterns": [
            r"fee\s+(required|needed|applicable)",
            r"pay\s+\w*\s*(fee|amount|charges)",
            r"refundable\s+(fee|amount)",
            r"registration\s+(fee|charges)",
        ],
        "weight": 10
    },

    "no_interview": {
        "patterns": [
            r"no\s+interview",
            r"without\s+interview",
            r"no\s+selection\s+process",
        ],
        "weight": 8
    },

    "guarantee": {
        "patterns": [
            r"guaranteed\s+(placement|job|selection)",
            r"100%\s+(placement|selection)",
        ],
        "weight": 9
    },

    "urgency": {
        "patterns": [
            r"apply\s+now",
            r"limited\s+(slots|seats)",
            r"hurry",
            r"immediate\s+joining",
        ],
        "weight": 4
    },

    "contact_shift": {
        "patterns": [
            r"contact\s+on\s+(whatsapp|telegram)",
            r"(whatsapp|telegram)\s+only",
        ],
        "weight": 7
    }
}