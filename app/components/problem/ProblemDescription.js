"use client";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { FiClock, FiAward } from 'react-icons/fi';

const ProblemDescription = ({ problemData, activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="prose prose-headings:text-blue-600 prose-a:text-blue-600 max-w-none mb-6">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
              components={markdownComponents}
            >
              {problemData.description}
            </ReactMarkdown>
          </div>
        );
      case 'solution':
        console.log("solution",problemData);
        return (
          <div className="space-y-6">
            <div className="bg-gray-100 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">Solution Approach</h3>
              <div className="text-gray-800 space-y-4">
                <p>Here's an efficient solution to the problem:</p>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
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
      default:
        return null;
    }
  };

  const markdownComponents = {
    h1: ({ node, ...props }) => (
      <h1 className="text-3xl font-bold text-blue-700 mb-4" {...props} />
    ),
    h2: ({ node, ...props }) => (
      <h2 className="text-2xl font-semibold text-blue-600 mb-3 mt-6" {...props} />
    ),
    p: ({ node, ...props }) => (
      <p className="text-base text-gray-800 mb-4 leading-relaxed" {...props} />
    ),
    li: ({ node, ...props }) => (
      <li className="text-base text-gray-800 mb-2" {...props} />
    ),
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={oneLight}
          language={match[1]}
          PreTag="div"
          {...props}
          className="rounded-md my-4"
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className="bg-gray-100 text-blue-700 px-1 rounded" {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="h-full overflow-auto p-6 bg-white">
      {renderContent()}
    </div>
  );
};

export default ProblemDescription;