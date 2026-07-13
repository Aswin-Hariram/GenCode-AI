import re
import random

from config.config import get_llm

FAANG_COMPANIES = ["Google", "Meta", "Amazon", "Apple", "Netflix"]


def _parse_generated_question(markdown: str, topic: str, source: str = "topic", company: str | None = None) -> dict:
    def extract_cpp_block(section_name: str) -> str:
        match = re.search(
            rf"## {re.escape(section_name)}\s*```(?:cpp|c\+\+)?\s*(.*?)```",
            markdown,
            re.DOTALL | re.IGNORECASE,
        )
        return match.group(1).strip() if match else ""

    # Extract difficulty
    difficulty_match = re.search(r'^Difficulty:\s*(.+)', markdown, re.MULTILINE)
    difficulty = difficulty_match.group(1).strip() if difficulty_match else "Medium"

    # Extract initial code
    initial_code = extract_cpp_block("InitialCode")

    # Extract title
    title_match = re.search(r'^Title:\s*(.+)', markdown, re.MULTILINE)
    title = title_match.group(1).strip() if title_match else "Untitled"

    # Extract solution code from markdown
    solution_code = extract_cpp_block("Solution")

    # Extract and remove time complexity from markdown
    time_complexity_match = re.search(r'(## Time Complexity.*?)(?=\n## |\Z)', markdown, re.MULTILINE | re.DOTALL)
    time_complexity = time_complexity_match.group(1) if time_complexity_match else ''
    markdown = markdown.replace(time_complexity, '') if time_complexity else markdown

    # Extract and remove space complexity from markdown
    space_complexity_match = re.search(r'(## Space Complexity.*?)(?=\n## |\Z)', markdown, re.MULTILINE | re.DOTALL)
    space_complexity = space_complexity_match.group(1) if space_complexity_match else ''
    markdown = markdown.replace(space_complexity, '') if space_complexity else markdown

    # Extract problem statement (description)
    description_match = re.search(r'# Problem Statement\n(.+?)(?=\n##)', markdown, re.DOTALL)
    description = description_match.group(1).strip() if description_match else ""

    # Remove difficulty, title, code blocks, and specific headings from markdown
    cleaned_markdown = re.sub(r'^Difficulty:\s*.+\n?', '', markdown, count=1, flags=re.MULTILINE)
    cleaned_markdown = re.sub(r'^Title:\s*.+\n?', '', cleaned_markdown, count=1, flags=re.MULTILINE)
    cleaned_markdown = re.sub(r'## Solution\s*```(?:cpp|c\+\+)?\s*.*?```', '', cleaned_markdown, flags=re.DOTALL | re.IGNORECASE)
    cleaned_markdown = re.sub(r'## InitialCode\s*```(?:cpp|c\+\+)?\s*.*?```', '', cleaned_markdown, flags=re.DOTALL | re.IGNORECASE)
    cleaned_markdown = re.sub(r'```(?:cpp|c\+\+)\s*.*?```', '', cleaned_markdown, flags=re.DOTALL | re.IGNORECASE).strip()

    # Extract test cases
    testcases = []
    test_case_pattern = r'### Test Case \d+\s*- \*\*Input:\*\*\s*([^\n]+)\s*- \*\*Expected Output:\*\*\s*([^\n]+)'
    test_case_matches = re.finditer(test_case_pattern, markdown, re.MULTILINE | re.DOTALL)
    
    for match in test_case_matches:
        test_input = match.group(1).strip()
        expected_output = match.group(2).strip()
        testcases.append({
            'input': test_input,
            'expected_output': expected_output
        })
    
    hidden_testcases = []
    hidden_testcases_section = re.search(r'## 15 to 20 Hidden Test Cases for Efficient Evaluation\n```(.*?)```', markdown, re.DOTALL)
    if hidden_testcases_section:
        hidden_testcases_text = hidden_testcases_section.group(1).strip()
        hidden_testcase_matches = re.finditer(
            r'### Test Case \d+\s*Input:\s*([^\n]+)\s*Expected Output:\s*([^\n]+)',
            hidden_testcases_text,
            re.MULTILINE | re.DOTALL,
        )
        for match in hidden_testcase_matches:
            hidden_testcases.append({
                'input': match.group(1).strip(),
                'expected_output': match.group(2).strip()
            })

    cleaned_markdown = re.sub(r'## Test Cases.*?(?=## \w|$)', '', cleaned_markdown, flags=re.DOTALL).strip()
    cleaned_markdown = re.sub(r'## 15 to 20 Hidden Test Cases for Efficient Evaluation\n```.*?```', '', cleaned_markdown, flags=re.DOTALL).strip()

    return {
        'title': title,
        'difficulty': difficulty,
        'description': description,
        'initial_code': initial_code,
        'markdown': cleaned_markdown,
        'solution': solution_code,
        'realtopic': topic,
        'time_complexity': time_complexity,
        'space_complexity': space_complexity,
        'testcases': testcases,
        'hidden_testcases': hidden_testcases,
        'source': source,
        'company': company or 'FAANG',
    }


