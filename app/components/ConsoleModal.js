import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConsoleModal = ({ 
  isOpen, 
  onClose, 
  compilationResult, 
  showCorrectCode, 
  activeTestCase,
  theme = 'light'
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // More robust open state checking
  const shouldRenderModal = isOpen === true && 
    (compilationResult !== null && compilationResult !== undefined);

  if (!shouldRenderModal) return null;

  // Ensure compilationResult has expected properties
  const safeResult = compilationResult || {
    result: 'Unknown',
    message: 'No compilation result available',
    corrected_code: null
  };

  const getResultColor = () => {
    if (!compilationResult) return 'text-slate-300';
    switch (compilationResult.result) {
      case 'Success': return theme === 'dark' ? 'text-emerald-400' : 'text-emerald-500';
      case 'Compilation Error': return theme === 'dark' ? 'text-red-400' : 'text-red-500';
      case 'Runtime Error': return theme === 'dark' ? 'text-orange-400' : 'text-orange-500';
      default: return 'text-slate-300';
    }
  };
  
  const getResultBadgeColor = () => {
    if (!compilationResult) return theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700';
    switch (compilationResult.result) {
      case 'Success': return theme === 'dark' ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-800';
      case 'Compilation Error': return theme === 'dark' ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800';
      case 'Runtime Error': return theme === 'dark' ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-100 text-orange-800';
      default: return theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed bottom-4 right-4 z-50 w-[90%] max-w-4xl"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div 
            className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl shadow-2xl max-h-[80vh] overflow-hidden border`}
            onClick={(e) => e.stopPropagation()}
            layout
          >
            {/* Modal Header */}
            <div className={`bg-gradient-to-r ${theme === 'dark' ? 'from-slate-800 to-slate-700 border-slate-700' : 'from-slate-50 to-white border-slate-200'} p-4 flex justify-between items-center border-b`}>
              <div className="flex items-center space-x-3">
                <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Console Output</h2>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getResultBadgeColor()}`}>
                  {compilationResult.result}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className={`${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'} transition-colors`}
                >
                  {isCollapsed ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  )}
                </button>
                <button 
                  onClick={onClose} 
                  className={`${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'} transition-colors`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div 
                  className="overflow-auto max-h-[500px] text-sm font-mono"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {compilationResult ? (
                    <div className="p-6">
                      {compilationResult.message && (
                        <div className={`p-4 rounded-lg mb-4 border ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                          <pre className={`whitespace-pre-wrap break-words ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            {compilationResult.message}
                          </pre>
                        </div>
                      )}

                      {compilationResult.corrected_code && (
                        <div className="mt-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <strong className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Suggested Correction</strong>
                          </div>
                          <pre className={`p-4 rounded-lg overflow-x-auto relative group ${theme === 'dark' ? 'bg-slate-900 text-slate-300 border-slate-700' : 'bg-slate-50 text-slate-700 border-slate-200'} border`}>
                            {compilationResult.corrected_code}
                            <button 
                              className={`absolute top-2 right-2 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity ${theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'}`}
                              onClick={() => navigator.clipboard.writeText(compilationResult.corrected_code)}
                            >
                              Copy
                            </button>
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={`text-center p-8 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                      No compilation results available
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConsoleModal;