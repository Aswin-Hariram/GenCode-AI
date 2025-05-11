"use client";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { getMarkdownComponents } from "../markdown/MarkdownComponents";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

const SolutionTab = ({ problemData, theme = 'light' }) => {
  const [copied, setCopied] = useState(false);
  const markdownComponents = getMarkdownComponents(theme);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(problemData.solution || '// Solution code will be displayed here');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-lg p-6 shadow-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <h3 className={`text-xl font-semibold mb-4 ${
          theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
        }`}>Solution Approach</h3>
        <div className={`space-y-4 ${
          theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
        }`}>
          <p>Here's an efficient solution to the problem:</p>
          <div className={`rounded-lg p-4 relative ${
            theme === 'dark' 
              ? 'bg-gray-900 border border-gray-700' 
              : 'bg-white border border-gray-200'
          }`}>
            <button
              onClick={handleCopyCode}
              className={`absolute top-2 right-2 px-3 py-1 rounded-md text-sm transition-colors flex items-center gap-1 ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              aria-label="Copy code"
            >
              {copied ? (
                <>
                  <Check size={16} /> Copied
                </>
              ) : (
                <>
                  <Copy size={16} /> Copy
                </>
              )}
            </button>
            <SyntaxHighlighter
              language="cpp"
              style={theme === 'dark' ? oneDark : oneLight}
              className="rounded-md"
            >
              {problemData.solution || '// Solution code will be displayed here'}
            </SyntaxHighlighter>
          </div>
          <div className="mt-6 space-y-4">
            <div className={`mb-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={markdownComponents}
              >
                {problemData.time_complexity}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionTab;