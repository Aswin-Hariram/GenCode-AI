from services.codeCompiler import compile_code
from services.language_utils import language_label, normalize_language


def test_normalize_language_aliases():
    assert normalize_language("py") == "python"
    assert normalize_language("python3") == "python"
    assert normalize_language("js") == "javascript"
    assert normalize_language("c++") == "cpp"


def test_language_labels_are_human_readable():
    assert language_label("cpp") == "C++"
    assert language_label("javascript") == "JavaScript"


def test_compile_code_accepts_common_aliases():
    python_result = compile_code('print("hi")', "py")
    js_result = compile_code('console.log("hi")', "js")

    assert python_result["result"] == "Success"
    assert python_result["language"] == "python"
    assert "hi" in python_result["message"]

    assert js_result["result"] == "Success"
    assert js_result["language"] == "javascript"
    assert "hi" in js_result["message"]


def test_compile_code_preserves_stdout_formatting():
    result = compile_code('print("hi")', "python")

    assert result["result"] == "Success"
    assert result["message"] == "hi\n"
