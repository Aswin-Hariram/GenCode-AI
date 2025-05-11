"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { markdownComponents } from "../markdown/MarkdownComponents";

const ResultsTab = ({ response, theme }) => {
  const isError = response?.includes('Error') || response?.includes('error');

  return (
    <div className="animate-fadeIn space-y-6 p-6">
      {!response ? (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            No results available. Submit your code to see the results.
          </div>
        </div>
      ) : (
        <div className={`prose prose-lg max-w-none select-text ${theme === 'dark' ? 'prose-invert' : ''} prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:leading-7 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:font-bold prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:p-0 prose-pre:bg-transparent prose-pre:rounded-lg prose-img:rounded-lg prose-table:border prose-table:border-gray-200 prose-th:bg-gray-100 prose-th:p-2 prose-td:p-2 prose-td:border prose-td:border-gray-200`}>
          <div className={`rounded-lg p-4 mb-6 ${isError ? 'bg-red-50 dark:bg-red-900/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
            <div className={`text-lg font-semibold mb-2 ${isError ? 'text-red-700 dark:text-red-400' : 'text-blue-700 dark:text-blue-400'}`}>
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