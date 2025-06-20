import React, { useRef } from "react";
import { FiSettings, FiChevronDown, FiSun, FiMoon } from "react-icons/fi";
import PropTypes from "prop-types";

const LANGUAGES = ["javascript", "python", "java", "cpp"];

export default function EditorSettingsDropdown({
  isOpen,
  isLangChanging,
  currentLanguage,
  autoSuggestEnabled,
  currentFontSize,
  theme,
  onLangChange,
  onToggleAutoSuggest,
  onChangeFontSize,
  onThemeToggle,
  settingsRef,
  settingsButtonRef,
  setIsSettingsOpen
}) {
  return isOpen ? (
    <div ref={settingsRef} className="absolute z-10 top-full left-0 mt-1 bg-slate-800 border border-slate-700 rounded-md shadow-xl py-1 min-w-50">
      <div className="px-3 py-2 text-xs text-slate-400 font-semibold border-b border-slate-700">
        Language
      </div>
      {LANGUAGES.map((lang) => (
        <button
          key={lang}
          className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
            currentLanguage === lang 
              ? 'bg-blue-600 text-white' 
              : 'text-slate-300 hover:bg-slate-700'
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
      <div className="border-t border-slate-700 mt-1 pt-1">
        <div className="px-3 py-2 text-xs text-slate-400 font-semibold">
          Editor Options
        </div>
        <button
          className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
          onClick={onToggleAutoSuggest}
        >
          <span>Auto-suggest</span>
          <div className={`w-8 h-4 rounded-full relative ${autoSuggestEnabled ? 'bg-green-500' : 'bg-slate-600'}`}>
            <div className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transform transition-transform ${autoSuggestEnabled ? 'left-4' : 'left-0.5'}`}></div>
          </div>
        </button>
        <div className="flex items-center justify-between px-4 py-2 text-sm text-slate-300">
          <span>Font Size</span>
          <div className="flex space-x-1">
            <button 
              className="px-1.5 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-white"
              onClick={() => onChangeFontSize(-1)}
              aria-label="Decrease font size"
            >
              -
            </button>
            <span className="px-2 py-0.5 bg-slate-800 rounded text-white min-w-6 text-center">
              {currentFontSize}
            </span>
            <button 
              className="px-1.5 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-white"
              onClick={() => onChangeFontSize(1)}
              aria-label="Increase font size"
            >
              +
            </button>
          </div>
        </div>
        <button
          className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
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
  theme: PropTypes.string.isRequired,
  onLangChange: PropTypes.func.isRequired,
  onToggleAutoSuggest: PropTypes.func.isRequired,
  onChangeFontSize: PropTypes.func.isRequired,
  onThemeToggle: PropTypes.func.isRequired,
  settingsRef: PropTypes.object.isRequired,
  settingsButtonRef: PropTypes.object.isRequired,
  setIsSettingsOpen: PropTypes.func.isRequired
};
