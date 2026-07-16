import React, { Children, isValidElement, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import Image from "next/image";

// Remove pointer-events-auto to allow text selection/copy
const selectableStyle = "[&_*]:!select-text";
const MONO = "font-mono";

function AnchorIcon() {
  return <svg className="inline w-3.5 h-3.5 ml-1.5 opacity-0 group-hover:opacity-60 transition-opacity" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 010 5.656m-3.656-5.656a4 4 0 000 5.656m9.9-2.828a9 9 0 11-12.728 0" /></svg>;
}
function ExternalLinkIcon() {
  return <svg className="inline w-3.5 h-3.5 ml-1 -mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h6m5-3h3v3m-11 8l8-8" /></svg>;
}
function CopyIcon() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
}
function CheckIcon() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
}

function getTextContent(children) {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") return String(child);
      if (isValidElement(child)) return getTextContent(child.props.children);
      return "";
    })
    .join("")
    .trim();
}

// Section accent system: every h2 in the description becomes a "code comment"
// annotating what follows, e.g. `// problem statement`. Colors double as the
// gutter-line accent for that block.
const SECTION_ACCENTS = {
  "problem statement": { icon: "◆", dark: "#818CF8", light: "#4F46E5" },
  "input": { icon: "→", dark: "#34D399", light: "#059669" },
  "output": { icon: "←", dark: "#22D3EE", light: "#0891B2" },
  "constraints": { icon: "⊡", dark: "#FBBF24", light: "#B45309" },
  "examples": { icon: "✦", dark: "#E879F9", light: "#A21CAF" },
  "hints for careful readers": { icon: "⋄", dark: "#A78BFA", light: "#7C3AED" },
};

function getSectionAccent(title, theme) {
  const entry = SECTION_ACCENTS[title.toLowerCase()];
  if (!entry) return null;
  return { icon: entry.icon, color: theme === "dark" ? entry.dark : entry.light };
}

// Rough language -> accent dot color, so each code tab reads at a glance.
const LANG_DOTS = {
  javascript: "#F7DF1E", js: "#F7DF1E", jsx: "#61DAFB", typescript: "#3178C6", ts: "#3178C6",
  python: "#3776AB", py: "#3776AB", java: "#E76F00", cpp: "#649AD2", "c++": "#649AD2",
  c: "#A8B9CC", go: "#00ADD8", rust: "#DE9865", ruby: "#CC342D", bash: "#89E051", sh: "#89E051",
};

