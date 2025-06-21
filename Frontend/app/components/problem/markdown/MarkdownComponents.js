import { useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import Image from "next/image";

// Remove pointer-events-auto to allow text selection/copy
const selectableStyle = "[&_*]:!select-text";

function AnchorIcon() {
  return <svg className="inline w-4 h-4 ml-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 010 5.656m-3.656-5.656a4 4 0 000 5.656m9.9-2.828a9 9 0 11-12.728 0" /></svg>;
}
function ExternalLinkIcon() {
  return <svg className="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h6m5-3h3v3m-11 8l8-8" /></svg>;
}

export const getMarkdownComponents = (theme) => ({
  h1: ({ node, children, ...props }) => {
    const id = typeof children === 'string' ? children.replace(/\s+/g, '-').toLowerCase() : undefined;
    return (
      <h1 id={id} className={`group text-3xl font-bold font-lexend ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} mb-6 mt-8 flex items-center scroll-mt-24 ${selectableStyle}`} {...props}>
        {children}
        {id && <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Anchor link"><AnchorIcon /></a>}
      </h1>
    );
  },
  h2: ({ node, children, ...props }) => {
    const id = typeof children === 'string' ? children.replace(/\s+/g, '-').toLowerCase() : undefined;
    return (
      <h2 id={id} className={`group text-2xl font-semibold font-lexend ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} mb-4 mt-8 flex items-center scroll-mt-24 ${selectableStyle}`} {...props}>
        {children}
        {id && <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Anchor link"><AnchorIcon /></a>}
      </h2>
    );
  },
  h3: ({ node, children, ...props }) => {
    const id = typeof children === 'string' ? children.replace(/\s+/g, '-').toLowerCase() : undefined;
    return (
      <h3 id={id} className={`group text-xl font-semibold font-lexend ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} mb-3 mt-6 flex items-center scroll-mt-24 ${selectableStyle}`} {...props}>
        {children}
        {id && <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Anchor link"><AnchorIcon /></a>}
      </h3>
    );
  },
  p: ({ node, ...props }) => (
    <p className={`text-base font-lexend ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-4 leading-relaxed ${selectableStyle}`} {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul className={`list-disc pl-6 mb-4 space-y-1 marker:text-blue-400 dark:marker:text-blue-300 font-lexend ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} ${selectableStyle}`} {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className={`list-decimal pl-6 mb-4 space-y-1 marker:text-blue-400 dark:marker:text-blue-300 font-lexend ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} ${selectableStyle}`} {...props} />
  ),
  li: ({ node, ...props }) => (
    <li className={`text-base font-lexend ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1 ${selectableStyle}`} {...props} />
  ),
  a: ({ node, href, ...props }) => (
    <a
      className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300 focus-visible:ring-blue-400' : 'text-blue-600 hover:text-blue-800 focus-visible:ring-blue-600'} underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded transition-all font-lexend ${selectableStyle}`}
      href={href}
      target={href && href.startsWith('http') ? '_blank' : undefined}
      rel={href && href.startsWith('http') ? 'noopener noreferrer' : undefined}
      aria-label={href && href.startsWith('http') ? 'External link' : undefined}
      {...props}
    >
      {props.children}
      {href && href.startsWith('http') && <ExternalLinkIcon />}
    </a>
  ),
  blockquote: ({ node, ...props }) => (
    <blockquote className={`relative pl-6 pr-2 py-3 my-4 border-l-4 rounded-lg font-lexend ${theme === 'dark' ? 'border-blue-500 bg-gray-900/60 text-gray-300' : 'border-blue-400 bg-blue-50 text-gray-700'} italic ${selectableStyle}`} {...props}>
      <span className="absolute left-2 top-2 text-blue-400 dark:text-blue-300">❝</span>
      {props.children}
    </blockquote>
  ),
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    const [copied, setCopied] = useState(false);
    const codeRef = useRef(null);
    const codeString = String(children).replace(/\n$/, "");

    const handleCopy = () => {
      if (navigator && navigator.clipboard) {
        navigator.clipboard.writeText(codeString);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }
    };

    return !inline && match ? (
      <div className={`my-4 overflow-hidden rounded-lg font-lexend select-text ${theme === 'dark' ? 'border border-gray-700 bg-gray-800' : 'border border-gray-200 bg-gray-50'} ${selectableStyle}`}>
        <div className={`flex items-center justify-between font-lexend ${theme === 'dark' ? 'bg-gray-700 px-4 py-2 border-b border-gray-600' : 'bg-gray-100 px-4 py-2 border-b border-gray-200'}`}>
          <span className={`text-xs font-medium font-lexend ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{match[1]}</span>
          <div className="flex items-center space-x-1">
            <button
              onClick={handleCopy}
              className={`ml-3 px-2 py-1 text-xs rounded font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${theme === 'dark' ? 'bg-gray-800 text-blue-300 hover:bg-gray-600 focus-visible:ring-blue-400' : 'bg-gray-200 text-blue-700 hover:bg-gray-300 focus-visible:ring-blue-600'}`}
              aria-label="Copy code"
              type="button"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        <SyntaxHighlighter
          ref={codeRef}
          language={match[1]}
          style={theme === 'dark' ? vscDarkPlus : vs}
          customStyle={{
            background: theme === 'dark' ? '#181C24' : '#f3f6fa',
            fontSize: '1rem',
            borderRadius: '0.75rem',
            padding: '1rem',
            fontFamily: 'Lexend, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            color: theme === 'dark' ? '#e5e7eb' : '#1e293b',
            boxShadow: theme === 'dark' ? '0 2px 12px 0 #0002' : '0 2px 12px 0 #0001',
            userSelect: 'text',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'Lexend, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontWeight: 600,
              letterSpacing: '0.015em',
              userSelect: 'text',
            }
          }}
          className="!bg-transparent font-lexend select-text"
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code className={`px-2 py-1 rounded font-mono text-sm font-lexend border transition-colors select-text
        ${theme === 'dark' ? 'bg-[#23272e] text-emerald-300 border-[#333a46]' : 'bg-[#f3f6fa] text-indigo-700 border-[#e0e7ef]'}
        ${selectableStyle}`}
        style={{ fontWeight: 600, letterSpacing: '0.015em', userSelect: 'text' }}
        {...props}
      >
        {children}
      </code>
    );
  },
  table: ({ node, ...props }) => (
    <div className="overflow-x-auto mb-4 font-lexend">
      <table className={`min-w-full divide-y font-lexend ${theme === 'dark' ? 'divide-gray-700 border border-gray-700 rounded-lg' : 'divide-gray-200 border border-gray-200 rounded-lg'} ${selectableStyle}`} {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => (
    <thead className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} font-lexend ${selectableStyle}`} {...props} />
  ),
  tbody: ({ node, ...props }) => (
    <tbody className={`${theme === 'dark' ? 'bg-gray-900 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'} font-lexend ${selectableStyle}`} {...props} />
  ),
  th: ({ node, ...props }) => (
    <th className={`px-4 py-3 text-left text-xs font-medium font-lexend ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider ${selectableStyle}`} {...props} />
  ),
  td: ({ node, ...props }) => (
    <td className={`px-4 py-3 text-sm font-lexend ${theme === 'dark' ? 'text-gray-300 border border-gray-700' : 'text-gray-700 border border-gray-200'} ${selectableStyle}`} {...props} />
  ),
  img: ({ node, src, ...props }) => {
    // If src is not provided, use an empty alt text for decorative images
    const altText = props.alt || '';
    return (
      <Image
        src={src || ''}
        alt={altText}
        width={500}
        height={300}
        className={`max-w-full h-auto rounded-lg mx-auto my-4 font-lexend ${theme === 'dark' ? 'opacity-90' : ''}`}
        {...props}
      />
    );
  },
});