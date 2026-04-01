import os

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI


load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))


class LLMConfigurationError(RuntimeError):
    """Raised when the Gemini client cannot be configured."""


_llm = None


def _get_google_api_key() -> str | None:
    """Resolve the Gemini API key from supported environment variables."""
    return (
        os.getenv("GOOGLE_API_KEY")
        or os.getenv("GEMINI_API_KEY")
        or os.getenv("OPENAI_API_KEY")
    )


def get_llm() -> ChatGoogleGenerativeAI:
    """Lazily create and return the shared Gemini client."""
    global _llm

    if _llm is not None:
        return _llm

    api_key = _get_google_api_key()
    if not api_key:
        raise LLMConfigurationError(
            "Gemini API key is missing. Set GOOGLE_API_KEY or GEMINI_API_KEY in Backend/.env."
        )

    try:
        _llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0.7,
            google_api_key=api_key,
        )
        return _llm
    except Exception as exc:
        raise LLMConfigurationError(
            f"Failed to initialize Gemini client: {exc}"
        ) from exc
