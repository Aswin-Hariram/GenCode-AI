import { useEffect } from "react";

export default function useEditorPreferences({ setLanguage, setCurrentFontSize, setEditorTheme, setAutoSuggestEnabled, editorRef, initialFontSize }) {
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
    } else {
      setCurrentFontSize(initialFontSize);
    }
    if (storedTheme) setEditorTheme(storedTheme);
    if (storedAutoSuggest !== null) setAutoSuggestEnabled(storedAutoSuggest === "true");
  }, [setLanguage, setCurrentFontSize, setEditorTheme, setAutoSuggestEnabled, editorRef, initialFontSize]);
}
