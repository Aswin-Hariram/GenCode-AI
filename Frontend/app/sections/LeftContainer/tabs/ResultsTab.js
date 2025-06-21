"use client";
import { getMarkdownComponents } from "../../../components/problem/markdown/MarkdownComponents";
import EnhancedGenCodeLoader from '../../../elements/SkeletonLoader';
import ResultsMarkdownBlock from '../../../components/problem/Results/ResultsMarkdownBlock';
import ErrorAlert from '../../../elements/Problem/Solution/ErrorAlert';
import React, { useMemo } from 'react';
import ResultLoader from '../../../components/Results/ResultLoader';

// Enhanced loader with animated cube, floating code, and random tip
// Tips/fun facts
const tips = [
  "You can use // TODO comments to mark ideas for later!",
  "Try submitting in multiple languages for deeper learning.",
  "GenCode AI never sleeps – submit as many times as you want!",
  "Did you know? The first computer bug was a real moth.",
  "Break big problems into small functions for clarity.",
  "Use meaningful variable names for readable code.",
  "Practice makes progress, not perfection!",
  "GenCode can help you learn new algorithms, not just solve problems.",
  "The best way to learn is to experiment fearlessly!"
];

const ResultsTab = ({ response, status, theme = 'light', isLoading = false }) => {
  const isError = response?.includes('#NO ACTUAL LOGIC FOUND') || status?.includes('Not Accepted') || status?.includes('Partially Accepted');
  return (
    <div className="animate-fadeIn space-y-6 p-6 font-lexend " style={{ fontFamily: 'Lexend, sans-serif' }}>
      {isLoading ? (
        <ResultLoader theme={theme} />
      ) : !response ? (
        <div className="text-center py-12">
          <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            No results available. Submit your code to see the results.
          </div>
        </div>
      ) : (
        <div className=" max-w-screen mx-auto ">
          <div className={`prose ${theme === 'dark' ? 'prose-invert' : 'prose-lg'} max-w-none select-text prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:leading-7 prose-a:no-underline hover:prose-a:underline prose-strong:font-bold prose-pre:p-0 prose-pre:bg-transparent prose-pre:rounded-lg prose-img:rounded-lg`}>
            <div className={`rounded-lg p-4 mb-6 ${
              isError 
                ? theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50' 
                : theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-100'
            }`}>
              <div className={`text-lg font-semibold mb-2 ${
                isError 
                  ? theme === 'dark' ? 'text-red-400' : 'text-red-700' 
                  : theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
              }`}>
                {isError ? 'Submission Error' : 'Submission Results'}
              </div>
              {isError && <ErrorAlert error={status || 'Submission Error'} theme={theme} />}
              <ResultsMarkdownBlock response={response} theme={theme} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsTab;