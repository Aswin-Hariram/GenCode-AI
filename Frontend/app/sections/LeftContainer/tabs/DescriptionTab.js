"use client";
import { Layers } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import ScrollToTopButton from './ScrollToTopButton.js';
import { useState, useRef } from "react";
import ProblemWorkspace from '../ProblemWorkspace';
import ExampleFlipCard from "../../../components/problem/Description/ExampleFlipCard";
import ConstraintsSection from "../../../components/problem/Description/ConstraintsSection";

import DescriptionMarkdown from '../../../components/problem/Description/DescriptionMarkdown';

const DescriptionTab = ({ problemData }) => {
  const { theme } = useTheme();
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

  if (!problemData) {
    return null; // Or a loading indicator
  }

  return (
    <div
      className={`relative animate-fadeIn rounded-md ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200'}`}
      style={{ fontFamily: 'Urbanist, sans-serif' }}
      aria-label="Problem Description Tab"
    >
      {/* Animated Markdown Description */}
      <DescriptionMarkdown description={problemData.description} />

      {/* Flip Card Examples */}
      {problemData.examples && (
        <div className="space-y-6 mt-12 mx-auto max-w-3xl">
          <h3 className={`sticky top-0 z-10 bg-opacity-80 backdrop-blur-md py-2 px-2 rounded-t-md shadow-sm text-xl font-bold flex items-center gap-2 mb-4 ${theme === 'dark' ? 'bg-gray-950/80 text-blue-300' : 'bg-slate-100/90 text-blue-700'}`}>
            <Layers className="w-6 h-6" /> Examples
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {problemData.examples.map((example, i) => (
              <ExampleFlipCard
                key={i}
                example={example}
                idx={i}
                theme={theme}
                handleCardKeyDown={handleCardKeyDown}
                copied={copied}
                handleCopy={handleCopy}
              />
            ))}
          </div>
        </div>
      )}

      {/* Constraints as Pills, collapsible if > 5 */}
      {problemData.constraints && (
        <ConstraintsSection
          constraints={problemData.constraints}
          expanded={expandedConstraints}
          setExpanded={setExpandedConstraints}
          theme={theme}
        />
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