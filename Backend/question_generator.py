import re
from config import llm

def generate_dsa_question(topic: str) -> dict:
    prompt = f"""
    You are an expert Scenario DSA question generator for coding interviews.
    Generate a fully formatted, clean Markdown output for a **Scenario Based DSA problem** based on the
    topic: "{topic}".
    1. Difficulty: Assign a difficulty level (Easy, Medium, Hard) based on the problem's complexity.
    2. Title: [Insert a relevant and concise title for the problem without revealing topic either directly or indirectly in the title]
    3. Markdown:
    The output **must follow this exact structure** for perfect visual formatting:
    
    Difficulty: [Easy/Medium/Hard]
    Title: [Insert Title Here]

    # Problem Statement
    [Insert a real-world inspired problem statement.]
    
    ## Input
    - Describe the input format clearly.
    
    ## Output
    - Describe the output format clearly.
    
    ## Constraints
    - List all constraints (e.g., 1 <= N <= 10^5).
    
    ## Examples
    
    ### Example 1
    - **Input:** [Your sample input here]
    - **Output:** [Your expected output here]
    - **Explanation:** Provide a clear and concise explanation of how the sample works.
    
    ### Example 2
    - **Input:** [Your sample input here]
    - **Output:** [Your expected output here]
    - **Explanation:** Provide a clear and concise explanation of how the sample works.
    
    ## Test Cases
    
    ### Test Case 1
    - **Input:** [Input values for test case 1]
    - **Expected Output:** [Expected output for test case 1]
    
    ### Test Case 2
    - **Input:** [Input values for test case 2]
    - **Expected Output:** [Expected output for test case 2]
    
    ## Time Complexity
    - **Explanation:** Provide a detailed analysis of the time complexity of the solution.
    - **Big O Notation:** O(...)
    
    ## Space Complexity
    - **Explanation:** Provide a detailed analysis of the space complexity of the solution.
    - **Big O Notation:** O(...)

    ## Solution
    ```cpp
    // 🏆 Optimal Solution Strategy
    // - Implement a clean, efficient, and production-ready solution
    // - Focus on readability, performance, and best practices
    // - Include comprehensive error handling and input validation
    // - Provide clear, concise comments explaining the algorithm
    // - Demonstrate advanced C++ techniques and modern language features
    ```

    ## InitialCode
    ```cpp
    // 🧩 Initial Problem-Solving Template
    // Objectives:
    // - Create a structured skeleton for the solution
    // - Include function signatures with clear parameter and return types
    // - Add placeholder comments for key algorithmic steps
    // - Implement a basic main() function with sample test cases
    // - Ensure code is compilable and serves as a starting point
    // - give main function with proper test case exactly like solution
    // - Dont give any hints for solving the problem
    ```
    [Note] Ensure that all sections are properly aligned and must add proper spacing between text and lines with '\n' with Markdown formatting.
    """
    markdown = llm.invoke(prompt).content

    # Extract difficulty
    difficulty_match = re.search(r'^Difficulty:\s*(.+)', markdown, re.MULTILINE)
    difficulty = difficulty_match.group(1).strip() if difficulty_match else "Medium"

    # Extract initial code
    initial_code_match = re.search(r'## InitialCode\n```cpp(.*?)```', markdown, re.DOTALL)
    initial_code = initial_code_match.group(1).strip() if initial_code_match else ""

    # Extract title
    title_match = re.search(r'^Title:\s*(.+)', markdown, re.MULTILINE)
    title = title_match.group(1).strip() if title_match else "Untitled"

    # Extract solution code from markdown
    solution_match = re.search(r'## Solution\n```cpp(.*?)```', markdown, re.DOTALL)
    solution_code = solution_match.group(1).strip() if solution_match else ""

    # Extract and remove time complexity from markdown
    time_complexity_match = re.search(r'(## Time Complexity\n- \*\*Explanation:\*\* .+\n- \*\*Big O Notation:\*\* O\([^)]+\))', markdown, re.MULTILINE | re.DOTALL)
    time_complexity = time_complexity_match.group(1) if time_complexity_match else ''
    markdown = markdown.replace(time_complexity, '') if time_complexity else markdown

    # Extract and remove space complexity from markdown
    space_complexity_match = re.search(r'(## Space Complexity\n- \*\*Explanation:\*\* .+\n- \*\*Big O Notation:\*\* O\([^)]+\))', markdown, re.MULTILINE | re.DOTALL)
    space_complexity = space_complexity_match.group(1) if space_complexity_match else ''
    markdown = markdown.replace(space_complexity, '') if space_complexity else markdown

    # Extract problem statement (description)
    description_match = re.search(r'# Problem Statement\n(.+?)(?=\n##)', markdown, re.DOTALL)
    description = description_match.group(1).strip() if description_match else ""

    # Remove difficulty, title, code blocks, and specific headings from markdown
    cleaned_markdown = re.sub(r'^Difficulty:\s*.+\n?', '', markdown, count=1, flags=re.MULTILINE)
    cleaned_markdown = re.sub(r'^Title:\s*.+\n?', '', cleaned_markdown, count=1, flags=re.MULTILINE)
    
    # Remove Solution heading and its code block
    cleaned_markdown = re.sub(r'## Solution\n```cpp.*?```', '', cleaned_markdown, flags=re.DOTALL)
    
    # Remove InitialCode heading and its code block
    cleaned_markdown = re.sub(r'## InitialCode\n```cpp.*?```', '', cleaned_markdown, flags=re.DOTALL)
    
    # Remove any remaining code blocks
    cleaned_markdown = re.sub(r'```cpp.*?```', '', cleaned_markdown, flags=re.DOTALL).strip()

    return {
        'title': title,
        'difficulty': difficulty,
        'description': description,
        'initial_code': initial_code,
        'markdown': cleaned_markdown,
        'solution': solution_code,
        'time_complexity': time_complexity,
        'space_complexity': space_complexity,
        'testcases': [
            {'input': '"babad"', 'output': '"bab"'},
            {'input': '"cbbd"', 'output': '"bb"'}
        ]
    }