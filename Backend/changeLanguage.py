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
    
    Code to convert:
   [code]: {code}
    Convert the above code from {fromLang} to {toLang} 
   Respond in this exact format:
   [Result]: Success or Failure
   [code]: The converted code
   [language]: The language of the converted code
    
    """

    response = llm.invoke(prompt).content

    print(response)
    # Extract result
    result_match = re.search(r'\[Result\]:\s*(.*)', response)
    result = result_match.group(1).strip() if result_match else "Unknown"

    code_match = re.search(r'```' + toLang + r'(.*?)```', response, re.DOTALL)
    code = code_match.group(1).strip() if code_match else "Unknown"



    return {
        'result': result,
        'code': code,
        'language': toLang
    }