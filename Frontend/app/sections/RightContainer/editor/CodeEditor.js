"use client";
import { useRef, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";
import EditorLoadingOverlay from "../../../elements/codeEditor/EditorLoadingOverlay";
import EditorToolbar from "../../../components/codeEditor/EditorToolbar";
import useCodeEditorLogic from "../../../hooks/codeEditor/useCodeEditorLogic";
import useEditorFullscreen from "../../../hooks/codeEditor/useEditorFullscreen";
import useEditorPreferences from "../../../hooks/codeEditor/useEditorPreferences";
import handleEditorMountFactory from "../../../components/codeEditor/handleEditorMountFactory";
import applyMonacoTheme from "../../../hooks/codeEditor/applyMonacoTheme";

const CodeEditor = (props) => {
  const {
    editorRef,
    settingsRef,
    settingsButtonRef,
    currentLanguage,
    autoSuggestEnabled,
    editorTheme,
    isSettingsOpen,
    setIsSettingsOpen,
    currentFontSize,
    isLangChanging,
    toggleAutoSuggest,
    handleThemeToggle,
    changeFontSize,
    setCurrentFontSize,
    setEditorTheme,
    setAutoSuggestEnabled,
    setLanguage,
    handleLangChange // <-- add this from useCodeEditorLogic
  } = useCodeEditorLogic(props);
  const { code, isFullscreen, onCodeChange, onRunCode, isRunning, isSubmitting, initialFontSize } = props;

  // Fullscreen logic
  const handleToggleFullscreen = useEditorFullscreen(props.onToggleFullscreen);

  // Preferences logic
  useEditorPreferences({
    setLanguage: setLanguage || (() => {}), // fallback to no-op if not provided
    setCurrentFontSize,
    setEditorTheme,
    setAutoSuggestEnabled,
    editorRef,
    initialFontSize
  });

  // Apply theme on mount and on theme change
  useEffect(() => {
    if (editorRef.current && window.monaco) {
      applyMonacoTheme(window.monaco, editorTheme);
    }
  }, [editorTheme, editorRef]);

  // Editor mount handler (split out)
  // Move handleSubmitCode definition above handleEditorMount
  const handleSubmitCode = () => {
    if (!editorRef.current) return;
    const typedCode = editorRef.current.getValue() || '';
    if (props.setActiveTab) props.setActiveTab('results');
    props.onSubmitCode?.({
      description: props.problemData?.description,
      typedSolution: typedCode,
      actualSolution: props.problemData?.solution,
      language: currentLanguage
    });
  };

  const handleEditorMount = handleEditorMountFactory({
    editorRef,
    currentFontSize,
    editorTheme,
    setCurrentFontSize,
    onRunCode,
    handleSubmitCode,
    handleToggleFullscreen,
    onEditorMount: (editor, monaco) => {
      // Enable Cmd/Ctrl+A to select all in the Monaco editor
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyA, () => {
        editor.setSelection({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: editor.getModel().getLineCount(),
          endColumn: editor.getModel().getLineMaxColumn(editor.getModel().getLineCount())
        });
      });
      if (props.onEditorMount) props.onEditorMount(editor, monaco);
    },
    applyMonacoTheme
  });

  const handleResetCode = () => {
    if (editorRef.current) {
      const initialCode = props.problemData?.initial_code || '';
      editorRef.current.setValue(initialCode);
      // Trigger the onCodeChange to update the parent component's state
      if (onCodeChange) {
        onCodeChange(initialCode);
      }
    }
  };

  // Save code to localStorage on change
  const handleCodeChange = (value) => {
    if (onCodeChange) onCodeChange(value);
    localStorage.setItem('editor-code', value || '');
  };

  // Ensure the toggle fullscreen function works in keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // F11 key for fullscreen toggle
      if (event.key === 'F11') {
        event.preventDefault();
        handleToggleFullscreen();
      }
      // Alt+Enter for fullscreen toggle
      if (event.key === 'Enter' && event.altKey) {
        event.preventDefault();
        handleToggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleToggleFullscreen]);
  
  // Determine text/bg color classes based on theme
  const themeClasses = props.theme === "vs-dark" 
    ? { bg: "bg-gray-700", border: "border-gray-600", text: "text-white", hover: "hover:bg-gray-700" }
    : { bg: "bg-white", border: "border-gray-300", text: "text-gray-700", hover: "hover:bg-gray-200" };

  return (
    <div className={`flex flex-col ${isFullscreen ? "fixed inset-0 z-50 bg-slate-900 p-4 overflow-hidden" : "h-full"}`}>
      <EditorToolbar
        {...{
          isFullscreen,
          isLangChanging,
          isSettingsOpen,
          setIsSettingsOpen,
          settingsButtonRef,
          settingsRef,
          currentLanguage,
          handleLangChange,
          autoSuggestEnabled,
          currentFontSize,
          editorTheme,
          toggleAutoSuggest,
          changeFontSize,
          handleThemeToggle,
          handleResetCode,
          handleToggleFullscreen,
          onRunCode,
          isRunning,
          handleSubmitCode,
          isSubmitting
        }}
      />
      <div className="h-full overflow-hidden relative">
        {isLangChanging && <EditorLoadingOverlay />}
        <Editor
          height={isFullscreen ? "calc(100vh - 60px)" : "100%"}
          language={currentLanguage}
          value={code}
          theme={editorTheme}
          onChange={handleCodeChange}
          onMount={handleEditorMount}
          options={{
            fontFamily: 'Lexend, var(--font-sans), system-ui, -apple-system, sans-serif',
            fontSize: currentFontSize,
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
            suggestSelection: "first",
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
            contextmenu: true,
            mouseWheelZoom: true,
            bracketPairColorization: {
              enabled: true
            },
            fontLigatures: true,
            padding: { top: 10 }
          }}
        />
      </div>
    </div>
  );
};

import PropTypes from 'prop-types';

CodeEditor.propTypes = {
  language: PropTypes.string,
  code: PropTypes.string,
  fontSize: PropTypes.number,
  isFullscreen: PropTypes.bool,
  onCodeChange: PropTypes.func,
  onEditorMount: PropTypes.func,
  onRunCode: PropTypes.func,
  onToggleFullscreen: PropTypes.func,
  setLanguage: PropTypes.func,
  onSubmitCode: PropTypes.func,
  problemData: PropTypes.object,
  theme: PropTypes.string,
  isRunning: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  setActiveTab: PropTypes.func // <--- Added
};

CodeEditor.defaultProps = {
  language: "javascript",
  code: "",
  fontSize: 18,
  isFullscreen: false,
  onCodeChange: null,
  onEditorMount: null,
  onRunCode: null,
  onToggleFullscreen: null,
  setLanguage: null,
  onSubmitCode: null,
  problemData: {},
  theme: 'light',
  isRunning: false,
  isSubmitting: false,
  setActiveTab: null // <--- Added
};

export default CodeEditor;