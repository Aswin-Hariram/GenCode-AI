"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { getMarkdownComponents } from "../markdown/MarkdownComponents";

const ResultsTab = ({ response, theme = 'light' }) => {
  const isError = response?.includes('Error') || response?.includes('error');
  const markdownComponents = getMarkdownComponents(theme);

  return (
    <div className="animate-fadeIn space-y-6 p-6">
      {!response ? (
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