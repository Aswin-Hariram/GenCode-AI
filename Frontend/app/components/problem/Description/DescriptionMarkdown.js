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
      className={`transition-all w-full duration-500 rounded-[28px] shadow-xl mx-auto px-6 py-6 border backdrop-blur-sm ${
        theme === 'dark'
          ? 'bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_28%),linear-gradient(180deg,rgba(17,24,39,0.96),rgba(3,7,18,0.92))] border-slate-700/80'
          : 'bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,245,249,0.94))] border-slate-200/90'
      } fade-in`}
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
