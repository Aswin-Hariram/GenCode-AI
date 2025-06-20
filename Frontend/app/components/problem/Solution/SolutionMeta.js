import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

const SolutionMeta = ({ markdown, markdownComponents, theme }) => (
  <div className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} markdown-body`}>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
      components={markdownComponents}
    >
      {markdown}
    </ReactMarkdown>
  </div>
);

export default SolutionMeta;
