import React from 'react'
import { Send, Bot, User, Sparkles, XCircle, Maximize2, Minimize2 } from 'lucide-react';

function Header({theme, onClearChat, onFullScreenToggle, isFullScreen}) {
    return (
        <div className={`px-6 py-3 border-b ${theme === 'dark'
            ? 'border-slate-700/50 bg-slate-800/50'
            : 'border-slate-300 bg-slate-100/80'
            } backdrop-blur-sm`}>
            <div className="flex items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-1 rounded-full ${theme === 'dark'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-blue-500/10 text-blue-600'
                        }`}>
                        <Sparkles size={18} />
                    </div>
                    <div>
                        <h2 className={`font-semibold text-md ${theme === 'dark' ? 'text-white' : 'text-slate-800'
                            }`}>
                            AI Study Assistant
                        </h2>
                        <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                            Ready to help you learn
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onFullScreenToggle}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
                        title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
                    >
                        {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
                    </button>
                    <button
                        onClick={onClearChat}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
                        title="Clear chat"
                    >
                        <XCircle size={16} />
                        Clear Chat
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Header