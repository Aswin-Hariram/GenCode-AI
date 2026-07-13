import { useRef, useState, useEffect, useCallback } from "react";
import applyMonacoTheme from "./applyMonacoTheme";
import { storageGet, storageSet } from "../../utils/storage";
import { getChangeLanguageUrl, requestJson } from "../../utils/api";

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
  const EDITOR_WRAP_KEY = 'editor-word-wrap';
  const EDITOR_MINIMAP_KEY = 'editor-minimap';
  const [currentLanguage, setCurrentLanguage] = useState(language || DEFAULT_LANGUAGE);
  const [error, setError] = useState(null);
  const editorRef = useRef(null);
  const [autoSuggestEnabled, setAutoSuggestEnabled] = useState(true);
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef(null);
  const settingsButtonRef = useRef(null);
  const [currentFontSize, setCurrentFontSize] = useState(
    typeof initialFontSize === 'number' && !isNaN(initialFontSize) ? initialFontSize : 16
  );
  const [isLangChanging, setIsLangChanging] = useState(false);
  const [isWordWrapEnabled, setIsWordWrapEnabled] = useState(true);
  const [isMinimapEnabled, setIsMinimapEnabled] = useState(true);

  const applyEditorOptions = useCallback((editor, overrides = {}) => {
    if (!editor) return;

    editor.updateOptions({
      fontSize: currentFontSize,
      fontFamily: '"JetBrains Mono", "Fira Code", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      quickSuggestions: autoSuggestEnabled,
      suggestOnTriggerCharacters: autoSuggestEnabled,
      acceptSuggestionOnEnter: autoSuggestEnabled ? "on" : "off",
      wordWrap: isWordWrapEnabled ? "on" : "off",
      minimap: { enabled: isMinimapEnabled },
      ...overrides,
    });
  }, [autoSuggestEnabled, currentFontSize, isMinimapEnabled, isWordWrapEnabled]);

  useEffect(() => {
    const savedLanguage = storageGet(EDITOR_LANG_KEY);
    if (savedLanguage) setCurrentLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    if (language && language !== currentLanguage) {
      setCurrentLanguage(language);
    }
  }, [language, currentLanguage]);

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
    const storedLang = storageGet("editor-lang");
    const storedFont = storageGet("editor-font");
    const storedTheme = storageGet("editor-theme");
    const storedAutoSuggest = storageGet("editor-auto-suggest");
    const storedWordWrap = storageGet(EDITOR_WRAP_KEY);
    const storedMinimap = storageGet(EDITOR_MINIMAP_KEY);
    if (storedLang) {
      setLanguage(storedLang);
    } else {
      setLanguage("cpp");
      storageSet("editor-lang", "cpp");
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
    if (storedWordWrap !== null) setIsWordWrapEnabled(storedWordWrap === "true");
    if (storedMinimap !== null) setIsMinimapEnabled(storedMinimap === "true");
  }, [EDITOR_MINIMAP_KEY, EDITOR_WRAP_KEY, setLanguage]);

  useEffect(() => {
    if (editorRef.current && window.monaco) {
      applyMonacoTheme(window.monaco, editorTheme);
    }
  }, [editorTheme]);

  useEffect(() => {
    applyEditorOptions(editorRef.current);
  }, [applyEditorOptions]);

  const handleToggleFullscreen = useCallback(() => {
    if (onToggleFullscreen) onToggleFullscreen();
  }, [onToggleFullscreen]);

  const handleLangChange = async (newLang) => {
    // Validate inputs
    if (!newLang) {
      setError('Invalid language selection');
      return;
    }
    
    if (newLang === currentLanguage) {
      // Already using this language
      return;
    }
    
    if (isLangChanging) {
      // Prevent multiple simultaneous language change requests
      setError('Language change already in progress');
      return;
    }
    
    setIsLangChanging(true);
    setError(null);
    
    try {
      const sourceCode = problemData?.initial_code ?? '';
      if (!sourceCode.trim()) {
        throw new Error('No starter code is available to convert for this problem yet.');
      }

      const data = await requestJson(getChangeLanguageUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: sourceCode,
          fromLang: currentLanguage,
          toLang: newLang
        }),
        timeoutMs: 30000,
      });

      if (!data || !data.code || String(data.result || '').toLowerCase() !== 'success') {
        throw new Error('Received invalid data from language conversion service');
      }
      
      // Update editor with new code
      if (editorRef.current) {
        editorRef.current.setValue(data.code);
        if (onCodeChange) onCodeChange(data.code);
      }
      storageSet('editor-code', data.code);
      
      // Update language settings
      setCurrentLanguage(newLang);
      storageSet(EDITOR_LANG_KEY, newLang);
      setLanguage?.(newLang);
    } catch (err) {
      // Handle specific error types
      if (err.name === 'AbortError') {
        setError('Language change request timed out. Please try again.');
      } else if (err.message?.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(err.message || 'An error occurred while changing language');
      }
    } finally {
      setIsLangChanging(false);
    }
  };

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    applyMonacoTheme(monaco, editorTheme);
    applyEditorOptions(editor);
    editor.onDidChangeConfiguration(() => {
      const opts = editor.getRawOptions();
      if (opts.fontSize) {
        storageSet("editor-font", opts.fontSize.toString());
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
    storageSet("editor-auto-suggest", newValue.toString());
    if (editorRef.current && newValue) {
      editorRef.current.trigger("manual", "editor.action.triggerSuggest", {});
    }
  };

  const handleThemeToggle = () => {
    const newTheme = editorTheme === "vs-dark" ? "light" : "vs-dark";
    setEditorTheme(newTheme);
    storageSet("editor-theme", newTheme);
  };

  const changeFontSize = (delta) => {
    if (!editorRef.current) return;
    const newSize = Math.max(10, Math.min(currentFontSize + delta, 30));
    setCurrentFontSize(newSize);
    storageSet("editor-font", newSize.toString());
  };

  const toggleWordWrap = () => {
    const newValue = !isWordWrapEnabled;
    setIsWordWrapEnabled(newValue);
    storageSet(EDITOR_WRAP_KEY, newValue.toString());
  };

  const toggleMinimap = () => {
    const newValue = !isMinimapEnabled;
    setIsMinimapEnabled(newValue);
    storageSet(EDITOR_MINIMAP_KEY, newValue.toString());
  };

  const handleFormatCode = async () => {
    if (!editorRef.current) return;

    try {
      setError(null);
      await editorRef.current.getAction('editor.action.formatDocument')?.run();
    } catch {
      setError('Unable to format the current document.');
    }
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
    isWordWrapEnabled,
    isMinimapEnabled,
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
    toggleWordWrap,
    toggleMinimap,
    handleThemeToggle,
    changeFontSize,
    handleFormatCode
  };
}
