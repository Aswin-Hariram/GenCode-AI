from typing import Dict, Any

from config.config import get_llm

# Singleton pattern for memory and conversation objects to avoid re-instantiation
class _ConversationManager:
    _history: list[dict[str, str]] = []
    _max_turns = 6

    @classmethod
    def format_history(cls) -> str:
        if not cls._history:
            return "No previous conversation."

        return "\n".join(
            f"{entry['role'].title()}: {entry['content']}" for entry in cls._history[-cls._max_turns :]
        )

    @classmethod
    def add_turn(cls, role: str, content: str) -> None:
        cls._history.append({"role": role, "content": content})
        cls._history = cls._history[-cls._max_turns :]

_PROMPT_TEMPLATE = """
You are a highly skilled AI coding assistant focused on coaching the user through the current coding problem.

## Problem Context
- **Topic:** {problem_topic}
- **Language:** {language}
- **Description:** {problem_description}
- **Initial Code:**
```{language}
{initial_code}
```
- **User's Question:** {message}
- **User's Code Progress:**
```{language}
{user_code_progress}
```
- **Recent Conversation:**
{conversation_history}

## Instructions
- **Always answer ONLY the user's question.** Stay strictly on-topic.
- **If the question relates to code,** use the user's code progress to guide your answer.
- **Do NOT provide full solutions or code unless explicitly requested.** Focus on logic, concepts, and next steps.
- **If the question is not related to the code progress,** use only the problem description and initial code for context.
- **If the question is unrelated to the problem,** politely state that you can only assist with the current coding problem.
- **Be proactive in clarifying ambiguities** if the user's question is unclear, but do not ask unnecessary questions.
- **Use polished markdown formatting** for clarity and visual quality:
    - Prefer short sections with `##` headings when the answer has more than one idea
    - Use bullets for checklists, numbered steps for sequences, and tables for comparisons
    - Use blockquotes for warnings, common mistakes, or key insight callouts
    - Use fenced code blocks with the correct language tag only when a snippet is truly helpful
- **For explanations:**
    - Break the answer into the user's next step, the reason, and an optional quick example
    - Show state transitions, dry runs, or input/output sketches when they improve understanding
    - Keep paragraphs short and easy to scan
- **Tone:**
    - Simple, beginner-friendly, and focused on learning
    - Encourage and empower the user to solve the problem themselves
- **Avoid:**
    - Unnecessary information, excessive details, or unrelated suggestions
    - Repetition or verbose explanations
    - Empty filler like "Here is the answer" or "Let me explain"

## Response Format
Respond in clean **markdown only**.

Preferred structure:
- `## Next Step`
- `## Why`
- `## Quick Check` or `## Example` when useful

If the user asks a very small question, a shorter markdown answer is fine.
"""

def ask_help_to_ai(
    message: str,
    language: str,
    problem_description: str,
    problem_topic: str,
    initial_code: str,
    user_code_progress: str
) -> Dict[str, Any]:
    """
    Ask help to AI with summary memory and markdown formatting.
    Returns a dictionary with sender, output, and status keys.
    """
    prompt = _PROMPT_TEMPLATE.format(
        message=message,
        language=language,
        problem_description=problem_description,
        problem_topic=problem_topic,
        initial_code=initial_code,
        user_code_progress=user_code_progress,
        conversation_history=_ConversationManager.format_history(),
    )

    raw_response = get_llm().invoke(prompt).content.strip()
    _ConversationManager.add_turn("user", message)
    _ConversationManager.add_turn("assistant", raw_response)

    return {
        "sender": "assistant",
        "output": raw_response,
        "status": "success",
    }
