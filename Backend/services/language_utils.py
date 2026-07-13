LANGUAGE_ALIASES = {
    "c++": "cpp",
    "cpp": "cpp",
    "cplusplus": "cpp",
    "js": "javascript",
    "javascript": "javascript",
    "node": "javascript",
    "py": "python",
    "python": "python",
    "python3": "python",
    "c": "c",
    "java": "java",
}

LANGUAGE_LABELS = {
    "c": "C",
    "cpp": "C++",
    "java": "Java",
    "javascript": "JavaScript",
    "python": "Python",
}


def normalize_language(language: str | None) -> str:
    normalized = str(language or "").strip().lower()
    return LANGUAGE_ALIASES.get(normalized, normalized)


def language_label(language: str | None) -> str:
    normalized = normalize_language(language)
    return LANGUAGE_LABELS.get(normalized, normalized or "Unknown")


def is_supported_language(language: str | None) -> bool:
    return normalize_language(language) in LANGUAGE_LABELS
