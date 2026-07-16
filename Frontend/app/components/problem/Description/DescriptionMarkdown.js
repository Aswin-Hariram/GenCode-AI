import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { getMarkdownComponents } from "../markdown/MarkdownComponents.js";
import { useTheme } from "../../../context/ThemeContext";

const DescriptionMarkdown = ({ description, filename = "description.md" }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const markdownComponents = getMarkdownComponents(theme);

  return (
    <div
      className={`w-full rounded-xl overflow-hidden transition-shadow duration-300 fade-in-scale ${
        isDark
          ? "bg-[#0B0F17] border border-slate-800 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]"
          : "bg-white border border-slate-200 shadow-sm"
      }`}
      style={{ fontFamily: "'Inter', sans-serif" }}
      aria-label="Problem description"
    >
      {/* Editor-style tab bar */}
      <div
        className={`flex items-center justify-between px-5 py-2.5 border-b ${
          isDark ? "bg-[#10151F] border-slate-800" : "bg-slate-50 border-slate-200"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isDark ? "bg-indigo-400" : "bg-indigo-500"}`} />
          <span className={`font-mono text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{filename}</span>
        </div>
        <span className={`font-mono text-[10px] uppercase tracking-[0.15em] ${isDark ? "text-slate-600" : "text-slate-400"}`}>
          read-only
        </span>
      </div>

      {/* Body: line-numbered like a source file */}
      <div className="px-6 py-7 md:px-8 md:py-8 md:pl-16 relative" style={{ userSelect: "text" }}>
        <div className={`pd-gutter ${isDark ? "pd-gutter-dark" : "pd-gutter-light"}`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={markdownComponents}
          >
            {description}
          </ReactMarkdown>
        </div>
      </div>

      <style>{`
        .pd-gutter { counter-reset: pd-line; }
        .pd-gutter > * { counter-increment: pd-line; position: relative; }
        @media (min-width: 768px) {
          .pd-gutter > *::before {
            content: counter(pd-line, decimal-leading-zero);
            position: absolute;
            left: -2.75rem;
            top: 0.2em;
            width: 2rem;
            text-align: right;
            font-family: 'Fira Code', Menlo, Monaco, Consolas, monospace;
            font-size: 0.68rem;
            letter-spacing: 0.03em;
            user-select: none;
          }
          .pd-gutter-dark > *::before { color: #334155; }
          .pd-gutter-light > *::before { color: #CBD5E1; }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: none; }
        }
        .fade-in-scale { animation: fadeInScale 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
        @media (prefers-reduced-motion: reduce) {
          .fade-in-scale { animation: none; }
        }
      `}</style>
    </div>
  );
};

export default DescriptionMarkdown;