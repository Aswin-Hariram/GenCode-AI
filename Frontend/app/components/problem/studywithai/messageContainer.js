import React from 'react';
import { Bot, User } from 'lucide-react';


import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { getMarkdownComponents } from '../markdown/MarkdownComponents';


function MessageContainer({ messages, isTyping, theme, messagesEndRef }) {

   const markdownComponents = getMarkdownComponents(theme); 
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
      {messages.map((msg, idx) => (
        <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Avatar */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === 'user'
              ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
              : theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
            }`}>
            {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
          </div>
          {/* Message Bubble */}
          <div className={`min-w-[55%] max-w-[75%] ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block px-4 py-3  max-w-full rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
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
                
              >
                {msg.text}
              </ReactMarkdown>
            </div>
            <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
              }`}>
              {msg.sender === 'user' ? 'You' : 'AI Assistant'}
            </div>
          </div>
        </div>
      ))}
      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex gap-3">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
            }`}>
            <Bot size={16} />
          </div>
          <div className={`px-4 py-3 rounded-2xl rounded-bl-md ${theme === 'dark'
              ? 'bg-slate-800 border border-slate-700/50'
              : 'bg-white border border-slate-300'
            } shadow-sm`}>
            <div className="flex gap-1">
              <div className={`w-2 h-2 rounded-full animate-bounce ${theme === 'dark' ? 'bg-slate-400' : 'bg-slate-500'
                }`} style={{ animationDelay: '0ms' }}></div>
              <div className={`w-2 h-2 rounded-full animate-bounce ${theme === 'dark' ? 'bg-slate-400' : 'bg-slate-500'
                }`} style={{ animationDelay: '150ms' }}></div>
              <div className={`w-2 h-2 rounded-full animate-bounce ${theme === 'dark' ? 'bg-slate-400' : 'bg-slate-500'
                }`} style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageContainer;

