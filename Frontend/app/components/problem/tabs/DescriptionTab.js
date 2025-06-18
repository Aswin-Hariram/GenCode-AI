"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Layers, FileText, BadgeInfo, Tag, ClipboardCopy, ChevronDown, ChevronUp, Info } from "lucide-react";
import { getMarkdownComponents } from "../markdown/MarkdownComponents";
import { useTheme } from "../../../context/ThemeContext";
import ScrollToTopButton from './ScrollToTopButton';
import { useState, useRef } from "react";

const DescriptionTab = ({ problemData }) => {
  const { theme } = useTheme();
  const markdownComponents = getMarkdownComponents(theme);
  const [expandedConstraints, setExpandedConstraints] = useState(false);
  const [copied, setCopied] = useState({});
  const copyTimeout = useRef({});

  const handleCopy = (value, key) => {
    navigator.clipboard.writeText(value);
    setCopied((prev) => ({ ...prev, [key]: true }));
    clearTimeout(copyTimeout.current[key]);
    copyTimeout.current[key] = setTimeout(() => {
      setCopied((prev) => ({ ...prev, [key]: false }));
    }, 1200);
  };

  // Accessibility: keyboard flip for cards
  const handleCardKeyDown = (e, idx) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      document.getElementById(`flip-card-${idx}`)?.classList.toggle('rotate-y-180');
    }
  };

  // Sticky section header helper
  const stickyHeader = `sticky top-0 z-10 bg-opacity-80 backdrop-blur-md py-2 px-2 rounded-t-md shadow-sm ${theme === 'dark' ? 'bg-gray-950/80' : 'bg-white/90'}`;

  return (
    <div
      className={`relative animate-fadeIn rounded-md ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'}`}
      style={{ fontFamily: 'Urbanist, sans-serif' }}
      aria-label="Problem Description Tab"
    >
      {/* Animated Markdown Description */}
      <div
        className={`prose prose-blue dark:prose-invert transition-all duration-500 rounded-xl shadow-md mx-auto max-w-3xl px-6 py-6 ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-white/90'} fade-in`}
        style={{ animation: 'fadeIn 0.8s' }}
        aria-label="Problem Description"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
          components={markdownComponents}
        >
          {problemData.description}
        </ReactMarkdown>
      </div>

      {/* Flip Card Examples */}
      {problemData.examples && (
        <div className="space-y-6 mt-12 mx-auto max-w-3xl">
          <h3 className={
            `${stickyHeader} text-xl font-bold flex items-center gap-2 mb-4 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`
          }>
            <Layers className="w-6 h-6" /> Examples
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {problemData.examples.map((example, i) => (
              <div
                key={i}
                id={`flip-card-${i}`}
                role="button"
                aria-label={`Example ${i + 1} flip card`}
                tabIndex={0}
                className={`group perspective h-56 cursor-pointer outline-none focus:ring-2 focus:ring-blue-400`}
                onKeyDown={(e) => handleCardKeyDown(e, i)}
              >
                <div className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d group-hover:rotate-y-180 group-focus:rotate-y-180`}>
                  {/* Front */}
                  <div className={`absolute w-full h-full rounded-xl shadow-lg p-5 flex flex-col justify-center gap-2 transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-gray-800/90 border border-blue-900/30' : 'bg-white/90 border border-blue-100'
                  } backface-hidden`}> 
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold uppercase tracking-wide ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>Example {i + 1}</span>
                      {example.explanation && (
                        <Info className="w-4 h-4 text-blue-400" title="Flip card or hover for explanation" />
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className={`text-xs font-semibold uppercase tracking-wide ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>Input:</span>
                      <div className="flex items-center gap-2">
                        <div className={`rounded-md p-2 font-mono text-xs break-all ${theme === 'dark' ? 'bg-gray-900 border border-gray-700' : 'bg-blue-50 border border-blue-200'}`}>{example.input}</div>
                        <button
                          className={`p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors`}
                          aria-label="Copy input to clipboard"
                          onClick={() => handleCopy(example.input, `input${i}`)}
                          tabIndex={0}
                        >
                          <ClipboardCopy size={16} />
                          <span className="sr-only">Copy input</span>
                        </button>
                        {copied[`input${i}`] && <span className="text-xs text-green-500 ml-1">Copied!</span>}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className={`text-xs font-semibold uppercase tracking-wide ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>Output:</span>
                      <div className="flex items-center gap-2">
                        <div className={`rounded-md p-2 font-mono text-xs break-all ${theme === 'dark' ? 'bg-gray-900 border border-gray-700' : 'bg-blue-50 border border-blue-200'}`}>{example.output}</div>
                        <button
                          className={`p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors`}
                          aria-label="Copy output to clipboard"
                          onClick={() => handleCopy(example.output, `output${i}`)}
                          tabIndex={0}
                        >
                          <ClipboardCopy size={16} />
                          <span className="sr-only">Copy output</span>
                        </button>
                        {copied[`output${i}`] && <span className="text-xs text-green-500 ml-1">Copied!</span>}
                      </div>
                    </div>
                    {example.explanation && <span className="text-xs text-gray-400 mt-2">Flip or hover for explanation</span>}
                  </div>
                  {/* Back */}
                  <div className={`absolute w-full h-full rounded-xl shadow-lg p-5 flex flex-col justify-center items-center transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-blue-950/95 border border-blue-900/60' : 'bg-blue-100/95 border border-blue-300/60'
                  } rotate-y-180 backface-hidden`}> 
                    <span className={`text-xs font-bold uppercase tracking-wide mb-2 ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>Explanation</span>
                    <div className={`text-xs text-center ${theme === 'dark' ? 'text-blue-100' : 'text-blue-800'}`}>{example.explanation}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Constraints as Pills, collapsible if > 5 */}
      {problemData.constraints && (
        <div className="mt-12 mx-auto max-w-3xl">
          <h3 className={
            `${stickyHeader} text-xl font-bold flex items-center gap-2 mb-4 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`
          }>
            <FileText className="w-6 h-6" /> Constraints
            {problemData.constraints.length > 5 && (
              <button
                className="ml-2 flex items-center gap-1 px-2 py-1 text-xs rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                onClick={() => setExpandedConstraints((v) => !v)}
                aria-expanded={expandedConstraints}
                aria-controls="constraints-list"
              >
                {expandedConstraints ? <ChevronUp size={16} /> : <ChevronDown size={16} />} {expandedConstraints ? 'Show less' : 'Show all'}
              </button>
            )}
          </h3>
          <div id="constraints-list" className="flex flex-wrap gap-3">
            {(expandedConstraints || problemData.constraints.length <= 5
              ? problemData.constraints
              : problemData.constraints.slice(0, 5)
            ).map((constraint, i) => (
              <span key={i} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium shadow-sm border ${
                theme === 'dark' ? 'bg-gray-900/80 text-blue-200 border-blue-900/30' : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                <BadgeInfo size={14} /> {constraint}
              </span>
            ))}
            {problemData.constraints.length > 5 && !expandedConstraints && (
              <span className="text-xs text-gray-400">+{problemData.constraints.length - 5} more...</span>
            )}
          </div>
        </div>
      )}
      <ScrollToTopButton theme={theme} />
    </div>
  );
};

// --- CSS for flip card and fade-in (inject into global CSS or Tailwind config) ---
// .perspective { perspective: 900px; }
// .transform-style-preserve-3d { transform-style: preserve-3d; }
// .rotate-y-180 { transform: rotateY(180deg); }
// .backface-hidden { backface-visibility: hidden; }
// .fade-in { animation: fadeIn 0.8s; }
// @keyframes fadeIn { from { opacity: 0; transform: translateY(24px);} to { opacity: 1; transform: none;} }
//
// --- Sizing, padding, and color improvements applied throughout the component for best UX. ---

export default DescriptionTab;