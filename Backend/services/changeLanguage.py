import re

from config.config import get_llm
from services.language_utils import is_supported_language, language_label, normalize_language

def LangChange(code, fromLang, toLang):
    """Convert the initial code from one language to another language"""
    source_language = normalize_language(fromLang)
    target_language = normalize_language(toLang)

    if not code or not str(code).strip():
        return {
            "result": "Failure",
            "message": "Code cannot be empty.",
            "code": "",
            "language": target_language or toLang,
        }

    if not is_supported_language(source_language) or not is_supported_language(target_language):
        return {
            "result": "Failure",
            "message": "Unsupported language requested for conversion.",
            "code": "",
            "language": target_language or toLang,
        }

    if source_language == target_language:
        return {
            "result": "Success",
            "code": code,
            "language": target_language,
        }

    prompt = f"""You convert code between languages without changing its intent.

Rules:
1. Preserve the behavior, structure, comments, and TODO markers.
2. Do not explain anything outside the required format.
3. Do not complete unfinished logic.
4. Keep starter templates as starter templates.
5. If the source contains a runnable main entry point, keep a runnable equivalent in the target language.
6. For Java output, include a valid class with a valid main method when the source has one.
7. Return only the converted code in a fenced code block.

Source language: {language_label(source_language)}
Target language: {language_label(target_language)}

Respond in exactly this format:
[Result]: Success
```{target_language}
<converted code>
```

Source code:
```{source_language}
{code}
```
"""

    response = get_llm().invoke(prompt).content.strip()
    result_match = re.search(r"\[Result\]:\s*(.+?)(?:\n|$)", response, re.IGNORECASE)
    result = result_match.group(1).strip() if result_match else "Failure"

    code_patterns = [
        rf"```{re.escape(target_language)}\s*\n([\s\S]*?)\n```",
        r"```[\w#+-]*\s*\n([\s\S]*?)\n```",
        r"\[code\]:\s*\n?([\s\S]*?)(?=\n\[|$)",
    ]

    converted_code = ""
    for pattern in code_patterns:
        code_match = re.search(pattern, response, re.IGNORECASE)
        if code_match:
            converted_code = code_match.group(1).strip()
            break

    if not converted_code:
        return {
            "result": "Failure",
            "message": "The model did not return convertible code.",
            "code": "",
            "language": target_language,
        }

    return {
        "result": "Success" if result.lower() == "success" else result,
        "code": converted_code,
        "language": target_language,
    }
