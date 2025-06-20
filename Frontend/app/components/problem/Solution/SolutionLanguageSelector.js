import React from "react";
import { RefreshCw } from "lucide-react";

const SolutionLanguageSelector = ({ languageOptions, selectedLanguage, onChange, isConverting, theme }) => (
  <div className="flex items-center gap-4 mb-4">
    <label htmlFor="language-select" className={`font-semibold text-base ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>Language:</label>
    <select
      id="language-select"
      value={selectedLanguage}
      onChange={e => onChange(e.target.value)}
      disabled={isConverting}
      className={`rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${theme === 'dark' ? 'bg-gray-800 border-blue-900 text-blue-200' : 'bg-white border-blue-300 text-blue-700'}`}
    >
      {languageOptions.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {isConverting && (
      <span className="flex items-center gap-1 text-blue-500 animate-pulse ml-2"><RefreshCw size={16} className="animate-spin" /> Converting...</span>
    )}
  </div>
);

export default SolutionLanguageSelector;
