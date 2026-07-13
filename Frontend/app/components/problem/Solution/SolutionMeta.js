import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

const SolutionMeta = ({ markdown, markdownComponents, theme }) => (
  <div className={`mb-4 rounded-[20px] border px-5 py-4 ${theme === 'dark' ? 'text-gray-300 bg-slate-900/70 border-slate-700/70' : 'text-gray-700 bg-white/80 border-slate-200/90'} markdown-body`}>
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
