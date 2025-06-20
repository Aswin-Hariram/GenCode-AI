import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { getMarkdownComponents } from "../markdown/MarkdownComponents";

const ResultsMarkdownBlock = ({ response, theme }) => {
  const markdownComponents = getMarkdownComponents(theme);
  return (
    <div className={`prose ${theme === 'dark' ? 'prose-invert' : 'prose-lg'} max-w-none select-text prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:leading-7 prose-a:no-underline hover:prose-a:underline prose-strong:font-bold prose-pre:p-0 prose-pre:bg-transparent prose-pre:rounded-lg prose-img:rounded-lg`}>
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
