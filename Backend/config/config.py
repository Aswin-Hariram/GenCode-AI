import os
from types import SimpleNamespace

from dotenv import load_dotenv
import requests

try:
    from langchain_google_genai import ChatGoogleGenerativeAI
    _gemini_import_error = None
except ModuleNotFoundError as exc:
    ChatGoogleGenerativeAI = None
    _gemini_import_error = exc


load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))


class LLMConfigurationError(RuntimeError):
    """Raised when the Gemini client cannot be configured."""


_llm = None


def _get_google_api_key() -> str | None:
    """Resolve the Gemini API key from supported environment variables."""
    return os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")


def _get_openrouter_api_key() -> str | None:
    return os.getenv("OPENROUTER_API_KEY")


def _get_openrouter_base_url() -> str:
    return (os.getenv("OPENROUTER_BASE_URL") or "https://openrouter.ai/api/v1").rstrip("/")


def _get_openrouter_model() -> str:
    return os.getenv("OPENROUTER_MODEL") or "openai/gpt-4o-mini"


def _is_rate_limit_error(exc: Exception) -> bool:
    message = str(exc).lower()
    rate_limit_markers = [
        "429",
        "rate limit",
        "quota",
        "resource exhausted",
        "resource_exhausted",
        "too many requests",
    ]
    return any(marker in message for marker in rate_limit_markers)


class OpenRouterLLM:
    def __init__(self, api_key: str, base_url: str, model: str, temperature: float = 0.7):
        self.api_key = api_key
        self.base_url = base_url
        self.model = model
        self.temperature = temperature

    def invoke(self, prompt: str):
        response = requests.post(
            f"{self.base_url}/chat/completions",
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": self.model,
                "messages": [
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                "temperature": self.temperature,
            },
            timeout=60,
        )
        response.raise_for_status()
        data = response.json()
        content = data["choices"][0]["message"]["content"]
        if isinstance(content, list):
            content = "".join(
                item.get("text", "") if isinstance(item, dict) else str(item)
                for item in content
            )
        return SimpleNamespace(content=str(content).strip())


class FallbackLLM:
    def __init__(self, primary, backup):
        self.primary = primary
        self.backup = backup

    def invoke(self, prompt: str):
        if self.primary is None:
            return self.backup.invoke(prompt)

        try:
            return self.primary.invoke(prompt)
        except Exception as exc:
            if self.backup is not None and _is_rate_limit_error(exc):
                return self.backup.invoke(prompt)
            raise


def get_gemini_readiness() -> tuple[bool, str]:
    """Report whether Gemini can be initialized with the current environment."""
    if _gemini_import_error is not None:
        return False, f"Missing Gemini dependency: {_gemini_import_error}"

    if not _get_google_api_key():
        return False, "Missing GOOGLE_API_KEY or GEMINI_API_KEY."

    return True, "Gemini configuration is present."


def get_openrouter_readiness() -> tuple[bool, str]:
    if not _get_openrouter_api_key():
        return False, "Missing OPENROUTER_API_KEY."
    return True, f"OpenRouter fallback is configured with model '{_get_openrouter_model()}'."


def get_llm_readiness() -> tuple[bool, str]:
    gemini_ready, gemini_message = get_gemini_readiness()
    openrouter_ready, openrouter_message = get_openrouter_readiness()

    if gemini_ready:
        if openrouter_ready:
            return True, f"{gemini_message} {openrouter_message}"
        return True, gemini_message

    if openrouter_ready:
        return True, f"Gemini unavailable. {openrouter_message}"

    return False, f"{gemini_message} {openrouter_message}"


def _build_gemini_llm():
    if _gemini_import_error is not None:
        return None

    api_key = _get_google_api_key()
    if not api_key:
        return None

    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.7,
        google_api_key=api_key,
    )


def _build_openrouter_llm():
    api_key = _get_openrouter_api_key()
    if not api_key:
        return None

    return OpenRouterLLM(
        api_key=api_key,
        base_url=_get_openrouter_base_url(),
        model=_get_openrouter_model(),
        temperature=0.7,
    )


def get_llm():
    """Lazily create and return the shared LLM client with OpenRouter fallback."""
    global _llm

    if _llm is not None:
        return _llm

    try:
        primary = _build_gemini_llm()
        backup = _build_openrouter_llm()

        if primary and backup:
            _llm = FallbackLLM(primary=primary, backup=backup)
        elif primary:
            _llm = primary
        elif backup:
            _llm = backup
        else:
            raise LLMConfigurationError(
                "No LLM provider is configured. Set GOOGLE_API_KEY or GEMINI_API_KEY, "
                "or configure OPENROUTER_API_KEY with OPENROUTER_BASE_URL and OPENROUTER_MODEL."
            )

        return _llm
    except Exception as exc:
        raise LLMConfigurationError(
            f"Failed to initialize LLM client: {exc}"
        ) from exc
