"use client";
import { useRef, useState, useEffect } from "react";
import { FiPlay, FiMaximize, FiMinimize } from "react-icons/fi";
import Editor from "@monaco-editor/react";

const CodeEditor = ({
  language,
  code,
  fontSize,
  isFullscreen,
  onCodeChange,
  onEditorMount,
  onRunCode,
  onToggleFullscreen,
  setLanguage,
  onSubmitCode,
  problemData // Add problemData prop
}) => {
  const editorRef = useRef(null);
  const [autoSuggestEnabled, setAutoSuggestEnabled] = useState(true);
  const [theme, setTheme] = useState("vs-dark");

  useEffect(() => {
    const storedLang = localStorage.getItem("editor-lang");
    const storedFont = localStorage.getItem("editor-font");
    if (storedLang) setLanguage(storedLang);
    if (storedFont) editorRef.current?.updateOptions({ fontSize: parseInt(storedFont) });
  }, []);

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;

    editor.onDidChangeConfiguration(() => {
      const opts = editor.getRawOptions();
      localStorage.setItem("editor-font", opts.fontSize?.toString());
    });

    // Keyboard shortcut: Ctrl+Enter
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunCode?.();
    });

    if (onEditorMount) onEditorMount(editor, monaco);
  };

  const handleSubmitCode = () => {
    const typedCode = editorRef.current?.getValue() || '';
    
    // Log description
    console.log('Problem Description:', problemData?.description || 'No description available');
    
    // Log typed solution
    console.log('Typed Solution:', typedCode);
    
    // Log actual solution
    console.log('Actual Solution:', problemData?.solution || 'No solution available');
    
    // Log typed language
    console.log('Typed Language:', language);

    // Call onSubmitCode if provided
    onSubmitCode?.({
      description: problemData?.description,
      typedSolution: typedCode,
      actualSolution: problemData?.solution,
      language: language
    });
  };

  const toggleAutoSuggest = () => {
    const newValue = !autoSuggestEnabled;
    setAutoSuggestEnabled(newValue);
    editorRef.current?.updateOptions({
      quickSuggestions: newValue,
      suggestOnTriggerCharacters: newValue,
      acceptSuggestionOnEnter: newValue ? "on" : "off"
    });
    if (newValue) {
      editorRef.current?.trigger("manual", "editor.action.triggerSuggest", {});
    }
  };

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === "vs-dark" ? "light" : "vs-dark"));
  };

  return (
    <div className={`flex flex-col ${isFullscreen ? "fixed inset-0 z-50 bg-slate-900 p-4 overflow-hidden" : "h-full"}`}>
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <select
            className="bg-slate-800 text-white px-2 py-1 text-sm rounded border border-slate-700"
            value={language}
            onChange={(e) => {
              localStorage.setItem("editor-lang", e.target.value);
              setLanguage(e.target.value);
            }}
          >
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>
          <button
            className={`text-sm px-2 py-1 rounded border ${autoSuggestEnabled ? "bg-green-700 border-green-600" : "bg-slate-800 border-slate-700 hover:bg-slate-700 text-white"}`}
            onClick={toggleAutoSuggest}
          >
            Auto {autoSuggestEnabled ? "On" : "Off"}
          </button>
          <button
            className="bg-indigo-700 hover:bg-indigo-800 text-white text-sm px-2 py-1 rounded"
            onClick={handleThemeToggle}
          >
            {theme === "vs-dark" ? "Dark" : "Light"}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            className="bg-slate-800 hover:bg-slate-700 text-sm px-2 py-1 rounded border border-slate-700"
            onClick={onToggleFullscreen}
          >
            {isFullscreen ? <FiMinimize className="w-4 h-4" /> : <FiMaximize className="w-4 h-4 text-white" />}
          </button>
          <button
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-3 py-1 rounded flex items-center"
            onClick={onRunCode}
          >
            <FiPlay className="mr-1" /> Run 
          </button>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
            onClick={handleSubmitCode}
          >
            Submit
          </button>
        </div>
      </div>

      <div className="h-full overflow-hidden">
        <Editor
          height={isFullscreen ? "calc(100vh - 120px)" : "100%"}
          language={language}
          value={code}
          theme={theme}
          onChange={onCodeChange}
          onMount={handleEditorMount}
          onDoubleClick={onToggleFullscreen}
          options={{
            fontSize: fontSize,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            lineNumbers: "on",
            folding: true,
            tabSize: 2,
            wordWrap: "on",
            formatOnPaste: true,
            formatOnType: true,
            quickSuggestions: autoSuggestEnabled,
            suggestOnTriggerCharacters: autoSuggestEnabled,
            acceptSuggestionOnEnter: autoSuggestEnabled ? "on" : "off",
            tabCompletion: "on",
            suggestSelection: "first"
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
