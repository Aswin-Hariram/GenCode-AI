import os
import re
import shutil
import subprocess
import sys
import tempfile

from services.language_utils import is_supported_language, normalize_language


EXECUTION_TIMEOUT_SECONDS = 5


def _response(result: str, message: str, language: str, exit_code=None) -> dict:
    normalized_message = "" if message is None else str(message)
    if normalized_message == "":
        normalized_message = "Process completed without output."

    return {
        "result": result,
        "message": normalized_message,
        "language": language,
        "exit_code": exit_code,
    }


def _resolve_binary(binary_name: str) -> str:
    binary_path = shutil.which(binary_name)
    if not binary_path:
        raise RuntimeError(f"Required compiler/runtime '{binary_name}' is not installed.")
    return binary_path


def _extract_java_class_name(code: str) -> str:
    public_match = re.search(r"\bpublic\s+class\s+(\w+)", code)
    if public_match:
        return public_match.group(1)

    class_with_main = re.search(
        r"\bclass\s+(\w+)\b[\s\S]*?\bpublic\s+static\s+void\s+main\s*\(",
        code,
    )
    if class_with_main:
        return class_with_main.group(1)

    any_class = re.search(r"\bclass\s+(\w+)", code)
    if any_class:
        return any_class.group(1)

    raise ValueError("Java code must define a class before it can be executed.")


def _run_process(command, cwd, timeout=EXECUTION_TIMEOUT_SECONDS):
    return subprocess.run(
        command,
        cwd=cwd,
        capture_output=True,
        text=True,
        timeout=timeout,
    )


def _compile_and_run_c_family(code: str, language: str, temp_dir: str) -> dict:
    compiler = _resolve_binary("gcc" if language == "c" else "g++")
    source_name = "main.c" if language == "c" else "main.cpp"
    executable_path = os.path.join(temp_dir, "program")
    source_path = os.path.join(temp_dir, source_name)

    with open(source_path, "w", encoding="utf-8") as source_file:
        source_file.write(code)

    compile_command = [compiler, source_path, "-O2", "-o", executable_path]
    if language == "c":
        compile_command.insert(1, "-std=c17")
    else:
        compile_command.insert(1, "-std=c++17")

    compile_proc = _run_process(compile_command, cwd=temp_dir)
    if compile_proc.returncode != 0:
        return _response(
            "Compilation Error",
            compile_proc.stderr or compile_proc.stdout,
            language,
            compile_proc.returncode,
        )

    result = _run_process([executable_path], cwd=temp_dir)
    if result.returncode != 0:
        return _response(
            "Runtime Error",
            result.stderr or result.stdout,
            language,
            result.returncode,
        )

    return _response("Success", result.stdout or result.stderr, language, result.returncode)


def _compile_and_run_python(code: str, temp_dir: str) -> dict:
    source_path = os.path.join(temp_dir, "main.py")
    with open(source_path, "w", encoding="utf-8") as source_file:
        source_file.write(code)

    result = _run_process([sys.executable, source_path], cwd=temp_dir)
    if result.returncode != 0:
        return _response("Runtime Error", result.stderr or result.stdout, "python", result.returncode)

    return _response("Success", result.stdout or result.stderr, "python", result.returncode)


def _compile_and_run_javascript(code: str, temp_dir: str) -> dict:
    runtime = _resolve_binary("node")
    source_path = os.path.join(temp_dir, "main.js")
    with open(source_path, "w", encoding="utf-8") as source_file:
        source_file.write(code)

    result = _run_process([runtime, source_path], cwd=temp_dir)
    if result.returncode != 0:
        return _response(
            "Runtime Error",
            result.stderr or result.stdout,
            "javascript",
            result.returncode,
        )

    return _response("Success", result.stdout or result.stderr, "javascript", result.returncode)


def _compile_and_run_java(code: str, temp_dir: str) -> dict:
    javac = _resolve_binary("javac")
    java = _resolve_binary("java")
    class_name = _extract_java_class_name(code)
    source_path = os.path.join(temp_dir, f"{class_name}.java")

    with open(source_path, "w", encoding="utf-8") as source_file:
        source_file.write(code)

    compile_proc = _run_process([javac, source_path], cwd=temp_dir)
    if compile_proc.returncode != 0:
        return _response(
            "Compilation Error",
            compile_proc.stderr or compile_proc.stdout,
            "java",
            compile_proc.returncode,
        )

    result = _run_process([java, "-cp", temp_dir, class_name], cwd=temp_dir)
    if result.returncode != 0:
        return _response("Runtime Error", result.stderr or result.stdout, "java", result.returncode)

    return _response("Success", result.stdout or result.stderr, "java", result.returncode)


def compile_code(code: str, lang: str) -> dict:
    language = normalize_language(lang)

    if not code or not str(code).strip():
        return _response("Compilation Error", "Code cannot be empty.", language or str(lang or ""))

    if not is_supported_language(language):
        return _response(
            "Compilation Error",
            f"Unsupported language: {lang}. Supported languages are C, C++, Java, JavaScript, and Python.",
            language or str(lang or ""),
        )

    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            if language == "python":
                return _compile_and_run_python(code, temp_dir)
            if language == "javascript":
                return _compile_and_run_javascript(code, temp_dir)
            if language in {"c", "cpp"}:
                return _compile_and_run_c_family(code, language, temp_dir)
            if language == "java":
                return _compile_and_run_java(code, temp_dir)

    except subprocess.TimeoutExpired:
        return _response(
            "Runtime Error",
            f"Execution timed out after {EXECUTION_TIMEOUT_SECONDS} seconds.",
            language,
        )
    except Exception as exc:
        return _response("Compilation Error", str(exc), language)
