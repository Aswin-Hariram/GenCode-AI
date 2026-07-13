import React from "react";
import { FiPlay, FiMaximize, FiMinimize, FiUpload, FiSettings, FiChevronDown, FiRotateCcw, FiCode, FiZap } from "react-icons/fi";
import EditorSettingsDropdown from "./EditorSettingsDropdown";

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
  isWordWrapEnabled,
  isMinimapEnabled,
  editorTheme,
  toggleAutoSuggest,
  toggleWordWrap,
  toggleMinimap,
  changeFontSize,
  handleThemeToggle,
  handleResetCode,
  handleToggleFullscreen,
  onRunCode,
  isRunning,
  handleFormatCode,
  handleSubmitCode,
  isSubmitting
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 bg-[linear-gradient(90deg,#020617,#0f172a,#111827)] px-4 py-3 shadow-md">
      <div className="flex flex-wrap items-center gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300 md:flex">
          <FiCode className="text-sky-400" />
          Editor Workspace
        </div>
        <div className="relative">
          <button
            ref={settingsButtonRef}
            className="flex items-center rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
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
            isWordWrapEnabled={isWordWrapEnabled}
            isMinimapEnabled={isMinimapEnabled}
            theme={editorTheme}
            onLangChange={handleLangChange}
            onToggleAutoSuggest={toggleAutoSuggest}
            onToggleWordWrap={toggleWordWrap}
            onToggleMinimap={toggleMinimap}
            onChangeFontSize={changeFontSize}
            onThemeToggle={handleThemeToggle}
            settingsRef={settingsRef}
            settingsButtonRef={settingsButtonRef}
            setIsSettingsOpen={setIsSettingsOpen}
          />
        </div>
        <div className="hidden items-center gap-2 text-xs text-slate-400 lg:flex">
          <span className={`rounded-full px-2.5 py-1 ${isWordWrapEnabled ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
            Wrap
          </span>
          <span className={`rounded-full px-2.5 py-1 ${isMinimapEnabled ? 'bg-blue-500/15 text-blue-300' : 'bg-slate-800 text-slate-400'}`}>
            Minimap
          </span>
          <span className={`rounded-full px-2.5 py-1 ${autoSuggestEnabled ? 'bg-violet-500/15 text-violet-300' : 'bg-slate-800 text-slate-400'}`}>
            Suggestions
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          className="rounded-xl border border-slate-600 bg-slate-800 p-2 text-white transition-colors hover:bg-slate-700"
          onClick={handleResetCode}
          title="Reset to initial code"
        >
          <FiRotateCcw size={14} />
        </button>
        <button
          className="rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          onClick={handleFormatCode}
          title="Format code (Ctrl/Cmd+Shift+F)"
        >
          <span className="inline-flex items-center">
            <FiZap className="mr-2 text-amber-300" size={14} />
            Format
          </span>
        </button>
        <button
          className="rounded-xl border border-slate-600 bg-slate-800 p-2 text-white transition-colors hover:bg-slate-700"
          onClick={handleToggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          title={isFullscreen ? "Exit fullscreen (F11)" : "Enter fullscreen (F11)"}
        >
          {isFullscreen ? <FiMinimize size={14} /> : <FiMaximize size={14} />}
        </button>
        <button
          className="flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
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
          className="flex items-center rounded-xl bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
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
