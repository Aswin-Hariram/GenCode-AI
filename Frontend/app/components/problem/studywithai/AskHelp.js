import React from 'react'

function AskHelp({ handleAskHelp, theme }) {
  return (
    <div
        className={`w-full h-full flex items-center justify-center ${
          theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'
        } rounded-2xl shadow-2xl border ${
          theme === 'dark'
            ? 'border-slate-700/50 shadow-black/20'
            : 'border-slate-300 shadow-slate-400/30'
        } backdrop-blur-sm overflow-hidden`}
      >
        <div className="text-center p-6">
          <h1
            className={`text-2xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-slate-800'
            }`}
          >
            Welcome to Study with AI
          </h1>
          <p
            className={`mb-6 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            I can help you understand your problem better. Would you like to ask me a question about it?
          </p>
          <button
            onClick={handleAskHelp}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/30 hover:shadow-blue-900/50'
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/30 hover:shadow-blue-500/50'
            }`}
          >
            Yes, help me!
          </button>
        </div>
      </div>
  )
}

export default AskHelp