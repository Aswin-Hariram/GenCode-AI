from config import llm

def submit_code(actualSolution: str, description: str, typedSolution: str, typedLanguage: str) -> dict:
    # Check if the typed solution is empty
    if not typedSolution or typedSolution.strip() == '':
        return {
            'markdown_report': f"""
## ❌ Empty Solution Submission

**Error: No solution provided**
- Please write your code solution before submitting
- Ensure you have typed something in the code editor
- If you're stuck, you can request a hint or view the problem description

*Tip: Every great solution starts with writing the first line of code!* 🖊️
""",
            'status': 'Not Accepted'
        }

    try:
        # Construct a detailed prompt for evaluating the typed solution
        validation_prompt = f"""
🤖 **Expert Code Evaluation System**
1. Should not autocorrect or change the typed solution code.
2. First check the code has actual logic solution to the problem other than main function. In such case return #NO ACTUAL LOGIC FOUND
3. Your main task is to check whether the submitted solution is correct or not for the description and actual solution.
4. You are an advanced AI programming evaluator tasked with providing a comprehensive, structured, and insightful analysis of a submitted solution.


Problem Context
- **Description**: {description}
- **Actual Logic**: {actualSolution}
- **Submitted Solution**: {typedSolution}[Note: DON'T AUTO CORRECT THE CODE. IT MUST BE ACTUAL SOLUTION. IF IT IS NOT ACTUAL SOLUTION RETURN #NO ACTUAL LOGIC FOUND]

Markdown Format is as follows:
## 1. 🐛 Syntax Analysis
- **Objective**: Detect and highlight any syntax errors
- **Scope**: Complete code structure, language-specific conventions


## 2. 🧩 Logical Correctness
[Note] should be in short points and concise and attractive and easy to understand. 
- **Objective**: Validate problem-solving approach
- **Metrics**:
  - Mention logic mismatch if any in bold
  - Algorithm efficiency
  - Edge case handling
  - Alignment with problem requirements


## 3. 🧪 Test Case Performance
Should only in tabluar form.
Ignore values in main function and pass test case value for testing.
Should run the program with corresponding test case values.
Incase the testcase result is pending/varies for all consider as ok
Note - Nedd atleast 30 test cases for checking the code is well optimized or not.

| Test ID | Category    | Input Level          | Input Value         | Expected Output     | Your Output         | Status |
|--------|-------------|----------------------|---------------------|----------------------|----------------------|--------|
| TC01   | Basic       | Basic                 | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC02   | Basic       | Basic                 | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC03   | Basic       | Basic                 | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC04   | Edge        | Basic                 | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC05   | Edge        | Basic                 | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC06   | Edge        | Basic                 | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC07   | Performance | Basic                 | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC08   | Performance | Basic                 | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC09   | Special     | Basic                 | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC10   | Special     | Basic                 | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC11   | Basic       | Edge                  | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC12   | Basic       | Edge                  | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC13   | Performance | Edge                  | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC14   | Special     | Edge                  | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC15   | Special     | Edge                  | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC16   | Edge        | Edge                  | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC17   | Edge        | Edge                  | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC18   | Edge        | Edge                  | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC19   | Basic       | Edge                  | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC20   | Performance | Edge                  | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC21   | Special     | Edge                  | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC22   | Basic       | Edge                  | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC23   | Basic       | Edge                  | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC24   | Edge        | Edge                  | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC25   | Special     | Edge                  | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC26   | Edge        | Special/Performance   | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC27   | Performance | Special/Performance   | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC28   | Performance | Special/Performance   | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC29   | Special     | Special/Performance   | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |
| TC30   | Special     | Special/Performance   | Input Value Here    | Expected Output      | Your Output Here     | ✅/❌  |


Total Test Cases passed : **--**

Summary should be in tabular form based on values of above table.

### Test Case Summary:

| Category          | Count | Passed | Failed |
|-------------------|-------|--------|--------|
| Basic Cases       | **--** | **--** | **--** |
| Edge Cases        | **--** | **--** | **--** |
| Performance/Special Cases  | **--** | **--** | **--** |
| **Total Test Cases** | **--** | **--** | **--** |



Test Requirements:

1. The test cases should be passed to the typed solution to validate its performance.
2. The test case results must be perfect.
3. Ignore the `main` function and apply test cases over logic or update `main` function input accordingly.



## 4. ⚡ Performance Metrics
| Metric | Reference Solution | User Solution |
|--------|-------------------|---------------|
| Time Complexity | O(?) | O(?) |
| Space Complexity | O(?) | O(?) |

## 5. 🔧 Code Quality Insights
  - **Improvement Suggestions**:
  - [Specific, constructive recommendations]

## 6. 🏆 Overall Evaluation
- **Code Score**: [X/N] [X-passed, N-total from above data]
- **Recommendation**: [Concise advice for improvement]

### 💡 Learning Pathways
1.Suggest similar leetcode problems to upscale my knowledge with links
2.Suggest similar Geeksforgeeks problems to upscale my knowledge with links
3.Suggest similar Codechef problems to upscale my knowledge with links
4.Suggest other similar important Concepts to upscale my knowledge
        """

        # Use the LLM to generate evaluation
        evaluation = llm.invoke(validation_prompt).content

        # Format the markdown report with enhanced styling
        markdown_report = f"""
# 🚀 Code Submission Evaluation Report

## 📊 Comprehensive Solution Analysis

{evaluation}

---

*Generated by AI Code Mentor* 🤖✨
        """
        
        # Determine solution status based on evaluation content
        status = 'Not Accepted'
        
        # Extract test case data from the table
        test_case_data = {
            'total': 0,
            'passed': 0,
            'failed': 0,
            'pass_rate': 0,
            'details': []
        }
        
        # Parse the test case table if it exists
        if '| Test ID |' in evaluation:
            # Find the test case table
            table_start = evaluation.find('| Test ID |')
            table_end = evaluation.find('\n\n', table_start)
            table = evaluation[table_start:table_end].strip()
            
            # Process each line of the table
            for line in table.split('\n')[2:]:  # Skip header and separator lines
                if '|' in line:
                    parts = [p.strip() for p in line.split('|')[1:-1]]  # Remove empty first and last parts
                    if len(parts) >= 7:  # Ensure we have all columns
                        test_case = {
                            'id': parts[0],
                            'category': parts[1],
                            'input_level': parts[2],
                            'input_value': parts[3],
                            'expected_output': parts[4],
                            'actual_output': parts[5],
                            'status': '✅' in parts[6]
                        }
                        test_case_data['details'].append(test_case)
                        test_case_data['total'] += 1
                        if test_case['status']:
                            test_case_data['passed'] += 1
                        else:
                            test_case_data['failed'] += 1
            
            # Calculate pass rate
            if test_case_data['total'] > 0:
                test_case_data['pass_rate'] = round((test_case_data['passed'] / test_case_data['total']) * 100, 2)
        
        # First check for critical failure indicators
        if '#NO ACTUAL LOGIC FOUND' in evaluation:
            status = 'Not Accepted'
        else:
            # Check if we have test case data
            print(test_case_data['pass_rate'])
            if test_case_data['pass_rate'] == 100:
                status = 'Accepted'
            elif test_case_data['pass_rate'] > 0:
                status = 'Partially Accepted'
            else:
                status = 'Not Accepted'
          
        
        return {
            'markdown_report': markdown_report,
            'status': status
        }

    except Exception as e:
        return {
            'markdown_report': f"""
## ❌ Submission Error

**An error occurred during code evaluation:**
{str(e)}
Please recheck your solution format or contact the support team if the issue persists.
""",
            'status': 'Not Accepted'
        }