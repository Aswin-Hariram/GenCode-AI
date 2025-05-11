"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Layers, FileText } from "lucide-react";
import { markdownComponents } from "../markdown/MarkdownComponents";

const DescriptionTab = ({ problemData }) => {
  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex items-center gap-3 mb-4">
        {problemData.number && (
          <span className="bg-blue-100 text-blue-800 font-medium text-sm px-3 py-1 rounded-full">
            #{problemData.number}
          </span>
        )}
        
        {problemData.tags && problemData.tags.map((tag, index) => (
          <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      
      <div className="prose prose-slate lg:prose-lg max-w-none">
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
          <h3 className="text-lg font-semibold flex items-center text-gray-800">
            <Layers className="mr-2 w-5 h-5 text-blue-600" />
            Examples
          </h3>
          {problemData.examples.map((example, index) => (
            <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Input:</p>
                  <div className="bg-white border border-gray-200 rounded-md p-3 font-mono text-sm">
                    {example.input}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Output:</p>
                  <div className="bg-white border border-gray-200 rounded-md p-3 font-mono text-sm">
                    {example.output}
                  </div>
                </div>
              </div>
              {example.explanation && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-600 mb-2">Explanation:</p>
                  <div className="text-sm text-gray-700">{example.explanation}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {problemData.constraints && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold flex items-center text-gray-800 mb-3">
            <FileText className="mr-2 w-5 h-5 text-blue-600" />
            Constraints
          </h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
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