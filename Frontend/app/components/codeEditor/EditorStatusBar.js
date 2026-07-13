import React from "react";
import PropTypes from "prop-types";
import { FiCommand } from "react-icons/fi";

export default function EditorStatusBar({
  currentLanguage,
  lineCount,
  characterCount,
  currentFontSize,
  isWordWrapEnabled,
  isMinimapEnabled,
}) {
  const languageLabel = currentLanguage === "cpp"
    ? "C++"
    : currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-700 bg-slate-950 px-4 py-2 text-xs text-slate-300">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 font-semibold tracking-[0.14em] uppercase text-sky-300">
          {languageLabel}
        </span>
        <span>{lineCount} lines</span>
        <span>{characterCount} chars</span>
        <span>Font {currentFontSize}px</span>
        <span>{isWordWrapEnabled ? "Wrap on" : "Wrap off"}</span>
        <span>{isMinimapEnabled ? "Minimap on" : "Minimap off"}</span>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-slate-400">
        <span className="inline-flex items-center gap-1">
          <FiCommand size={12} />
          Enter Run
        </span>
        <span>Cmd/Ctrl+S Submit</span>
        <span>Cmd/Ctrl+Shift+F Format</span>
        <span>F11 Fullscreen</span>
      </div>
    </div>
  );
}

EditorStatusBar.propTypes = {
  currentLanguage: PropTypes.string.isRequired,
  lineCount: PropTypes.number.isRequired,
  characterCount: PropTypes.number.isRequired,
  currentFontSize: PropTypes.number.isRequired,
  isWordWrapEnabled: PropTypes.bool.isRequired,
  isMinimapEnabled: PropTypes.bool.isRequired,
};
