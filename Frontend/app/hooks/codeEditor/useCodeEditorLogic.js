import { useRef, useState } from "react";
import applyMonacoTheme from "../../../hooks/codeEditor/applyMonacoTheme";

export default function useCodeEditorLogic({
  language,
  initialFontSize,
  setLanguage,
  onCodeChange,
  onEditorMount,
  onRunCode,
  onToggleFullscreen,
  onSubmitCode,
  problemData,
  setActiveTab
}) {
  // Provide all refs and state expected by CodeEditor.js
  const editorRef = useRef(null);
  const settingsRef = useRef(null);
  const settingsButtonRef = useRef(null);
  const [currentLanguage, setCurrentLanguage] = useState(language || "javascript");
  const [autoSuggestEnabled, setAutoSuggestEnabled] = useState(true);
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState(initialFontSize || 16);
  const [isLangChanging, setIsLangChanging] = useState(false);

  // Dummy handlers for now
  const toggleAutoSuggest = () => setAutoSuggestEnabled((v) => !v);
  const handleThemeToggle = () => setEditorTheme((t) => (t === "vs-dark" ? "light" : "vs-dark"));
  const changeFontSize = (size) => setCurrentFontSize(size);
  const handleLangChange = (lang) => {
    setCurrentLanguage(lang);
    setLanguage?.(lang);
  };

  return {
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
    handleLangChange
  };
}
