import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { getMarkdownComponents } from "../markdown/MarkdownComponents.js";
import { useTheme } from "../../../context/ThemeContext";

const DescriptionMarkdown = ({ description }) => {
  const { theme } = useTheme();
  const markdownComponents = getMarkdownComponents(theme);
  return (
    <div
      className={`transition-all w-full duration-500 rounded-xl shadow-md mx-auto px-6 py-6 ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-slate-100/90'} fade-in`}
      style={{ animation: 'fadeIn 0.8s',userSelect: 'text', }}
      aria-label="Problem Description"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={markdownComponents}
      >
        {description}
      </ReactMarkdown>
    </div>
  );
};

export default DescriptionMarkdown;
