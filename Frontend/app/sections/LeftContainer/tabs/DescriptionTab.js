"use client";
import { useTheme } from "../../../context/ThemeContext";
import { useState, useRef } from "react";

import DescriptionMarkdown from '../../../components/problem/Description/DescriptionMarkdown';

const DescriptionTab = ({ problemData }) => {
  const { theme } = useTheme();


  if (!problemData) {
    return null; // Or a loading indicator
  }

  return (
    <div
      className={`relative w-full animate-fadeIn ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200'}`}
      style={{ fontFamily: 'Lexend, sans-serif',userSelect: 'text' }}
      aria-label="Problem Description Tab"
    >
      {/* Animated Markdown Description */}
      <DescriptionMarkdown description={problemData.description} />

      
      
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