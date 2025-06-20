import { useRef, useState, useEffect, useCallback } from "react";
import applyMonacoTheme from "./applyMonacoTheme";

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
  const EDITOR_LANG_KEY = 'editor-lang';
  const DEFAULT_LANGUAGE = 'cpp';
  const [currentLanguage, setCurrentLanguage] = useState(language || DEFAULT_LANGUAGE);
  const [error, setError] = useState(null);
  const editorRef = useRef(null);
  const prevLangRef = useRef(currentLanguage);
  const [autoSuggestEnabled, setAutoSuggestEnabled] = useState(true);
  const [editorTheme, setEditorTheme] = useState(() => {
    const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('editor-theme') : null;
    return storedTheme || 'vs-dark';
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef(null);
  const settingsButtonRef = useRef(null);
  const [currentFontSize, setCurrentFontSize] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('editor-font');
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed)) return Math.max(parsed, 16);
      }
    }
    return initialFontSize;
  });
  const [isLangChanging, setIsLangChanging] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem(EDITOR_LANG_KEY);
    if (savedLanguage) setCurrentLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    if (!isSettingsOpen) return;
    function handleClickOutside(event) {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target) &&
        settingsButtonRef.current &&
        !settingsButtonRef.current.contains(event.target)
      ) {
        setIsSettingsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSettingsOpen]);

  useEffect(() => {
    const storedLang = localStorage.getItem("editor-lang");
    const storedFont = localStorage.getItem("editor-font");
    const storedTheme = localStorage.getItem("editor-theme");
    const storedAutoSuggest = localStorage.getItem("editor-auto-suggest");
    if (storedLang) {
      setLanguage(storedLang);
    } else {
      setLanguage("cpp");
      localStorage.setItem("editor-lang", "cpp");
    }
    if (storedFont) {
      const parsedSize = parseInt(storedFont);
      if (!isNaN(parsedSize) && parsedSize >= 10 && parsedSize <= 30) {
        setCurrentFontSize(parsedSize);
        if (editorRef.current) editorRef.current.updateOptions({ fontSize: parsedSize });
      }
    }
    if (storedTheme) setEditorTheme(storedTheme);
    if (storedAutoSuggest !== null) setAutoSuggestEnabled(storedAutoSuggest === "true");
  }, [setLanguage, onToggleFullscreen]);

  useEffect(() => {
    if (editorRef.current && window.monaco) {
      applyMonacoTheme(window.monaco, editorTheme);
    }
  }, [editorTheme]);

  const handleToggleFullscreen = useCallback(() => {
    if (onToggleFullscreen) onToggleFullscreen();
  }, [onToggleFullscreen]);

  const handleLangChange = async (newLang) => {
    if (!newLang || newLang === currentLanguage || isLangChanging) return;
    setIsLangChanging(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/changeLanguage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: problemData?.initial_code,
            fromLang: currentLanguage,
            toLang: newLang
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to change language');
      }
      const data = await response.json();
      setError(null);
      if (editorRef.current) {
        editorRef.current.setValue(data.code);
        if (onCodeChange) onCodeChange(data.code);
      }
      setCurrentLanguage(newLang);
      localStorage.setItem(EDITOR_LANG_KEY, newLang);
      setLanguage?.(newLang);
    } catch (err) {
      setError(err.message || 'An error occurred while changing language');
    } finally {
      setIsLangChanging(false);
    }
  };

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    applyMonacoTheme(monaco, editorTheme);
    editor.updateOptions({ fontSize: currentFontSize, fontFamily: 'Urbanist, var(--font-sans), system-ui, -apple-system, sans-serif' });
    editor.onDidChangeConfiguration(() => {
      const opts = editor.getRawOptions();
      if (opts.fontSize) {
        localStorage.setItem("editor-font", opts.fontSize.toString());
        setCurrentFontSize(opts.fontSize);
      }
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => { if (onRunCode) onRunCode(); });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, (e) => { if (e) e.preventDefault(); handleSubmitCode(); });
    editor.addCommand(monaco.KeyCode.F11, () => { handleToggleFullscreen(); });
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.Enter, () => { handleToggleFullscreen(); });
    if (onEditorMount) onEditorMount(editor, monaco);
  };

  const handleResetCode = () => {
    if (editorRef.current) {
      const initialCode = problemData?.initial_code || '';
      editorRef.current.setValue(initialCode);
      if (onCodeChange) onCodeChange(initialCode);
    }
  };

  const handleSubmitCode = () => {
    if (!editorRef.current) return;
    const typedCode = editorRef.current.getValue() || '';
    if (setActiveTab) setActiveTab('results');
    onSubmitCode?.({
      description: problemData?.description,
      typedSolution: typedCode,
      actualSolution: problemData?.solution,
      language: currentLanguage
    });
  };

  const toggleAutoSuggest = () => {
    const newValue = !autoSuggestEnabled;
    setAutoSuggestEnabled(newValue);
    localStorage.setItem("editor-auto-suggest", newValue.toString());
    if (editorRef.current) {
      editorRef.current.updateOptions({
        quickSuggestions: newValue,
        suggestOnTriggerCharacters: newValue,
        acceptSuggestionOnEnter: newValue ? "on" : "off"
      });
      if (newValue) {
        editorRef.current.trigger("manual", "editor.action.triggerSuggest", {});
      }
    }
  };

  const handleThemeToggle = () => {
    const newTheme = editorTheme === "vs-dark" ? "light" : "vs-dark";
    setEditorTheme(newTheme);
    localStorage.setItem("editor-theme", newTheme);
  };

  const changeFontSize = (delta) => {
    if (!editorRef.current) return;
    const newSize = Math.max(10, Math.min(currentFontSize + delta, 30));
    setCurrentFontSize(newSize);
    editorRef.current.updateOptions({ fontSize: newSize });
    localStorage.setItem("editor-font", newSize.toString());
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'F11') {
        event.preventDefault();
        handleToggleFullscreen();
      }
      if (event.key === 'Enter' && event.altKey) {
        event.preventDefault();
        handleToggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleToggleFullscreen]);

  return {
    editorRef,
    settingsRef,
    settingsButtonRef,
    currentLanguage,
    setCurrentLanguage,
    error,
    autoSuggestEnabled,
    setAutoSuggestEnabled,
    editorTheme,
    setEditorTheme,
    isSettingsOpen,
    setIsSettingsOpen,
    currentFontSize,
    setCurrentFontSize,
    isLangChanging,
    handleLangChange,
    handleEditorMount,
    handleResetCode,
    handleSubmitCode,
    toggleAutoSuggest,
    handleThemeToggle,
    changeFontSize
  };
}
