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

def ask_help_to_ai(message, language, problem_description,problem_topic, initial_code,user_code_progress) -> dict:
    """
    Ask help to AI with summary memory and markdown formatting.
    Returns only values inside the 'data' key.
    """
    prompt = f"""
You are a helpful AI assistant chatbot similar to chatgpt for coding assistance based on user question.

The user is working on a problem:
Topic: **{problem_topic}**. //Actual problem topic
Language: **{language}**. //Programming language used for solving, return answer based on this language
Problem Description: {problem_description} //Problem description provided
Initial Code: ```{language}\n{initial_code}\n```. //Initial code provided
User's Question: {message}
User's Code Progress: ```{language}\n{user_code_progress}\n```. //User's current code progress considered as context and help him to solve the problem [Use this if the user asks something related to this code otherwise ignore this context]

[IMPORTANT] Don't use User's Code Progress and previous messages as context if the user asks something not related to the memory but if it is related to the problem, then answer it based on the problem description and initial code provided.
[IMPORTANT] If the user asks something not related to the memory but if it is related to the problem, then answer it based on the problem description and initial code provided.
Instructions:
1. **Answer ONLY the user's question**. Stay on-topic based on the context above.
2. **If the question relates to code**, use `User's Code Progress` to guide your answer.
3. **Do NOT provide complete code unless the user explicitly asks for code or solution.** Focus on logic or concepts instead.
4. Use **markdown formatting** in your reply with:
   - Bullet points
   - Numbered steps
   - Visual aids (e.g., ASCII diagrams, tables) to explain ideas
5. If the user asks for explanation:
   - Use **step-by-step breakdowns**.
   - Show **iteration** using tables.
   - Add visual explanation if it improves clarity.
6. Your tone should be **simple, beginner-friendly, and focused on learning**.
7. **Avoid unnecessary information**, excessive details, or unrelated suggestions.

Goal: Help the user understand the logic and approach to solve the problem, as if you're a human coding tutor sitting next to them.
Respond in **markdown** format using the following structure:

**Output**: Response in short and clear answer to the User's Question without unwanted information.
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
