"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Layers, FileText } from "lucide-react";
import { getMarkdownComponents } from "../markdown/MarkdownComponents";

const DescriptionTab = ({ problemData, theme = 'light' }) => {
  const markdownComponents = getMarkdownComponents(theme);
  
  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex items-center gap-3 mb-4">
        {problemData.number && (
          <span className={`font-medium text-sm px-3 py-1 rounded-full ${
            theme === 'dark' 
              ? 'bg-blue-900/30 text-blue-400' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            #{problemData.number}
          </span>
        )}
        
        {problemData.tags && problemData.tags.map((tag, index) => (
          <span key={index} className={`text-xs px-2 py-1 rounded-full ${
            theme === 'dark' 
              ? 'bg-gray-800 text-gray-300' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {tag}
          </span>
        ))}
      </div>
      
      <div className={`prose ${theme === 'dark' ? 'prose-invert' : 'prose-slate'} lg:prose-lg max-w-none`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
          components={markdownComponents}
        >
          {problemData.description}
        </ReactMarkdown>
      </div>
      
      {problemData.examples && (
        <div className="space-y-4 mt-8">
          <h3 className={`text-lg font-semibold flex items-center ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`}>
            <Layers className={`mr-2 w-5 h-5 ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`} />
            Examples
          </h3>
          {problemData.examples.map((example, index) => (
            <div key={index} className={`rounded-lg p-4 shadow-sm ${
              theme === 'dark' 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Input:</p>
                  <div className={`rounded-md p-3 font-mono text-sm ${
                    theme === 'dark' 
                      ? 'bg-gray-900 border border-gray-700' 
                      : 'bg-white border border-gray-200'
                  }`}>
                    {example.input}
                  </div>
                </div>
                <div>
                  <p className={`text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Output:</p>
                  <div className={`rounded-md p-3 font-mono text-sm ${
                    theme === 'dark' 
                      ? 'bg-gray-900 border border-gray-700' 
                      : 'bg-white border border-gray-200'
                  }`}>
                    {example.output}
                  </div>
                </div>
              </div>
              {example.explanation && (
                <div className="mt-3">
                  <p className={`text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Explanation:</p>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>{example.explanation}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {problemData.constraints && (
        <div className="mt-8">
          <h3 className={`text-lg font-semibold flex items-center mb-3 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`}>
            <FileText className={`mr-2 w-5 h-5 ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`} />
            Constraints
          </h3>
          <ul className={`list-disc list-inside space-y-1 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {problemData.constraints.map((constraint, index) => (
              <li key={index} className="text-sm">{constraint}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DescriptionTab;