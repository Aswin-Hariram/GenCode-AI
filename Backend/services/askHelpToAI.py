import re
from config.config import llm
from langchain.chains import ConversationChain
from langchain.memory import ConversationSummaryMemory
from typing import Dict, Any

# Singleton pattern for memory and conversation objects to avoid re-instantiation
class _ConversationManager:
    _memory = None
    _conversation = None

    @classmethod
    def get_conversation(cls):
        if cls._memory is None:
            cls._memory = ConversationSummaryMemory(llm=llm, return_messages=True)
        if cls._conversation is None:
            cls._conversation = ConversationChain(
                llm=llm,
                memory=cls._memory,
                verbose=False
            )
        return cls._conversation

_PROMPT_TEMPLATE = """
You are a highly skilled AI coding assistant, similar to ChatGPT, dedicated to providing clear, concise, and actionable help for coding problems. Your responses should be tailored to the user's current context and learning needs.

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

## Instructions
- **Always answer ONLY the user's question.** Stay strictly on-topic.
- **If the question relates to code,** use the user's code progress to guide your answer.
- **Do NOT provide full solutions or code unless explicitly requested.** Focus on logic, concepts, and next steps.
- **If the question is not related to the code progress,** use only the problem description and initial code for context.
- **If the question is unrelated to the problem,** politely state that you can only assist with the current coding problem.
- **Be proactive in clarifying ambiguities** if the user's question is unclear, but do not ask unnecessary questions.
- **Use markdown formatting** for clarity:
    - Bullet points for lists
    - Numbered steps for processes
    - Tables or ASCII diagrams for visual explanation
    - Code blocks with the correct language tag for code snippets
- **For explanations:**
    - Use step-by-step breakdowns
    - Show iterations or changes using tables or side-by-side comparisons
    - Add visual aids if they improve understanding
- **Tone:**
    - Simple, beginner-friendly, and focused on learning
    - Encourage and empower the user to solve the problem themselves
- **Avoid:**
    - Unnecessary information, excessive details, or unrelated suggestions
    - Repetition or verbose explanations

## Response Format
Respond in **markdown** using the following structure:

**Output:** Short, clear answer to the user's question, focused on the next logical step or concept.
**Note:** If code is needed, use markdown code blocks with the appropriate language tag. If further clarification is needed, ask a concise follow-up question.
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
        user_code_progress=user_code_progress
    )

    conversation = _ConversationManager.get_conversation()
    raw_response = conversation.predict(input=prompt).strip()

    # Extract markdown-formatted output efficiently
    match = re.search(r"\*\*Output\*\*:\s*(.+?)(?:\n\*\*Note\*\*|$)", raw_response, re.IGNORECASE | re.DOTALL)
    output = match.group(1).strip() if match else raw_response

    return {
        "sender": "user",
        "output": output,
        "status": "success",
    }
