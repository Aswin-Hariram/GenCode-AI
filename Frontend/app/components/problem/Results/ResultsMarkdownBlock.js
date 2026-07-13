import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { getMarkdownComponents } from "../markdown/MarkdownComponents";

const ResultsMarkdownBlock = ({ response, theme }) => {
  const markdownComponents = getMarkdownComponents(theme);
  return (
    <div className={`max-w-none select-text markdown-body rounded-[24px] border px-5 py-5 ${
      theme === 'dark'
        ? 'bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.88))] border-slate-700/70'
        : 'bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,245,249,0.94))] border-slate-200/90'
    }`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={markdownComponents}
      >
        {response}
      </ReactMarkdown>
    </div>
  );
};

export default ResultsMarkdownBlock;
