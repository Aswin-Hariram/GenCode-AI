import { useRef, useState, useEffect, useCallback } from "react";
import applyMonacoTheme from "./applyMonacoTheme";
import { storageGet, storageSet } from "../../utils/storage";
import { getChangeLanguageUrl } from "../../utils/api";

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
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef(null);
  const settingsButtonRef = useRef(null);
  const [currentFontSize, setCurrentFontSize] = useState(
    typeof initialFontSize === 'number' && !isNaN(initialFontSize) ? initialFontSize : 16
  );
  const [isLangChanging, setIsLangChanging] = useState(false);

  useEffect(() => {
    const savedLanguage = storageGet(EDITOR_LANG_KEY);
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
    const storedLang = storageGet("editor-lang");
    const storedFont = storageGet("editor-font");
    const storedTheme = storageGet("editor-theme");
    const storedAutoSuggest = storageGet("editor-auto-suggest");
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
      // Check network connectivity first
      if (!navigator.onLine) {
        throw new Error('No internet connection. Please check your network and try again.');
      }
      
      const apiUrl = getChangeLanguageUrl();
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: problemData?.initial_code || '',
          fromLang: currentLanguage,
          toLang: newLang
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const statusMessage = {
          400: 'Invalid request format',
          401: 'Authentication required',
          403: 'Permission denied',
          404: 'Language conversion service not found',
          429: 'Too many requests, please try again later',
          500: 'Server error occurred during language conversion',
          503: 'Language conversion service unavailable'
        }[response.status] || 'Failed to change language';
        
        throw new Error(errorData.message || statusMessage);
      }
      
      const data = await response.json();
      
      if (!data || !data.code) {
        throw new Error('Received invalid data from language conversion service');
      }
      
      // Update editor with new code
      if (editorRef.current) {
        editorRef.current.setValue(data.code);
        if (onCodeChange) onCodeChange(data.code);
      }
      
      // Update language settings
      setCurrentLanguage(newLang);
      storageSet(EDITOR_LANG_KEY, newLang);
      setLanguage?.(newLang);
      
      // Log successful language change
      console.log(`Language changed successfully from ${currentLanguage} to ${newLang}`);
    } catch (err) {
      // Handle specific error types
      if (err.name === 'AbortError') {
        setError('Language change request timed out. Please try again.');
      } else if (err.message.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(err.message || 'An error occurred while changing language');
      }
      
      // Log error for debugging
      console.error('Language change error:', err);
    } finally {
      setIsLangChanging(false);
    }
  };

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    applyMonacoTheme(monaco, editorTheme);
    editor.updateOptions({ fontSize: currentFontSize, fontFamily: 'Lexend, var(--font-sans), system-ui, -apple-system, sans-serif' });
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
    storageSet("editor-theme", newTheme);
  };

  const changeFontSize = (delta) => {
    if (!editorRef.current) return;
    const newSize = Math.max(10, Math.min(currentFontSize + delta, 30));
    setCurrentFontSize(newSize);
    editorRef.current.updateOptions({ fontSize: newSize });
    storageSet("editor-font", newSize.toString());
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
