import { useEffect } from "react";
import { storageGet, storageSet } from "../../utils/storage";

// No unused imports or functions found in this file.

export default function useEditorPreferences({ setLanguage, setCurrentFontSize, setEditorTheme, setAutoSuggestEnabled, editorRef, initialFontSize }) {
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
    } else {
      // Ensure initialFontSize is a valid number, default to 14 if not
      const fontSize = typeof initialFontSize === 'number' && !isNaN(initialFontSize) ? initialFontSize : 14;
      setCurrentFontSize(fontSize);
      if (editorRef.current) editorRef.current.updateOptions({ fontSize: fontSize });
    }
    if (storedTheme) setEditorTheme(storedTheme);
    if (storedAutoSuggest !== null) setAutoSuggestEnabled(storedAutoSuggest === "true");
  }, [setLanguage, setCurrentFontSize, setEditorTheme, setAutoSuggestEnabled, editorRef, initialFontSize]);
}
