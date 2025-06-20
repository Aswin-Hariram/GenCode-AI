// Handles Monaco editor mount logic and keyboard shortcuts
export default function handleEditorMountFactory({
  editorRef,
  currentFontSize,
  editorTheme,
  setCurrentFontSize,
  onRunCode,
  handleSubmitCode,
  handleToggleFullscreen,
  onEditorMount,
  applyMonacoTheme
}) {
  return (editor, monaco) => {
    editorRef.current = editor;
    applyMonacoTheme(monaco, editorTheme);
    editor.updateOptions({ 
      fontSize: currentFontSize,
      fontFamily: 'Urbanist, var(--font-sans), system-ui, -apple-system, sans-serif'
    });
    editor.onDidChangeConfiguration(() => {
      const opts = editor.getRawOptions();
      if (opts.fontSize) {
        localStorage.setItem("editor-font", opts.fontSize.toString());
        setCurrentFontSize(opts.fontSize);
      }
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (onRunCode) onRunCode();
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, (e) => {
      if (e) e.preventDefault();
      handleSubmitCode();
    });
    editor.addCommand(monaco.KeyCode.F11, () => {
      handleToggleFullscreen();
    });
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.Enter, () => {
      handleToggleFullscreen();
    });
    if (onEditorMount) onEditorMount(editor, monaco);
  };
}
