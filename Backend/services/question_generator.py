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
        You are an elite technical interview problem designer and competitive programming author.

    Generate a premium-quality, scenario-based DSA problem inspired by the hidden topic "{topic}". The topic should influence only the internal solution—not the title, story, or wording.

    The output should feel comparable to problems from top interview platforms while remaining original, realistic, and enjoyable to read.

    Global requirements:
    - Produce professional, polished Markdown.
    - Make the problem feel like it belongs on a premium coding platform.
    - Never explicitly mention or hint at the underlying DSA topic.
    - The title should be natural, memorable, and scenario-driven.
    - The scenario should be realistic (software systems, logistics, gaming, finance, manufacturing, transportation, robotics, education, healthcare, networking, etc.).
    - Avoid fantasy unless absolutely necessary.
    - Every section should be concise, information-dense, and easy to scan.
    - Use proper Markdown spacing.
    - Use headings exactly as specified.
    - Use bullet lists where appropriate.
    - Use fenced code blocks only where requested.
    - Use blockquotes only where requested.
    - Use Markdown tables with aligned columns.
    - Make examples progressively meaningful.
    - Ensure all examples, explanations, constraints, and code remain perfectly consistent.
    - The constraints must justify the expected algorithmic complexity.
    - Do not introduce ambiguity.
    - Avoid redundant wording.
    - Avoid unnecessary filler text.
    - Avoid revealing implementation hints through variable names.
    - Ensure all terminology remains consistent throughout.
    - The problem should be solvable using only the information provided.
    - Starter code must compile successfully.
    - Do not place solving logic inside starter code.
    - Return only the requested Markdown.
    - Do not include introductory or concluding commentary.


    The output must follow this exact top-level structure:
    
    Difficulty: [Easy/Medium/Hard]
    Title: [Insert Title Here]

    # Problem Statement
    [Clear problem description.] want it to look like LeetCode, HackerRank, Codeforces, or coding interview platforms
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
