import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConsoleModal = ({ 
  isOpen, 
  onClose, 
  compilationResult, 
  showCorrectCode, 
  activeTestCase 
}) => {
  // Detailed logging with type checking
  console.log('ConsoleModal Props:', { 
    isOpen: isOpen === true, 
    compilationResultExists: compilationResult !== null && compilationResult !== undefined,
    compilationResultType: typeof compilationResult,
    showCorrectCode, 
    activeTestCase 
  });

  // More robust open state checking
  const shouldRenderModal = isOpen === true && 
    (compilationResult !== null && compilationResult !== undefined);

  if (!shouldRenderModal) {
    console.warn('Modal will not render. Conditions not met:', {
      isOpen,
      compilationResult
    });
    return null;
  }

  // Ensure compilationResult has expected properties
  const safeResult = compilationResult || {
    result: 'Unknown',
    message: 'No compilation result available',
    corrected_code: null
  };

  const getResultColor = () => {
    if (!compilationResult) return 'text-gray-300';
    switch (compilationResult.result) {
      case 'Success': return 'text-green-400';
      case 'Compilation Error': return 'text-red-400';
      case 'Runtime Error': return 'text-orange-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed bottom-4 right-4 z-50 w-[90%] max-w-4xl"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 50, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div 
          className="bg-slate-800 rounded-xl shadow-2xl max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="bg-slate-700 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Console Output</h2>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-auto max-h-[500px] text-sm font-mono">
            {compilationResult ? (
              <div>
                <div className={`mb-4 ${getResultColor()}`}>
                  <strong>Result:</strong> {compilationResult.result}
                </div>
                
                {compilationResult.message && (
                  <div className="bg-slate-900 p-4 rounded-lg mb-4">
                    <strong className='text-gray-300'>Message:</strong>
                    <pre className="text-gray-300 whitespace-pre-wrap break-words">
                      {compilationResult.message}
                    </pre>
                  </div>
                )}

                {showCorrectCode && compilationResult.corrected_code && (
                  <div className="mt-4">
                    <strong className="text-blue-400">Suggested Corrected Code:</strong>
                    <pre className="bg-slate-900 p-4 rounded-lg text-gray-300 overflow-x-auto">
                      {compilationResult.corrected_code}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-400 text-center">
                No compilation results available
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConsoleModal;
