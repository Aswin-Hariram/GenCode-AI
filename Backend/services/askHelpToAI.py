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
User's Code Progress: ```{language}\n{user_code_progress}\n```. //User's current code progress considered as context and help him to solve the problem

Expectation:
    1. Write a short and clear answer only to the user question that helps the user to learn and solve the problem like a beginner [No unwanted information, no extra details for the question asked].
    2. Give code only if asked for answer or code otherwise do not give code try to explain visually if needed and make him understand the concept.
    3. Always try to use visuals like diagrams, tables, flowcharts, etc. to explain the concept if needed.

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
