// Utility to define and apply Monaco Editor themes
export default function applyMonacoTheme(monacoInstance, themeName) {
  if (!monacoInstance) return;
  monacoInstance.editor.defineTheme('gencode-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', foreground: 'F8F8F2', background: '111827' },
      { token: 'comment', foreground: '64748B' },
      { token: 'keyword', foreground: 'FF79C6' },
      { token: 'number', foreground: 'BD93F9' },
      { token: 'string', foreground: 'F1FA8C' },
      { token: 'variable', foreground: 'F8F8F2' },
      { token: 'type', foreground: '8BE9FD' },
      { token: 'function', foreground: '50FA7B' },
      { token: 'identifier', foreground: 'F8F8F2' },
      { token: 'delimiter', foreground: 'F8F8F2' },
      { token: 'class', foreground: 'FFB86C' },
      { token: 'constant', foreground: 'BD93F9' },
      { token: 'operator', foreground: 'FF79C6' },
    ],
    colors: {
      'editor.background': '#111827',
      'editor.foreground': '#F8F8F2',
      'editor.lineHighlightBackground': '#1e293b',
      'editorCursor.foreground': '#FF79C6',
      'editor.selectionBackground': '#33415580',
      'editor.inactiveSelectionBackground': '#33415540',
      'editorIndentGuide.background': '#374151',
      'editorIndentGuide.activeBackground': '#64748b',
      'editorLineNumber.foreground': '#64748b',
      'editorLineNumber.activeForeground': '#f8fafc',
      'editorGutter.background': '#111827',
      'editorWhitespace.foreground': '#334155',
    },
  });
  monacoInstance.editor.defineTheme('gencode-light', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#1e293b',
      'editor.lineHighlightBackground': '#f1f5f9',
      'editorCursor.foreground': '#1e293b',
      'editor.selectionBackground': '#cbd5e180',
      'editor.inactiveSelectionBackground': '#cbd5e140',
      'editorIndentGuide.background': '#e5e7eb',
      'editorIndentGuide.activeBackground': '#64748b',
      'editorLineNumber.foreground': '#94a3b8',
      'editorLineNumber.activeForeground': '#1e293b',
      'editorGutter.background': '#f8fafc',
      'editorWhitespace.foreground': '#cbd5e1',
    },
  });
  monacoInstance.editor.setTheme(themeName === 'vs-dark' ? 'gencode-dark' : 'gencode-light');
}
