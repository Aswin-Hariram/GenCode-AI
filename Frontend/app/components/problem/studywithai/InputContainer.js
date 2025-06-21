import React, { useRef } from 'react';
import { Send } from 'lucide-react';

function InputContainer({ input, setInput, handleSend, theme }) {
  const textareaRef = useRef(null);

  // Submit on Enter (without Shift), new line on Shift+Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Only submit if input is not empty
      if (input.trim()) {
        onSubmit(e);
      }
    }
  };

  // Wrap handleSend to reset textarea height after sending
  const onSubmit = (e) => {
    handleSend(e);
    // Reset textarea height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className={`p-4 border-t ${theme === 'dark'
        ? 'border-slate-700/50 bg-slate-800/30'
        : 'border-slate-300 bg-slate-100/60'
      } backdrop-blur-sm`}>
      <form onSubmit={onSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about your studies..."
            rows={1}
            maxLength={2000}
            style={{ resize: 'none' }}
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 ${theme === 'dark'
                ? 'bg-slate-900/80 border-slate-700 text-slate-100 placeholder-slate-400 focus:bg-slate-900'
                : 'bg-white border-slate-400 text-slate-800 placeholder-slate-500 focus:bg-white focus:border-blue-500'
              } shadow-sm`}
            minLength={1}
            onInput={e => {
              const target = e.target;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 10 * 24) + 'px';
            }}
          />
        </div>
        <button
          type="submit"
          disabled={!input.trim()}
          className={`px-5 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-sm ${input.trim()
              ? theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/30 hover:shadow-blue-900/50'
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/30 hover:shadow-blue-500/50'
              : theme === 'dark'
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            } hover:scale-105 active:scale-95`}
          style={{ alignSelf: 'flex-end', height: '48px' }}
        >
          <Send size={18} />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
}

export default InputContainer;
