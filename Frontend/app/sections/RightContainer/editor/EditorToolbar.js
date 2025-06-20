import React from "react";
import { FiPlay, FiMaximize, FiMinimize, FiUpload, FiSettings, FiChevronDown, FiRotateCcw } from "react-icons/fi";
import EditorSettingsDropdown from "../../../components/codeEditor/EditorSettingsDropdown";

export default function EditorToolbar({
  isFullscreen,
  isLangChanging,
  isSettingsOpen,
  setIsSettingsOpen,
  settingsButtonRef,
  settingsRef,
  currentLanguage,
  handleLangChange,
  autoSuggestEnabled,
  currentFontSize,
  editorTheme,
  toggleAutoSuggest,
  changeFontSize,
  handleThemeToggle,
  handleResetCode,
  handleToggleFullscreen,
  onRunCode,
  isRunning,
  handleSubmitCode,
  isSubmitting
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 shadow-md">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            ref={settingsButtonRef}
            className="flex items-center bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => !isLangChanging && setIsSettingsOpen(!isSettingsOpen)}
            aria-expanded={isSettingsOpen}
            aria-haspopup="true"
            disabled={isLangChanging}
          >
            <FiSettings size={14} className="mr-1.5" />
            <span className="capitalize mr-1">{currentLanguage === "cpp" ? "C++" : currentLanguage}</span>
            {isLangChanging ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            ) : (
              <FiChevronDown size={14} />
            )}
          </button>
          <EditorSettingsDropdown
            isOpen={isSettingsOpen}
            isLangChanging={isLangChanging}
            currentLanguage={currentLanguage}
            autoSuggestEnabled={autoSuggestEnabled}
            currentFontSize={currentFontSize}
            theme={editorTheme}
            onLangChange={handleLangChange}
            onToggleAutoSuggest={toggleAutoSuggest}
            onChangeFontSize={changeFontSize}
            onThemeToggle={handleThemeToggle}
            settingsRef={settingsRef}
            settingsButtonRef={settingsButtonRef}
            setIsSettingsOpen={setIsSettingsOpen}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-md transition-colors"
          onClick={handleResetCode}
          title="Reset to initial code"
        >
          <FiRotateCcw size={14} />
        </button>
        <button
          className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-md transition-colors"
          onClick={handleToggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          title={isFullscreen ? "Exit fullscreen (F11)" : "Enter fullscreen (F11)"}
        >
          {isFullscreen ? <FiMinimize size={14} /> : <FiMaximize size={14} />}
        </button>
        <button
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md flex items-center transition-colors"
          onClick={onRunCode}
          disabled={isRunning}
          title="Run code (Ctrl+Enter)"
        >
          {isRunning ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full mr-1.5"></div>
              Running...
            </>
          ) : (
            <>
              <FiPlay className="mr-1.5" size={14} /> Run
            </>
          )}
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md flex items-center transition-colors"
          onClick={handleSubmitCode}
          disabled={isSubmitting}
          title="Submit code (Ctrl+S)"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full mr-1.5"></div>
              Submitting...
            </>
          ) : (
            <>
              <FiUpload className="mr-1.5" size={14} /> Submit
            </>
          )}
        </button>
      </div>
    </div>
  );
}