export const getMarkdownComponents = (theme) => {
  const isDark = theme === "dark";
  const gutterColor = isDark ? "#475569" : "#94A3B8";
  const inkColor = isDark ? "text-slate-300" : "text-slate-700";

  const Code = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    const [copied, setCopied] = useState(false);
    const codeRef = useRef(null);
    const codeString = String(children).replace(/\n$/, "");
    const lang = (match?.[1] || "").toLowerCase();
    const dotColor = LANG_DOTS[lang] || (isDark ? "#64748B" : "#94A3B8");

    const handleCopy = () => {
      if (navigator?.clipboard) {
        navigator.clipboard.writeText(codeString);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }
    };

    return !inline && match ? (
      <div
        className={`group/code my-5 overflow-hidden rounded-lg ${MONO} select-text ${
          isDark ? "border border-slate-700/80 bg-[#0D1117]" : "border border-slate-200 bg-[#FBFCFD]"
        } ${selectableStyle}`}
      >
        <div
          className={`flex items-center justify-between px-3.5 py-2 ${
            isDark ? "bg-[#161B22] border-b border-slate-700/80" : "bg-slate-50 border-b border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />
            <span className={`text-[11px] font-medium tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {match[1]}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-2 py-1 text-[11px] rounded-md font-medium transition-all opacity-70 group-hover/code:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
              isDark
                ? "text-slate-300 hover:bg-slate-800 focus-visible:ring-indigo-400"
                : "text-slate-600 hover:bg-slate-200 focus-visible:ring-indigo-500"
            }`}
            aria-label="Copy code"
            type="button"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <SyntaxHighlighter
          ref={codeRef}
          language={match[1]}
          style={isDark ? vscDarkPlus : vs}
          showLineNumbers
          lineNumberStyle={{ minWidth: "2.25em", paddingRight: "1em", color: gutterColor, opacity: 0.5, userSelect: "none" }}
          customStyle={{
            background: "transparent",
            fontSize: "0.9rem",
            borderRadius: 0,
            padding: "1rem 1.1rem",
            margin: 0,
            fontFamily: 'Fira Code, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
            userSelect: "text",
          }}
          codeTagProps={{
            style: { fontFamily: 'Fira Code, Menlo, Monaco, Consolas, "Liberation Mono", monospace', fontWeight: 500 },
          }}
          className="!bg-transparent select-text"
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code
        ref={codeRef}
        className={`px-1.5 py-0.5 rounded text-[0.9em] ${MONO} font-medium ${
          isDark ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20" : "bg-indigo-50 text-indigo-700 border border-indigo-100"
        } ${className || ""}`}
        {...props}
      >
        {codeString}
      </code>
    );
  };

  // Shared "docblock" renderer used by h2 — renders the section title as an
  // inline code comment (// title) with a fading rule, instead of a badge/pill.
  const SectionComment = ({ headingText, accent, id, children }) => (
    <h2
      id={id}
      className={`group relative mt-11 mb-4 first:mt-0 flex items-center scroll-mt-24 ${selectableStyle}`}
    >
      <span className={`${MONO} text-[0.8rem] sm:text-[0.85rem] tracking-tight flex items-center gap-2 shrink-0`}>
        <span style={{ color: accent.color }} className="opacity-70 select-none">{"//"}</span>
        <span style={{ color: accent.color }} className="select-none">{accent.icon}</span>
        <span className={`font-semibold uppercase tracking-[0.12em] ${isDark ? "text-slate-100" : "text-slate-800"}`}>
          {headingText}
        </span>
      </span>
      <span
        aria-hidden
        className="ml-3 h-px flex-1"
        style={{ background: `linear-gradient(to right, ${accent.color}55, transparent)` }}
      />
      {id && (
        <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Anchor link" style={{ color: accent.color }}>
          <AnchorIcon />
        </a>
      )}
    </h2>
  );

  return {
    h1: ({ node, children, ...props }) => {
      const headingText = getTextContent(children);
      const id = headingText ? headingText.replace(/\s+/g, "-").toLowerCase() : undefined;
      return (
        <h1
          id={id}
          className={`group text-2xl md:text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"} mb-5 mt-2 flex items-center scroll-mt-24 ${selectableStyle}`}
          {...props}
        >
          {children}
          {id && <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Anchor link"><AnchorIcon /></a>}
        </h1>
      );
    },
    h2: ({ node, children, ...props }) => {
      const headingText = getTextContent(children);
      const id = headingText ? headingText.replace(/\s+/g, "-").toLowerCase() : undefined;
      const accent = getSectionAccent(headingText, theme);
      if (accent) return <SectionComment headingText={headingText} accent={accent} id={id}>{children}</SectionComment>;
      return (
        <h2 id={id} className={`group text-xl font-bold ${isDark ? "text-slate-100" : "text-slate-800"} mb-3 mt-9 flex items-center scroll-mt-24 ${selectableStyle}`} {...props}>
          {children}
          {id && <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Anchor link"><AnchorIcon /></a>}
        </h2>
      );
    },
    h3: ({ node, children, ...props }) => {
      const headingText = getTextContent(children);
      const id = headingText ? headingText.replace(/\s+/g, "-").toLowerCase() : undefined;
      return (
        <h3 id={id} className={`group text-base font-semibold ${isDark ? "text-slate-200" : "text-slate-800"} mb-2 mt-5 flex items-center scroll-mt-24 ${selectableStyle}`} {...props}>
          {children}
          {id && <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Anchor link"><AnchorIcon /></a>}
        </h3>
      );
    },
    p: ({ node, ...props }) => (
      <p className={`text-[0.95rem] ${inkColor} mb-4 leading-[1.75] ${selectableStyle}`} {...props} />
    ),
    ul: ({ node, ...props }) => (
      <ul className={`pl-5 mb-5 space-y-2 ${inkColor} ${selectableStyle}`} style={{ listStyle: "none" }} {...props} />
    ),
    ol: ({ node, ...props }) => (
      <ol className={`pl-5 mb-5 space-y-2 counter-reset-[item] ${inkColor} ${selectableStyle}`} style={{ listStyle: "none" }} {...props} />
    ),
    li: ({ node, ordered, ...props }) => (
      <li
        className={`relative pl-5 text-[0.95rem] leading-[1.7] ${inkColor} mb-1 before:absolute before:left-0 before:top-[0.65em] before:w-1.5 before:h-1.5 before:rounded-sm before:content-[''] ${
          isDark ? "before:bg-indigo-400/70" : "before:bg-indigo-400"
        } ${selectableStyle}`}
        {...props}
      />
    ),
    a: ({ node, href, ...props }) => (
      <a
        className={`${isDark ? "text-indigo-300 hover:text-indigo-200 focus-visible:ring-indigo-400" : "text-indigo-600 hover:text-indigo-800 focus-visible:ring-indigo-500"} underline decoration-dotted underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded transition-colors ${selectableStyle}`}
        href={href}
        target={href && href.startsWith("http") ? "_blank" : undefined}
        rel={href && href.startsWith("http") ? "noopener noreferrer" : undefined}
        aria-label={href && href.startsWith("http") ? "External link" : undefined}
        {...props}
      >
        {props.children}
        {href && href.startsWith("http") && <ExternalLinkIcon />}
      </a>
    ),
    blockquote: ({ node, ...props }) => (
      <blockquote
        className={`relative pl-5 pr-4 py-3 my-5 border-l-2 ${MONO} text-[0.9rem] ${
          isDark ? "border-amber-400/60 bg-amber-400/[0.06] text-slate-300" : "border-amber-500/60 bg-amber-50 text-slate-700"
        } ${selectableStyle}`}
        {...props}
      >
        {props.children}
      </blockquote>
    ),
    hr: ({ node, ...props }) => (
      <hr className={`my-8 border-0 h-px ${isDark ? "bg-slate-700/60" : "bg-slate-200"}`} {...props} />
    ),
    strong: ({ node, ...props }) => (
      <strong className={`${isDark ? "text-white" : "text-slate-900"} font-semibold`} {...props} />
    ),
    Code,
    code: Code,
    table: ({ node, ...props }) => (
      <div className={`overflow-x-auto mb-5 rounded-lg border ${isDark ? "border-slate-700/80" : "border-slate-200"}`}>
        <table className={`min-w-full divide-y ${isDark ? "divide-slate-700/80" : "divide-slate-200"} ${selectableStyle}`} {...props} />
      </div>
    ),
    thead: ({ node, ...props }) => (
      <thead className={`${isDark ? "bg-slate-800/60" : "bg-slate-50"} ${selectableStyle}`} {...props} />
    ),
    tbody: ({ node, ...props }) => (
      <tbody className={`${isDark ? "bg-transparent divide-y divide-slate-700/60" : "bg-white divide-y divide-slate-100"} ${selectableStyle}`} {...props} />
    ),
    th: ({ node, ...props }) => (
      <th className={`px-4 py-2.5 text-left text-[11px] ${MONO} font-semibold ${isDark ? "text-slate-400" : "text-slate-500"} uppercase tracking-wider ${selectableStyle}`} {...props} />
    ),
    td: ({ node, ...props }) => (
      <td className={`px-4 py-2.5 text-[0.9rem] ${MONO} ${isDark ? "text-slate-300" : "text-slate-700"} ${selectableStyle}`} {...props} />
    ),
    img: ({ node, src, ...props }) => {
      const altText = props.alt || "";
      return (
        <span className="block my-5">
          <Image
            src={src || ""}
            alt={altText}
            width={640}
            height={360}
            className={`max-w-full h-auto rounded-lg mx-auto border ${isDark ? "border-slate-700/80" : "border-slate-200"}`}
            {...props}
          />
        </span>
      );
    },
  };
};