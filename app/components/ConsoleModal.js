import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConsoleModal = ({ 
  isOpen, 
  onClose, 
  compilationResult, 
  showCorrectCode, 
  activeTestCase 
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
      case 'Success': return 'text-emerald-500 dark:text-emerald-400';
      case 'Compilation Error': return 'text-red-500 dark:text-red-400';
      case 'Runtime Error': return 'text-orange-500 dark:text-orange-400';
      default: return 'text-slate-300';
    }
  };
  
  const getResultBadgeColor = () => {
    if (!compilationResult) return 'bg-slate-200 text-slate-700';
    switch (compilationResult.result) {
      case 'Success': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'Compilation Error': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'Runtime Error': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default: return 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
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
            className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-h-[80vh] overflow-hidden border border-slate-200 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
            layout
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Console Output</h2>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getResultBadgeColor()}`}>
                  {compilationResult.result}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors"
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
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors"
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
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg mb-4 border border-slate-200 dark:border-slate-700">
                          <pre className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words">
                            {compilationResult.message}
                          </pre>
                        </div>
                      )}

                      {showCorrectCode && compilationResult.corrected_code && (
                        <div className="mt-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <strong className="text-blue-600 dark:text-blue-400">Suggested Correction</strong>
                          </div>
                          <pre className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg text-slate-700 dark:text-slate-300 overflow-x-auto border border-slate-200 dark:border-slate-700 relative group">
                            {compilationResult.corrected_code}
                            <button 
                              className="absolute top-2 right-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => navigator.clipboard.writeText(compilationResult.corrected_code)}
                            >
                              Copy
                            </button>
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-slate-400 dark:text-slate-500 text-center p-8">
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