def generate_dsa_question(topic: str) -> dict:
    prompt = f"""
    You are an expert scenario-based DSA problem writer for interview practice.
    Generate a polished, visually rich Markdown problem based on the topic "{topic}" without explicitly naming the topic in the title or story.

    Global requirements:
    - The problem should feel premium, crisp, and realistic, like a curated coding-practice website.
    - Use clean Markdown that looks good when rendered.
    - Add structure, rhythm, and visual variety with short paragraphs, blockquotes, tables, and fenced text blocks where helpful.
    - Do not reveal the hidden underlying DSA topic in the title, story, starter code, or solution.
    - Do not put the actual solving logic into the initial code.
    - Keep the examples practical and easy to scan.
    - Keep the starter code compilable.
    - Return only the requested content, with no extra commentary.

    The output must follow this exact top-level structure:
    
    Difficulty: [Easy/Medium/Hard]
    Title: [Insert Title Here]

    # Problem Statement
    [Write a vivid scenario-driven problem statement with a strong opening paragraph.]
    [After the opening, add a short blockquote beginning with `> Why this matters:`.]
    [Then add a concise `### Goal` subsection describing exactly what the user must compute.]

    ## Input
    [Explain the input clearly in 2 to 4 short bullet points.]
    
    ## Output
    [Explain the output clearly in 1 to 3 short bullet points.]
    
    ## Constraints
    [Use a Markdown table with columns: Item | Range | Notes]
    
    ## Examples
    
    ### Example 1
    **Input**
    ```text
    [Your sample input here]
    ```
    **Output**
    ```text
    [Your expected output here]
    ```
    **Explanation**
    [Explain the sample clearly. If structure matters, show a tiny visual sketch in Markdown.]

    ### Example 2
    **Input**
    ```text
    [Your sample input here]
    ```
    **Output**
    ```text
    [Your expected output here]
    ```
    **Explanation**
    [Explain the sample clearly.]

    ## Hints For Careful Readers
    [Add 2 to 4 subtle, non-spoiler bullets that improve clarity without giving away the algorithm.]

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


    ## InitialCode
    ```cpp
    [Return only clean compilable C++ starter code.]
    [Include a function signature, minimal includes, and a small main with the same example format.]
    [Use a single TODO comment exactly as: TODO: implement logic here]
    [Do not reveal the hidden topic.]
    ```

    ## Solution
    ```cpp
    [Return a clean, production-quality C++ solution with concise comments.]
    [Keep it readable and efficient.]
    [Include a main function using the same example style.]
    [Do not reveal the hidden topic by name.]
    ```
    """
    markdown = get_llm().invoke(prompt).content
    return _parse_generated_question(markdown, topic, source="topic")


def generate_random_faang_question(existing_topics: list[str] | None = None) -> dict:
    company = random.choice(FAANG_COMPANIES)
    avoided_topics = ", ".join(sorted({topic.strip() for topic in (existing_topics or []) if topic.strip()})[:20])
    prompt = f"""
    You are designing a brand-new FAANG interview-level coding question.

    Requirements:
    - This question must be fresh and not based on the stored topic list.
    - Difficulty should be Medium or Hard.
    - The vibe should feel like a high-quality onsite or screening problem at {company}.
    - The writing must feel premium, modern, and visually strong in Markdown.
    - Do not mention a specific LeetCode topic name.
    - Do not reveal the hidden algorithm directly in the title or story.
    - Avoid centering the question around any of these stored topics or titles: {avoided_topics or "None provided"}.
    - Prefer an original business scenario instead of a textbook framing.
    - Keep the written explanation concise and scannable.
    - Keep the total non-code response compact enough for a fast UI render.

    Return the exact same output format used below:

    Difficulty: [Easy/Medium/Hard]
    Title: [Insert Title Here]

    # Problem Statement
    [Write a vivid scenario-driven problem statement with a strong opening paragraph.]
    [After the opening, add a short blockquote beginning with `> Why this matters:`.]
    [Then add a concise `### Goal` subsection describing exactly what the user must compute.]

    ## Input
    [Explain the input clearly in 2 to 4 short bullet points.]
    
    ## Output
    [Explain the output clearly in 1 to 3 short bullet points.]
    
    ## Constraints
    [Use a Markdown table with columns: Item | Range | Notes]
    
    ## Examples
    
    ### Example 1
    **Input**
    ```text
    [Your sample input here]
    ```
    **Output**
    ```text
    [Your expected output here]
    ```
    **Explanation**
    [Explain the sample clearly. If structure matters, show a tiny visual sketch in Markdown.]

    ### Example 2
    **Input**
    ```text
    [Your sample input here]
    ```
    **Output**
    ```text
    [Your expected output here]
    ```
    **Explanation**
    [Explain the sample clearly.]

    ## Hints For Careful Readers
    [Add 2 to 4 subtle, non-spoiler bullets that improve clarity without giving away the algorithm.]

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

    ## InitialCode
    ```cpp
    [Return only clean compilable C++ starter code.]
    [Include a function signature, minimal includes, and a small main with the same example format.]
    [Use a single TODO comment exactly as: TODO: implement logic here]
    [Do not reveal the hidden topic.]
    ```

    ## Solution
    ```cpp
    [Return a clean, production-quality C++ solution with concise comments.]
    [Keep it readable and efficient.]
    [Include a main function using the same example style.]
    [Do not reveal the hidden topic by name.]
    ```
    """

    markdown = get_llm().invoke(prompt).content
    return _parse_generated_question(markdown, "Random FAANG Interview", source="faang_random", company=company)
