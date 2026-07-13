"use client";
import { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import EditorLoadingOverlay from "../../../elements/codeEditor/EditorLoadingOverlay";
import EditorToolbar from "../../../components/codeEditor/EditorToolbar";
import EditorStatusBar from "../../../components/codeEditor/EditorStatusBar";
import useCodeEditorLogic from "../../../hooks/codeEditor/useCodeEditorLogic";
import useEditorFullscreen from "../../../hooks/codeEditor/useEditorFullscreen";
import useEditorPreferences from "../../../hooks/codeEditor/useEditorPreferences";
import handleEditorMountFactory from "../../../components/codeEditor/handleEditorMountFactory";
import applyMonacoTheme from "../../../hooks/codeEditor/applyMonacoTheme";
import { storageSet } from "../../../utils/storage";

const CodeEditor = (props) => {
  const {
    editorRef,
    settingsRef,
    settingsButtonRef,
    currentLanguage,
    error,
    autoSuggestEnabled,
    isWordWrapEnabled,
    isMinimapEnabled,
    editorTheme,
    isSettingsOpen,
    setIsSettingsOpen,
    currentFontSize,
    isLangChanging,
    toggleAutoSuggest,
    toggleWordWrap,
    toggleMinimap,
    handleThemeToggle,
    changeFontSize,
    setCurrentFontSize,
    setEditorTheme,
    setAutoSuggestEnabled,
    setLanguage,
    handleLangChange,
    handleFormatCode,
  } = useCodeEditorLogic(props);
  const { code, isFullscreen, onCodeChange, onRunCode, isRunning, isSubmitting, initialFontSize } = props;
  const safeCode = typeof code === "string" ? code : "";
  const lineCount = safeCode ? safeCode.split("\n").length : 1;
  const characterCount = safeCode.length;

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
    storageSet('editor-code', value || '');
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
  
  return (
    <div className={`flex flex-col overflow-hidden ${isFullscreen ? "fixed inset-0 z-50 bg-slate-950 p-4" : "h-full bg-slate-950"}`}>
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
          isWordWrapEnabled,
          isMinimapEnabled,
          currentFontSize,
          editorTheme,
          toggleAutoSuggest,
          toggleWordWrap,
          toggleMinimap,
          changeFontSize,
          handleThemeToggle,
          handleResetCode,
          handleToggleFullscreen,
          onRunCode,
          isRunning,
          handleFormatCode,
          handleSubmitCode,
          isSubmitting
        }}
      />
      {error && (
        <div className="border-b border-red-800 bg-red-900/70 px-4 py-2 text-sm text-red-200">
          {error}
        </div>
      )}
      <div className="relative h-full overflow-hidden border-x border-slate-800">
        {isLangChanging && <EditorLoadingOverlay />}
        <Editor
          height={isFullscreen ? "calc(100vh - 132px)" : "100%"}
          language={currentLanguage}
          value={safeCode}
          theme={editorTheme}
          onChange={handleCodeChange}
          onMount={(editor, monaco) => {
            handleEditorMount(editor, monaco);
            // Add format document keybinding (Cmd+Shift+F)
            editor.addCommand(
              monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
              () => {
                editor.getAction('editor.action.formatDocument').run();
              }
            );
          }}
          options={{
            fontFamily: '"JetBrains Mono", "Fira Code", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontSize: typeof currentFontSize === 'number' && !isNaN(currentFontSize) ? currentFontSize : 14,
            minimap: { enabled: isMinimapEnabled },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            lineNumbers: "on",
            folding: true,
            foldingStrategy: "auto",
            tabSize: 2,
            insertSpaces: true,
            wordWrap: isWordWrapEnabled ? "on" : "off",
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
            guides: {
              bracketPairs: true,
              indentation: true,
              highlightActiveIndentation: true,
            },
            stickyScroll: {
              enabled: true,
            },
            padding: { top: 14, bottom: 14 },
            renderValidationDecorations: "on",
            multiCursorModifier: "ctrlCmd",
            find: { addExtraSpaceOnTop: true, seedSearchStringFromSelection: true },
            occurrencesHighlight: true,
            selectionHighlight: true,
            hover: { enabled: true },
            parameterHints: { enabled: true },
            autoClosingBrackets: "always",
            autoClosingQuotes: "always",
            autoClosingDelete: "always",
            autoClosingOvertype: "always",
            autoIndent: "advanced",
            matchBrackets: "always",
            snippetSuggestions: "inline",
            dragAndDrop: true,
            copyWithSyntaxHighlighting: true,
            renderLineHighlight: "all",
            scrollbar: {
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
          }}
        />
      </div>
      <EditorStatusBar
        currentLanguage={currentLanguage}
        lineCount={lineCount}
        characterCount={characterCount}
        currentFontSize={typeof currentFontSize === 'number' && !isNaN(currentFontSize) ? currentFontSize : 14}
        isWordWrapEnabled={isWordWrapEnabled}
        isMinimapEnabled={isMinimapEnabled}
      />
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
  fontSize: 14, // reduced from 18 to 14 for more words per line
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
