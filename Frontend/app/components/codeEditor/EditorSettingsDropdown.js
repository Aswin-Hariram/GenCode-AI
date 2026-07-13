import React from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import PropTypes from "prop-types";

const LANGUAGES = ["javascript", "python", "java", "cpp"];

export default function EditorSettingsDropdown({
  isOpen,
  isLangChanging,
  currentLanguage,
  autoSuggestEnabled,
  currentFontSize,
  isWordWrapEnabled,
  isMinimapEnabled,
  theme,
  onLangChange,
  onToggleAutoSuggest,
  onToggleWordWrap,
  onToggleMinimap,
  onChangeFontSize,
  onThemeToggle,
  settingsRef,
  setIsSettingsOpen
}) {
  return isOpen ? (
    <div ref={settingsRef} className="absolute z-20 top-full left-0 mt-2 min-w-[280px] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-slate-950/50">
      <div className="border-b border-slate-700 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        Language
      </div>
      {LANGUAGES.map((lang) => (
        <button
          key={lang}
          className={`block w-full px-4 py-2.5 text-left text-sm transition-colors ${
            currentLanguage === lang 
              ? 'bg-sky-600 text-white' 
              : 'text-slate-300 hover:bg-slate-800'
          }`}
          onClick={() => {
            onLangChange(lang);
            setIsSettingsOpen(false);
          }}
          disabled={isLangChanging}
        >
          {lang === "cpp" ? "C++" : lang.charAt(0).toUpperCase() + lang.slice(1)}
        </button>
      ))}
      <div className="mt-1 border-t border-slate-700 pt-1">
        <div className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          Editor Options
        </div>
        <button
          className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800"
          onClick={onToggleAutoSuggest}
        >
          <span>Auto-suggest</span>
          <div className={`w-8 h-4 rounded-full relative ${autoSuggestEnabled ? 'bg-green-500' : 'bg-slate-600'}`}>
            <div className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transform transition-transform ${autoSuggestEnabled ? 'left-4' : 'left-0.5'}`}></div>
          </div>
        </button>
        <button
          className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800"
          onClick={onToggleWordWrap}
        >
          <span>Word wrap</span>
          <div className={`w-8 h-4 rounded-full relative ${isWordWrapEnabled ? 'bg-green-500' : 'bg-slate-600'}`}>
            <div className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transform transition-transform ${isWordWrapEnabled ? 'left-4' : 'left-0.5'}`}></div>
          </div>
        </button>
        <button
          className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800"
          onClick={onToggleMinimap}
        >
          <span>Minimap</span>
          <div className={`w-8 h-4 rounded-full relative ${isMinimapEnabled ? 'bg-green-500' : 'bg-slate-600'}`}>
            <div className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transform transition-transform ${isMinimapEnabled ? 'left-4' : 'left-0.5'}`}></div>
          </div>
        </button>
        <div className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-300">
          <span>Font Size</span>
          <div className="flex space-x-1">
            <button 
              className="rounded bg-slate-700 px-2 py-0.5 text-white hover:bg-slate-600"
              onClick={() => onChangeFontSize(-1)}
              aria-label="Decrease font size"
            >
              -
            </button>
            <span className="min-w-8 rounded bg-slate-950 px-2 py-0.5 text-center text-white">
              {typeof currentFontSize === 'number' && !isNaN(currentFontSize) ? currentFontSize : 14}
            </span>
            <button 
              className="rounded bg-slate-700 px-2 py-0.5 text-white hover:bg-slate-600"
              onClick={() => onChangeFontSize(1)}
              aria-label="Increase font size"
            >
              +
            </button>
          </div>
        </div>
        <button
          className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800"
          onClick={() => {
            onThemeToggle();
            setIsSettingsOpen(false);
          }}
        >
          <span>Theme</span>
          <div className="flex items-center">
            {theme === "vs-dark" ? (
              <FiSun size={14} className="text-yellow-400" />
            ) : (
              <FiMoon size={14} className="text-slate-400" />
            )}
          </div>
        </button>
      </div>
    </div>
  ) : null;
}

EditorSettingsDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isLangChanging: PropTypes.bool.isRequired,
  currentLanguage: PropTypes.string.isRequired,
  autoSuggestEnabled: PropTypes.bool.isRequired,
  currentFontSize: PropTypes.number.isRequired,
  isWordWrapEnabled: PropTypes.bool.isRequired,
  isMinimapEnabled: PropTypes.bool.isRequired,
  theme: PropTypes.string.isRequired,
  onLangChange: PropTypes.func.isRequired,
  onToggleAutoSuggest: PropTypes.func.isRequired,
  onToggleWordWrap: PropTypes.func.isRequired,
  onToggleMinimap: PropTypes.func.isRequired,
  onChangeFontSize: PropTypes.func.isRequired,
  onThemeToggle: PropTypes.func.isRequired,
  settingsRef: PropTypes.object.isRequired,
  setIsSettingsOpen: PropTypes.func.isRequired
};
