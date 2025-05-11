import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";

const selectableStyle = "[&_*]:!select-text [&_*]:!pointer-events-auto";

export const markdownComponents = {
  h1: ({ node, ...props }) => (
    <h1 className={`text-3xl font-bold text-gray-900 mb-4 ${selectableStyle}`} {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className={`text-2xl font-semibold text-gray-800 mb-3 mt-6 ${selectableStyle}`} {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className={`text-xl font-semibold text-gray-800 mb-3 mt-5 ${selectableStyle}`} {...props} />
  ),
  p: ({ node, ...props }) => (
    <p className={`text-base text-gray-700 mb-4 leading-relaxed ${selectableStyle}`} {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul className={`list-disc pl-5 mb-4 space-y-1 text-gray-700 ${selectableStyle}`} {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className={`list-decimal pl-5 mb-4 space-y-1 text-gray-700 ${selectableStyle}`} {...props} />
  ),
  li: ({ node, ...props }) => (
    <li className={`text-base text-gray-700 mb-1 ${selectableStyle}`} {...props} />
  ),
  a: ({ node, ...props }) => (
    <a className={`text-blue-600 hover:text-blue-800 underline ${selectableStyle}`} {...props} />
  ),
  blockquote: ({ node, ...props }) => (
    <blockquote className={`pl-4 border-l-4 border-gray-300 italic text-gray-700 ${selectableStyle}`} {...props} />
  ),
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <div className={`my-4 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 ${selectableStyle}`}>
        <div className="flex items-center justify-between bg-gray-100 px-4 py-2 border-b border-gray-200">
          <span className="text-xs font-medium text-gray-600">{match[1]}</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
          </div>
        </div>
        <SyntaxHighlighter
          style={atomOneLight}
          language={match[1]}
          PreTag="div"
          {...props}
          customStyle={{
            margin: 0,
            padding: '1rem',
            backgroundColor: 'white',
            userSelect: 'text',
            WebkitUserSelect: 'text',
            MozUserSelect: 'text',
            msUserSelect: 'text',
            pointerEvents: 'auto'
          }}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code className={`bg-gray-100 text-blue-700 px-1.5 py-0.5 rounded font-mono text-sm ${selectableStyle}`} {...props}>
        {children}
      </code>
    );
  },
  table: ({ node, ...props }) => (
    <div className="overflow-x-auto mb-4">
      <table className={`min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg ${selectableStyle}`} {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => (
    <thead className={`bg-gray-50 ${selectableStyle}`} {...props} />
  ),
  tbody: ({ node, ...props }) => (
    <tbody className={`bg-white divide-y divide-gray-200 ${selectableStyle}`} {...props} />
  ),
  th: ({ node, ...props }) => (
    <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${selectableStyle}`} {...props} />
  ),
  td: ({ node, ...props }) => (
    <td className={`px-4 py-3 text-sm text-gray-700 ${selectableStyle}`} {...props} />
  ),
  img: ({ node, ...props }) => (
    <img className="max-w-full h-auto rounded-lg mx-auto my-4" {...props} />
  ),
};