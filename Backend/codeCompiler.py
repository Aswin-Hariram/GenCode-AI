
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
    if lang == "cpp":
        prompt = f"""
{language_prompt}

You will be given C++ code to compile and execute. Act exactly like a real C++ compiler (g++) would:
[IMPORTANT]:NEVER modify the original code
1. Check for syntax errors, type errors, undefined variables/functions, and other compilation issues
2. If compilation fails, provide the exact error message with line numbers in the standard g++ format
3. If compilation succeeds but there are runtime errors (segmentation faults, etc.), report those
4. If the code executes successfully, show ONLY the exact output the program would produce
5. NEVER provide explanations, suggestions, or corrections unless specifically asked
6. Always show the correct output

Code to compile and execute:
```cpp
{code}
```

Respond in this exact format:
[Result]: Compilation Success or Failure or Runtime Error
[Message]: The exact compiler output or runtime output/error (no explanations)
[CorrectedCode]: N/A
"""
    elif lang == "python":
        prompt = f"""
{language_prompt}

You will be given Python code to interpret and execute. Act exactly like the Python interpreter would:

1. Check for syntax errors, indentation errors, and other parsing issues
2. If parsing fails, provide the exact error message with line numbers in standard Python format
3. If parsing succeeds but there are runtime errors (NameError, TypeError, etc.), report those with tracebacks
4. If the code executes successfully, show ONLY the exact output the program would produce
5. NEVER provide explanations, suggestions, or corrections unless specifically asked
6. NEVER modify the original code

Code to interpret and execute:
```python
{code}
```

Respond in this exact format:
[Result]: Success or SyntaxError or RuntimeError
[Message]: The exact interpreter output or runtime output/error (no explanations)
[CorrectedCode]: N/A
"""
    elif lang == "java":
        prompt = f"""
{language_prompt}

You will be given Java code to compile and execute. Act exactly like a real Java compiler (javac) and JVM would:

1. Check for syntax errors, type errors, undefined variables/methods, and other compilation issues
2. If compilation fails, provide the exact error message with line numbers in standard javac format
3. If compilation succeeds but there are runtime errors (NullPointerException, etc.), report those with stack traces
4. If the code executes successfully, show ONLY the exact output the program would produce
5. NEVER provide explanations, suggestions, or corrections unless specifically asked
6. NEVER modify the original code

Code to compile and execute:
```java
{code}
```

Respond in this exact format:
[Result]: Compilation Success or Failure or Runtime Error
[Message]: The exact compiler output or runtime output/error (no explanations)
[CorrectedCode]: N/A
"""
    else:
        # Generic prompt for other languages
        prompt = f"""
{language_prompt}

You will be given {lang} code to compile and execute. Act exactly like a real {lang} compiler/interpreter would:

1. Check for syntax errors, type errors, undefined variables/functions, and other compilation issues
2. If compilation/interpretation fails, provide the exact error message with line numbers
3. If compilation succeeds but there are runtime errors, report those
4. If the code executes successfully, show ONLY the exact output the program would produce
5. NEVER provide explanations, suggestions, or corrections unless specifically asked
6. NEVER modify the original code

Code to compile and execute:
```{lang}
{code}
```

Respond in this exact format:
[Result]: Success or Failure or Runtime Error
[Message]: The exact compiler/interpreter output or runtime output/error (no explanations)
[CorrectedCode]: N/A
"""

    response = llm.invoke(prompt).content

    # Extract result
    result_match = re.search(r'\[Result\]:\s*(.*)', response)
    result = result_match.group(1).strip() if result_match else "Unknown"

    # Extract message (fix duplicate comment)  
    message_match = re.search(r'\[Message\]:\s*(.*?)(?=\[CorrectedCode\]:)', response, re.DOTALL)
    message = message_match.group(1).strip() if message_match else "No message provided."

    # Extract corrected code if available
    corrected_code_match = re.search(r'```' + lang + r'(.*?)```', response, re.DOTALL)
    corrected_code = corrected_code_match.group(1).strip() if corrected_code_match else None

    return {
        'result': result,
        'message': message,
        'corrected_code': corrected_code
    }
