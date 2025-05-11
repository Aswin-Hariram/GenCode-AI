"use client";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { markdownComponents } from "../markdown/MarkdownComponents";
import { Copy, Check } from "lucide-react"; // Import icons from lucide-react
import { useState } from "react"; // Import useState hook

const SolutionTab = ({ problemData }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(problemData.solution || '// Solution code will be displayed here');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-100 rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-blue-600 mb-4">Solution Approach</h3>
        <div className="text-gray-800 space-y-4">
          <p>Here's an efficient solution to the problem:</p>
          <div className="bg-white rounded-lg p-4 border border-gray-200 relative">
            <button
              onClick={handleCopyCode}
              className="absolute top-2 right-2 bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-md text-sm transition-colors flex items-center gap-1"
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
              style={oneLight}
              className="rounded-md"
            >
              {problemData.solution || '// Solution code will be displayed here'}
            </SyntaxHighlighter>
          </div>
          <div className="mt-6 space-y-4">
            <div className="text-gray-700 mb-4">
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