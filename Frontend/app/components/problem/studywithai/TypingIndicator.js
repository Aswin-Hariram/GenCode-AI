import React from 'react'
import { Bot, User } from 'lucide-react';

function TypingIndicator({theme}) {
   
  return (
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
  )
}

export default TypingIndicator