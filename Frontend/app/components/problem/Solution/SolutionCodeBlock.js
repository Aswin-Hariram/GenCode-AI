import React from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import SkeletonLoader from '../../../elements/SkeletonLoader';
import CopyButton from '../../../elements/Problem/Solution/CopyButton';

const SolutionCodeBlock = ({ code, language, theme, onCopy, copied, isConverting }) => (
  <div className={`rounded-xl relative group transition-all duration-300 ${theme === 'dark' ? 'bg-gray-900/70 border border-gray-700/80' : 'bg-slate-100/70 border border-gray-300/80'}`}>
    <CopyButton
      onClick={onCopy}
      copied={copied}
      disabled={isConverting}
      className="absolute top-3 right-3"
    />
    <div className="p-4 min-h-[200px]">
      {isConverting ? (
        <SkeletonLoader theme={theme} />
      ) : (
        <SyntaxHighlighter
          language={language}
          style={theme === 'dark' ? vscDarkPlus : vs}
          customStyle={{
            background: theme === 'dark' ? '#181C24' : '#f3f6fa',
            fontSize: '1rem',
            borderRadius: '0.75rem',
            padding: '1rem',
            fontFamily: 'Lexend, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            color: theme === 'dark' ? '#e5e7eb' : '#1e293b',
            boxShadow: theme === 'dark' ? '0 2px 12px 0 #0002' : '0 2px 12px 0 #0001',
            userSelect: 'text',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'Lexend, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontWeight: 600,
              letterSpacing: '0.015em',
            }
          }}
          className="!bg-transparent font-lexend"
        >
          {code}
        </SyntaxHighlighter>
      )}
    </div>
  </div>
);

export default SolutionCodeBlock;
