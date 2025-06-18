"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { getMarkdownComponents } from "../markdown/MarkdownComponents";

import SkeletonLoader from './SkeletonLoader';
import React, { useMemo } from 'react';

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
  "Stuck? Try explaining your code to a rubber duck (or GenCode!).",
  "The best way to learn is to experiment fearlessly!"
];

// Enhanced loader with animated cube, floating code, and random tip
const EnhancedGenCodeLoader = ({ theme }) => {
  // Pick a random tip on each mount
  const randomTip = useMemo(() => tips[Math.floor(Math.random() * tips.length)], []);

  // Fake code snippets to float around the cube
  const floatingSnippets = [
    { code: 'let x = AI();', style: { top: '-32px', left: '-70px', animationDelay: '0s' } },
    { code: 'def solve(): ...', style: { top: '10px', right: '-90px', animationDelay: '0.6s' } },
    { code: '/* GenCode rocks! */', style: { bottom: '-28px', left: '10px', animationDelay: '1.2s' } },
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-14">
      {/* 3D Cube + Floating Code */}
      <div className="relative flex flex-col items-center mb-6" style={{height: 100}}>
        {/* Floating code snippets */}
        {floatingSnippets.map((snippet, idx) => (
          <div
            key={idx}
            className={`absolute px-3 py-1 rounded-md shadow-lg text-xs font-mono whitespace-nowrap select-none pointer-events-none ${theme === 'dark' ? 'bg-blue-900/90 text-blue-100 border border-blue-800' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}
            style={{
              ...snippet.style,
              position: 'absolute',
              opacity: 0.92,
              animation: `floatFade 3.2s ease-in-out infinite`,
              animationDelay: snippet.style.animationDelay
            }}
          >
            {snippet.code}
          </div>
        ))}
        {/* Cube with glow */}
        <div className="cube-loader">
          <div className="cube cube-glow">
            <div className="face front"></div>
            <div className="face back"></div>
            <div className="face right"></div>
            <div className="face left"></div>
            <div className="face top"></div>
            <div className="face bottom"></div>
          </div>
        </div>
        <style jsx>{`
          .cube-loader {
            perspective: 600px;
            width: 64px;
            height: 64px;
            margin-bottom: 18px;
            z-index: 1;
          }
          .cube {
            width: 48px;
            height: 48px;
            position: relative;
            transform-style: preserve-3d;
            animation: cube-spin 1.4s infinite cubic-bezier(0.4,0.2,0.2,1);
          }
          .cube-glow {
            box-shadow: 0 0 32px 8px ${theme === 'dark' ? '#3b82f6aa' : '#60a5fa88'};
          }
          .face {
            position: absolute;
            width: 48px;
            height: 48px;
            opacity: 0.92;
            background: ${theme === 'dark' ? 'linear-gradient(135deg,#3b82f6 60%,#6366f1 100%)' : 'linear-gradient(135deg,#60a5fa 60%,#818cf8 100%)'};
            border-radius: 12px;
            box-shadow: 0 6px 24px 0 rgba(60,60,90,0.15);
          }
          .front  { transform: rotateY(  0deg) translateZ(24px); }
          .back   { transform: rotateY(180deg) translateZ(24px); }
          .right  { transform: rotateY( 90deg) translateZ(24px); }
          .left   { transform: rotateY(-90deg) translateZ(24px); }
          .top    { transform: rotateX( 90deg) translateZ(24px); }
          .bottom { transform: rotateX(-90deg) translateZ(24px); }
          @keyframes cube-spin {
            0% { transform: rotateX(0deg) rotateY(0deg); }
            100% { transform: rotateX(360deg) rotateY(360deg); }
          }
          @keyframes floatFade {
            0% { opacity: 0; transform: translateY(0px) scale(1); }
            15% { opacity: 1; transform: translateY(-10px) scale(1.08); }
            50% { opacity: 1; transform: translateY(-18px) scale(1.12); }
            85% { opacity: 1; transform: translateY(-10px) scale(1.08); }
            100% { opacity: 0; transform: translateY(0px) scale(1); }
          }
        `}</style>
      </div>

      {/* Progress Bar with glow */}
      <div className="w-64 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner mb-6 relative">
        <div className="h-full bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600 dark:from-blue-500 dark:via-indigo-500 dark:to-blue-400 animate-progressBar bar-glow" style={{width:'85%'}}></div>
        <style jsx>{`
          @keyframes progressBar {
            0% { width: 0; }
            80% { width: 85%; }
            100% { width: 85%; }
          }
          .animate-progressBar {
            animation: progressBar 1.8s cubic-bezier(0.4,0.2,0.2,1) infinite alternate;
          }
          .bar-glow {
            box-shadow: 0 0 16px 2px ${theme === 'dark' ? '#6366f1bb' : '#818cf8aa'};
          }
        `}</style>
      </div>

      {/* GenCode card */}
      <div className={`max-w-lg w-full rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-3 border-2 ${theme === 'dark' ? 'bg-gray-900/80 border-blue-900' : 'bg-white/90 border-blue-200'}`}>
        <div className={`text-lg font-mono font-semibold tracking-wide uppercase ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>Building your solution...</div>
        <div className={`text-base text-center ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>GenCode&apos;s AI is assembling logic blocks, optimizing creativity, and preparing a unique answer just for you.</div>
        <div className={`flex items-center gap-2 mt-2`}>
          <span className={`inline-block w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'} animate-pulse`}></span>
          <span className={`inline-block w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-indigo-400' : 'bg-indigo-600'} animate-pulse delay-150`}></span>
          <span className={`inline-block w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'} animate-pulse delay-300`}></span>
        </div>
        <div className={`mt-3 px-4 py-1 rounded-full text-xs font-bold tracking-wider ${theme === 'dark' ? 'bg-blue-900/80 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>AI Coding Magic · {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
      </div>

      {/* Random tip/fun fact */}
      <div className={`mt-8 text-center text-sm font-medium px-4 py-2 rounded-lg shadow-md ${theme === 'dark' ? 'bg-blue-950/80 text-blue-200 border border-blue-900' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}
        style={{maxWidth:'400px'}}>
        💡 {randomTip}
      </div>
    </div>
  );
};

const ResultsTab = ({ response, status, theme = 'light', isLoading = false }) => {
    const isError = response?.includes('#NO ACTUAL LOGIC FOUND') || status?.includes('Not Accepted') || status?.includes('Partially Accepted');
  const markdownComponents = getMarkdownComponents(theme);
  return (
    <div className="animate-fadeIn space-y-6 p-6" style={{ fontFamily: 'Urbanist, sans-serif' }}>
      {isLoading ? (
        <EnhancedGenCodeLoader theme={theme} />
      ) : !response ? (
        <div className="text-center py-12">
          <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            No results available. Submit your code to see the results.
          </div>
        </div>
      ) : (
        <div className={`prose ${theme === 'dark' ? 'prose-invert' : 'prose-lg'} max-w-none select-text prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:leading-7 prose-a:no-underline hover:prose-a:underline prose-strong:font-bold prose-pre:p-0 prose-pre:bg-transparent prose-pre:rounded-lg prose-img:rounded-lg`}>
          <div className={`rounded-lg p-4 mb-6 ${
            isError 
              ? theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50' 
              : theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
          }`}>
            <div className={`text-lg font-semibold mb-2 ${
              isError 
                ? theme === 'dark' ? 'text-red-400' : 'text-red-700' 
                : theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
            }`}>
              {isError ? 'Submission Error' : 'Submission Results'}
            </div>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
              components={markdownComponents}
            >
              {response}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsTab;