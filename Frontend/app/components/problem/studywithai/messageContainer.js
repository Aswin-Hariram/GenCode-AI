import React from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism";

import TypingIndicator from './TypingIndicator';
import { getMarkdownComponents } from "../markdown/MarkdownComponents.js";
import { getUserMessageStyle } from "../markdown/userMessage.js";

// ✅ Auto-wrap code with language detection
function autoWrapCodeIfNeeded(text) {
  const trimmedText = text.trim();

  if (trimmedText.startsWith("```")) return text; // Already wrapped

  const languagePatterns = [
    {
      lang: "cpp",
      signals: [
        /#include\s*<[^>]+>/,
        /\busing\s+namespace\b/,
        /\bint\s+main\s*\(\)/,
        /\bclass\s+\w+/,
        /std::/,
        /;\s*$/,
      ],
    },
    {
      lang: "java",
      signals: [
        /\bpublic\s+class\b/,
        /\bstatic\s+void\s+main\s*\(\s*String\[\]\s+\w+\)/,
        /\bSystem\.out\.println\(/,
        /import\s+java\./,
        /\bclass\s+\w+/,
        /;\s*$/,
      ],
    },
    {
      lang: "python",
      signals: [
        /^\s*def\s+\w+\s*\(/m,
        /^\s*class\s+\w+\s*:/m,
        /\bimport\s+\w+/,
        /print\s*\(/,
        /:\s*$/,
      ],
    },
    {
      lang: "javascript",
      signals: [
        /\bfunction\b/,
        /\bconst\b|\blet\b|\bvar\b/,
        /console\.log/,
        /\bclass\s+\w+/,
        /{\s*$/,
        /;\s*$/,
      ],
    },
  ];

  let bestMatch = null;
  let maxScore = 0;

  for (const langPattern of languagePatterns) {
    const score = langPattern.signals.filter((regex) =>
      trimmedText.match(regex)
    ).length;

    if (score > maxScore) {
      maxScore = score;
      bestMatch = langPattern.lang;
    }
  }

  if (bestMatch && maxScore >= 2) {
    return `\`\`\`${bestMatch}\n${trimmedText}\n\`\`\``;
  }

  return text;
}

function MessageContainer({ messages, isTyping, theme, messagesEndRef, isFullScreen }) {
  const markdownComponents = getMarkdownComponents(theme);
  const userMessageStyle = getUserMessageStyle(theme);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
      {messages.map((msg, idx) => (
        <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
          
          {/* Avatar */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            msg.sender === 'user'
              ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
              : theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
          }`}>
            {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
          </div>

          {/* Message Bubble */}
          <div className={` ${isFullScreen ? 'min-w-[25%] max-w-[50%]' : 'min-w-[55%] max-w-[75%]'} ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block px-4 py-3 max-w-full rounded-2xl text-sm leading-relaxed shadow-sm ${
              msg.sender === 'user'
                ? theme === 'dark'
                  ? 'bg-blue-600 text-white shadow-blue-900/20'
                  : 'bg-blue-500 text-white shadow-blue-500/20'
                : theme === 'dark'
                  ? 'bg-slate-800 text-slate-100 border border-slate-700/50 shadow-slate-900/30'
                  : 'bg-white text-slate-800 border border-slate-300 shadow-slate-300/40'
            } ${msg.sender === 'user' ? 'rounded-br-md' : 'rounded-bl-md'}`}>
              
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={msg.sender !== 'user'?markdownComponents: userMessageStyle}
              >
                {msg.sender === 'user' ? autoWrapCodeIfNeeded(msg.text) : msg.text}
              </ReactMarkdown>
            </div>

            <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
              {msg.sender === 'user' ? 'You' : 'AI Assistant'}
            </div>
          </div>
        </div>
      ))}

      {isTyping && <TypingIndicator theme={theme} />}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageContainer;
