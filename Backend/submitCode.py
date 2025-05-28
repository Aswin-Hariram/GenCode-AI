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


### 🔍 Problem Context
- **Description**: {description}
- **Expected Solution Language**: {typedLanguage}
- **Actual Solution**: {actualSolution} [Note: DON'T AUTO CORRECT THE CODE. IT MUST BE ACTUAL SOLUTION. IF IT IS NOT ACTUAL SOLUTION RETURN #NO ACTUAL LOGIC FOUND]
- **Submitted Solution**: {typedSolution}

## 1. 🐛 Syntax Analysis
- **Objective**: Detect and highlight any syntax errors
- **Scope**: Complete code structure, language-specific conventions


## 2. 🧩 Logical Correctness
- **Objective**: Validate problem-solving approach
- **Metrics**:
  - Algorithm efficiency
  - Edge case handling
  - Alignment with problem requirements
[Note] should be in points

## 3. 🧪 Test Case Performance
Should only in tabluar form.
Ignore values in main function and pass test case value for testing.
Should run the program with corresponding test case values.
Incase the testcase result is pending/varies for all consider as ok
Note - Nedd atleast 10 test cases for each category for checking the code is well optimized or not.
<table style="width:100%; border-collapse: collapse;">
    <thead>
        <tr style="background-color: #f3f3f3;">
            <th style="padding: 12px; border: 1px solid #ddd;">Test ID</th>
            <th style="padding: 12px; border: 1px solid #ddd;">Category</th>
            <th style="padding: 12px; border: 1px solid #ddd;">Input</th>
            <th style="padding: 12px; border: 1px solid #ddd;">Expected</th>
            <th style="padding: 12px; border: 1px solid #ddd;">Status</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">TC01</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Basic</td>
            <td style="padding: 12px; border: 1px solid #ddd;">[Standard Input]</td>
            <td style="padding: 12px; border: 1px solid #ddd;">[Expected Output]</td>
            <td style="padding: 12px; border: 1px solid #ddd;">✅/❌</td>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">TC02</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Basic</td>
            <td style="padding: 12px; border: 1px solid #ddd;">[Minimum Valid]</td>
            <td style="padding: 12px; border: 1px solid #ddd;">[Expected Output]</td>
            <td style="padding: 12px; border: 1px solid #ddd;">✅/❌</td>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">TC03</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Basic</td>
            <td style="padding: 12px; border: 1px solid #ddd;">[Maximum Valid]</td>
            <td style="padding: 12px; border: 1px solid #ddd;">[Expected Output]</td>
            <td style="padding: 12px; border: 1px solid #ddd;">✅/❌</td>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">TC04</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Edge</td>
            <td style="padding: 12px; border: 1px solid #ddd;">[Empty Input]</td>
            <td style="padding: 12px; border: 1px solid #ddd;">[Expected Output]</td>
            <td style="padding: 12px; border: 1px solid #ddd;">✅/❌</td>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">TC05</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Edge</td>
            <td style="padding: 12px; border: 1px solid #ddd;">[Null Input]</td>
            <td style="padding: 12px; border: 1px solid #ddd;">[Expected Output]</td>
            <td style="padding: 12px; border: 1px solid #ddd;">✅/❌</td>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">TC06</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Edge</td>
            <td style="padding: 12px; border: 1px solid #ddd;">[Boundary Value]</td>
            <td style="padding: 12px; border: 1px solid #ddd;">[Expected Output]</td>
            <td style="padding: 12px; border: 1px solid #ddd;">✅/❌</td>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">TC07</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Performance</td>
            <td style="padding: 12px; border: 1px solid #ddd;">[Large Dataset]</td>
            <td style="padding: 12px; border: 1px solid #ddd;">[Expected Output]</td>
            <td style="padding: 12px; border: 1px solid #ddd;">⚠️</td>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">TC08</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Performance</td>
            <td style="padding: 12px; border: 1px solid #ddd;">[Stress Test]</td>
            <td style="padding: 12px; border: 1px solid #ddd;">[Expected Output]</td>
            <td style="padding: 12px; border: 1px solid #ddd;">⚠️</td>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">TC09</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Special</td>
            <td style="padding: 12px; border: 1px solid #ddd;">[Special Chars]</td>
            <td style="padding: 12px; border: 1px solid #ddd;">[Expected Output]</td>
            <td style="padding: 12px; border: 1px solid #ddd;">✅/❌</td>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">TC10</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Special</td>
            <td style="padding: 12px; border: 1px solid #ddd;">[Unicode]</td>
            <td style="padding: 12px; border: 1px solid #ddd;">[Expected Output]</td>
            <td style="padding: 12px; border: 1px solid #ddd;">✅/❌</td>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">TC11</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Basic</td>
            <td style="padding: 12px; border: 1px solid #ddd;">[Average Case]</td>
            <td style="padding: 12px; border: 1px solid #ddd;">[Expected Output]</td>
            <td style="padding: 12px; border: 1px solid #ddd;">✅/❌</td>
        </tr>
      
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">TC13</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Performance</td>
            <td style="padding: 12px; border: 1px solid #ddd;">[Concurrent]</td>
            <td style="padding: 12px; border: 1px solid #ddd;">[Expected Output]</td>
            <td style="padding: 12px; border: 1px solid #ddd;">⚠️</td>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">TC14</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Special</td>
            <td style="padding: 12px; border: 1px solid #ddd;">[Format]</td>
            <td style="padding: 12px; border: 1px solid #ddd;">[Expected Output]</td>
            <td style="padding: 12px; border: 1px solid #ddd;">✅/❌</td>
        </tr>
        <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">TC15</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Special</td>
            <td style="padding: 12px; border: 1px solid #ddd;">[Validation]</td>
            <td style="padding: 12px; border: 1px solid #ddd;">[Expected Output]</td>
            <td style="padding: 12px; border: 1px solid #ddd;">✅/❌</td>
        </tr>
    </tbody>
</table>
Summary should be in tabular form based on values of above table.
<div style="margin-top: 20px;">
    <h4>Test Case Summary:</h4>
    <table style="width:100%; border-collapse: collapse;">
        <thead>
            <tr style="background-color: #f3f3f3;">
                <th style="padding: 12px; border: 1px solid #ddd;">Category</th>
                <th style="padding: 12px; border: 1px solid #ddd;">Count</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="padding: 12px; border: 1px solid #ddd;">Basic Cases</td>
                <td style="padding: 12px; border: 1px solid #ddd;">4</td>
            </tr>
            <tr>
                <td style="padding: 12px; border: 1px solid #ddd;">Edge Cases</td>
                <td style="padding: 12px; border: 1px solid #ddd;">4</td>
            </tr>
            <tr>
                <td style="padding: 12px; border: 1px solid #ddd;">Performance Tests</td>
                <td style="padding: 12px; border: 1px solid #ddd;">3</td>
            </tr>
            <tr>
                <td style="padding: 12px; border: 1px solid #ddd;">Special Cases</td>
                <td style="padding: 12px; border: 1px solid #ddd;">4</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
                <td style="padding: 12px; border: 1px solid #ddd;"><strong>Total Test Cases</strong></td>
                <td style="padding: 12px; border: 1px solid #ddd;"><strong>15</strong></td>
            </tr>
        </tbody>
    </table>
</div>
<div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
    <h4 style="margin-top: 0;">Test Requirements:</h4>
    <ol style="margin-bottom: 0;">
        <li>The test cases should be passed to the typed solution to validate its performance.</li>
        <li>The test cases results must be perfect.</li>
        <li>Ignore main function and apply test case over logic or update main function input accordingly.</li>
    </ol>
</div>




## 4. ⚡ Performance Metrics
| Metric | Reference Solution | User Solution | Improvement Potential |
|--------|-------------------|---------------|----------------------|
| Time Complexity | O(?) | O(?) | +/- % |
| Space Complexity | O(?) | O(?) | +/- % |

## 5. 🔧 Code Quality Insights
- **Strengths**:
  - [Positive aspects of the solution]
- **Improvement Suggestions**:
  - [Specific, constructive recommendations]

## 6. 🏆 Overall Evaluation
- **Code Score**: [X/N] [X-passed, N-total from above data]
- **Recommendation**: [Concise advice for improvement]

### 💡 Learning Pathways
- Suggested learning resources
- Recommended practice problems
- Potential optimization techniques
        """

        # Use the LLM to generate evaluation
        evaluation = llm.invoke(validation_prompt).content

        # Format the markdown report with enhanced styling
        markdown_report = f"""
# 🚀 Code Submission Evaluation Report

## 📊 Comprehensive Solution Analysis

{evaluation}

---

## 🌟 Next Steps
- 🔍 Carefully review the detailed feedback
- 🛠️ Implement suggested improvements
- 📈 Practice consistently
- 💪 Keep learning and growing!

*Generated by AI Code Mentor* 🤖✨
        """
        
        # Determine solution status based on evaluation content
        status = 'Not Accepted'
        
        # Extract test case data from the table
        test_case_data = {}
        try:
            # Parse test case table
            if '<table' in evaluation and '</table>' in evaluation:
                table_sections = evaluation.split('<table')
                for section in table_sections[1:]:  # Skip the first split which is before any table
                    if '</table>' in section:
                        table_content = '<table' + section.split('</table>')[0] + '</table>'
                        
                        # Check if this is the test case table (contains TC01, TC02, etc.)
                        if 'TC0' in table_content and ('✅' in table_content or '❌' in table_content):
                            # Count passes and failures
                            passed_tests = table_content.count('✅')
                            failed_tests = table_content.count('❌')
                            total_tests = passed_tests + failed_tests
                            
                            if total_tests > 0:
                                test_case_data['passed'] = passed_tests
                                test_case_data['failed'] = failed_tests
                                test_case_data['total'] = total_tests
                                test_case_data['pass_rate'] = (passed_tests / total_tests) * 100
                                break  # Found the test case table, no need to continue
        except Exception:
            # If parsing fails, we'll fall back to simpler methods
            pass
        
        # First check for critical failure indicators
        if '#NO ACTUAL LOGIC FOUND' in evaluation:
            status = 'Not Accepted'
        else:
            # Check if we have test case data
            if test_case_data and 'pass_rate' in test_case_data:
                pass_rate = test_case_data['pass_rate']
                
                # Determine status based on test case pass rate
                if pass_rate == 100:  # All tests passed
                    status = 'Accepted'
                elif pass_rate >= 70:  # Most tests passed
                    status = 'Partially Accepted'
                elif pass_rate > 0:   # Some tests passed
                    status = 'Partially Accepted'
                else:  # No tests passed
                    status = 'Not Accepted'
            else:
                # Fallback to Code Score if available
                if 'Code Score' in evaluation:
                    try:
                        score_text = evaluation.split('Code Score:')[1].split('[')[1].split(']')[0]
                        if '/' in score_text:
                            x, n = map(int, score_text.split('/'))
                            score_percentage = (x / n) * 100
                            
                            # Determine status based on score percentage
                            if score_percentage >= 90:
                                status = 'Accepted'
                            elif score_percentage >= 50:
                                status = 'Partially Accepted'
                            else:
                                status = 'Not Accepted'
                    except (IndexError, ValueError):
                        # If we can't parse the score, use simpler methods
                        pass
                
                # If still not determined, use simpler methods
                if status == 'Not Accepted':
                    # Count test case symbols throughout the evaluation
                    passed_tests = evaluation.count('✅')
                    failed_tests = evaluation.count('❌')
                    
                    if passed_tests > 0 and failed_tests == 0:
                        status = 'Accepted'
                    elif passed_tests > 0 and failed_tests > 0:
                        # Some tests passed but not all
                        if passed_tests > failed_tests:
                            status = 'Partially Accepted'
                        else:
                            status = 'Not Accepted'
            
            # Additional keyword analysis
            positive_indicators = ['correct solution', 'perfect solution', 'optimal solution', 'all test cases pass']
            negative_indicators = ['incorrect solution', 'fails', 'error', 'wrong approach', 'time limit exceeded']
            
            # Check for positive indicators
            if any(indicator.lower() in evaluation.lower() for indicator in positive_indicators):
                if status == 'Not Accepted':  # Don't downgrade from better statuses
                    status = 'Partially Accepted'
            
            # Check for negative indicators that would override
            if any(indicator.lower() in evaluation.lower() for indicator in negative_indicators):
                if status == 'Accepted':  # Only downgrade from Accepted
                    status = 'Partially Accepted'
        
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