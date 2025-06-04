
from config import llm  # Assumes llm is a LangChain LLM instance like ChatOpenAI or Gemini
import re

LANGUAGE_PROMPTS = {
    "cpp": "You are a C++ compiler that accurately simulates the behavior of g++.",
    "python": "You are a Python interpreter that accurately simulates the behavior of CPython 3.x.",
    "java": "You are a Java compiler that accurately simulates the behavior of javac."
}

def compile_code(code: str, lang: str) -> dict:
    # Handle empty code input
    if not code or code.isspace():
        return {
            'result': 'Failure',
            'message': 'No code provided. Please submit a valid code snippet.',
            'corrected_code': None
        }

    language_prompt = LANGUAGE_PROMPTS.get(lang, "You are an accurate code compiler/interpreter.")
    
    # Create language-specific prompts
    prompt = f"""
        {language_prompt}
You will be given {lang} code to compile and execute. Act Strictly like a real {lang} compiler/interpreter would:
[IMPORTANT]:NEVER modify the original code [BE STRICT]
1. STRICTLY validate all syntax, types, and language rules as per the {lang} standard
2. For compilation errors, provide the exact g++ error message with line numbers and specific error codes
3. For runtime errors, include memory addresses (if applicable) and exact error conditions
4. Verify all standard library includes and namespace usages
5. Check for undefined behavior, buffer overflows, and memory leaks
6. Enforce strict type checking and conversion rules
7. NEVER modify the original code - treat it as read-only,
8. Be Carefull over index, array bounds, memory leaks, undefined behavior, buffer overflows, and memory leaks
Code to compile and execute:
9. Be carful over return statements as well[Be strict]
10. I need 100% accuracy and precision in code compilation and execution and output [BE STRICT]

Finally really execute the code along with main function and provide the 100% accurate output of the code.
```{lang}
{code}
```

Respond in this exact format:
[Result]: Compilation Success or Failure or Runtime Error
[Message]: The exact compiler output or runtime output/error (no explanations)
[CorrectedCode]: N/A
"""

    response = llm.invoke(prompt).content

    # Extract result
    result_match = re.search(r'\[Result\]:\s*(.*)', response)
    result = result_match.group(1).strip() if result_match else "Unknown"

    # Extract message - handle both cases where CorrectedCode is present or not
    message_match = re.search(r'\[Message\]:\s*(.*?)(?=(?:\[CorrectedCode\]:|\Z))', response, re.DOTALL)
    message = message_match.group(1).strip() if message_match and message_match.group(1).strip() else "No output."

    # Extract corrected code if available
    corrected_code_match = re.search(r'```' + lang + r'(.*?)```', response, re.DOTALL)
    corrected_code = corrected_code_match.group(1).strip() if corrected_code_match else None

    return {
        'result': result,
        'message': message,
        'corrected_code': corrected_code
    }