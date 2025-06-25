import subprocess
import tempfile
import os
import shutil
import re

def extract_java_class_name(code: str) -> str:
    """Extracts the public class name from Java source code."""
    match = re.search(r'public\s+class\s+(\w+)', code)
    if match:
        return match.group(1)
    else:
        raise ValueError("No public class found in Java code")

def compile_code(code: str, lang: str) -> dict:
    try:
        if lang == 'python':
            with tempfile.NamedTemporaryFile(suffix=".py", delete=False) as temp:
                temp.write(code.encode())
                temp.flush()
                result = subprocess.run(['python3', temp.name], capture_output=True, text=True, timeout=5)

        elif lang == 'c':
            with tempfile.NamedTemporaryFile(suffix=".c", delete=False) as source:
                source.write(code.encode())
                source.flush()
                exe_file = source.name.replace('.c', '')
                compile_proc = subprocess.run(['gcc', source.name, '-o', exe_file], capture_output=True, text=True)
                if compile_proc.returncode != 0:
                    return {'result': 'Compilation Error', 'message': compile_proc.stderr}
                result = subprocess.run([exe_file], capture_output=True, text=True, timeout=5)

        elif lang == 'cpp':
            with tempfile.NamedTemporaryFile(suffix=".cpp", delete=False) as source:
                source.write(code.encode())
                source.flush()
                exe_file = source.name.replace('.cpp', '')
                compile_proc = subprocess.run(['g++', source.name, '-o', exe_file], capture_output=True, text=True)
                if compile_proc.returncode != 0:
                    return {'result': 'Compilation Error', 'message': compile_proc.stderr}
                result = subprocess.run([exe_file], capture_output=True, text=True, timeout=5)

        elif lang == 'java':
            temp_dir = tempfile.mkdtemp()
            try:
                class_name = extract_java_class_name(code)
                java_file = os.path.join(temp_dir, f"{class_name}.java")
                with open(java_file, "w") as f:
                    f.write(code)
                compile_proc = subprocess.run(['javac', java_file], capture_output=True, text=True)
                if compile_proc.returncode != 0:
                    return {'result': 'Compilation Error', 'message': compile_proc.stderr}
                result = subprocess.run(['java', '-cp', temp_dir, class_name], capture_output=True, text=True, timeout=5)
            finally:
                shutil.rmtree(temp_dir)

        elif lang == 'javascript':
            with tempfile.NamedTemporaryFile(suffix=".js", delete=False) as temp:
                temp.write(code.encode())
                temp.flush()
                result = subprocess.run(['node', temp.name], capture_output=True, text=True, timeout=5)

        else:
            return {'result': 'Compilation Error', 'message': f'Unsupported language: {lang}'}

        return {
            'result': 'success' if result.returncode == 0 else 'Compilation Error',
            'message': result.stdout if result.returncode == 0 else result.stderr,
        }

    except subprocess.TimeoutExpired:
        return {'result': 'Compilation Error', 'message': 'Execution timed out'}
    except Exception as e:
        return {'result': 'Compilation Error', 'message': str(e)}
