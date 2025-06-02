from config import llm  # Assumes llm is a LangChain LLM instance like ChatOpenAI or Gemini
import re

def LangChange(code, fromLang, toLang):
    """Convert the initial code from one language to another language"""

    prompt = f""" You are a code converter that accurately simulates the behavior of a code converter.
    
    You will be given code to convert from one language to another. Act exactly like a real code converter would:
    [IMPORTANT]:NEVER modify the original code
    1. Convert the code from the given language to the desired language
    2. The converted code should not have any syntax errors
    3. The converted code should to the initial code template to solve the same problem
    4. You have NO rights to complete the pending program or TODO mentioned
    5. Incase of from language is same to to language, return the same code
    6. Incase of python to cpp enusure the converted code is a valid cpp code
    Code to convert:
   [code]: {code}
    Convert the above code from {fromLang} to {toLang} 
   Respond in this exact format:
   [Result]: Success or Failure
   [code]: The converted code
   [language]: The language of the converted code
    
    """

    response = llm.invoke(prompt).content

   
    # Debug: Print the raw response for inspection
    print("\n--- Raw LLM Response ---")
    print(response)
    print("----------------------\n")

    # Extract result
    result_match = re.search(r'\[Result\]:\s*(.*?)(?:\n|$)', response, re.IGNORECASE | re.MULTILINE)
    result = result_match.group(1).strip() if result_match else "Unknown"
    
    # Try multiple patterns to extract the code block
    code_patterns = [
        r'```(?:' + re.escape(toLang) + r'|c\+\+)?\s*\n([\s\S]*?)\n```',  # Matches ```lang or ```
        r'```(?:' + re.escape(toLang) + r'|c\+\+)?\s*([\s\S]*?)```',      # More permissive
        r'\[code\]:\s*\n?([\s\S]*?)(?=\n\[|$)',                         # Matches [code]: ...
        r'```(?:[\s\S]*?)```'  # Last resort: any code block
    ]
    
    code = "Unknown"
    for pattern in code_patterns:
        code_match = re.search(pattern, response, re.IGNORECASE)
        if code_match:
            code = code_match.group(1).strip()
            # Clean up any remaining markdown or language specifiers
            code = re.sub(r'^' + re.escape(toLang) + r'\s*\n?', '', code, flags=re.IGNORECASE)
            code = re.sub(r'^c\+\+\s*\n?', '', code, flags=re.IGNORECASE)
            break
    


    return {
        'result': result,
        'code': code,
        'language': toLang
    }