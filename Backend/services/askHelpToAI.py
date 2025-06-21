import re
from config import llm
from langchain.chains import ConversationChain
from langchain.memory import ConversationSummaryMemory

# Create ConversationSummaryMemory for long-term context handling
memory = ConversationSummaryMemory(llm=llm, return_messages=True)

# Initialize conversation chain with memory
conversation = ConversationChain(
    llm=llm,
    memory=memory,
    verbose=False
)

def ask_help_to_ai(message, language, problem_description,problem_topic) -> dict:
    """
    Ask help to AI with summary memory and markdown formatting.
    Returns only values inside the 'data' key.
    """
    prompt = f"""
You are a helpful AI assistant chatbot similar to chatgpt for coding assistance.

The user is working on a problem:
Topic: **{problem_topic}**.
Problem Description: {problem_description}
User's Question: {message}

Respond in **markdown** format using the following structure:

**Output**: Write a short and clear answer [use markdown to explain visually if needed].
**Note**: If you need to provide code, use markdown code blocks with the appropriate language tag."""

    # Get response with memory-enabled conversation
    raw_response = conversation.predict(input=prompt).strip()

    # Extract markdown-formatted output
    match = re.search(r"\*\*Output\*\*:\s*(.+)", raw_response, re.IGNORECASE | re.DOTALL)
    output = match.group(1).strip() if match else raw_response

    # Return only the values inside 'data'
    return {
        "sender": "user",
        "output": output,
        "status": "success",
    }
