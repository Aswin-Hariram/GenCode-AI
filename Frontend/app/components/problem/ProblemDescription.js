"use client";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import DescriptionTab from './tabs/DescriptionTab';
import ResultsTab from './tabs/ResultsTab';
import SolutionTab from './tabs/SolutionTab';

const ProblemDescription = ({ problemData, activeTab, response, status, theme, isLoading }) => {
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  useEffect(() => {
    // Add event listener for text selection
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection.toString()) {
        setSelectedText(selection.toString());
      }
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('keyup', handleSelection);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('keyup', handleSelection);
    };
  }, []);

  const copyToClipboard = (text) => {
    const textToCopy = text || selectedText;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    }
  };

  const renderDifficulty = (difficulty) => {
    const difficultyMap = {
      "Easy": "bg-green-200 text-green-900 border-green-300",
      "Medium": "bg-yellow-200 text-yellow-900 border-yellow-300",
      "Hard": "bg-red-200 text-red-900 border-red-300"
    };
    
    return (
      <span className={`text-sm px-3 py-1 rounded-full font-medium ${difficultyMap[difficulty] || "bg-blue-200 text-blue-900 border-blue-300"}`}>
        {difficulty || "Unknown"}
      </span>
    );
  };

  // Add error state derived from response
  const isError = response?.includes('Error') || response?.includes('error');

  const renderContent = () => {
    switch (activeTab) {
      case "description":
        return <DescriptionTab problemData={problemData} theme={theme} />;
      case "results":
        return <ResultsTab response={response} status={status} theme={theme} isLoading={isLoading} />;
      case "solution":
        return <SolutionTab problemData={problemData} theme={theme}/>;
      default:
        return null;
    }
  };

  // Floating copy button that appears when text is selected
  const renderFloatingCopyButton = () => {
    if (!selectedText) return null;
    
    return (
      <div className="fixed z-50 bg-slate-100 rounded-md shadow-lg border border-gray-300 flex items-center">
        {/* Placeholder for future floating copy button implementation */}
      </div>
    );
  };

  return (
    <div className="h-full overflow-auto p-6 relative" style={{ fontFamily: 'Urbanist, sans-serif' }}>
      {renderContent()}
      
      {selectedText && renderFloatingCopyButton()}
      
      {/* Notification for successful copy */}
      <div className={`fixed bottom-4 right-4 bg-black bg-opacity-80 text-white px-4 py-2 rounded-md flex items-center gap-2 ${copied ? 'animate-fadeIn opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Check size={16} />
        <span>Copied to clipboard!</span>
      </div>
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        /* Ensure text is selectable */
        .prose, .prose *, pre, code, p, div, span, h1, h2, h3, h4, h5, h6 {
          user-select: text !important;
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
        }
        
        /* Style the selection */
        ::selection {
          background-color: rgba(79, 70, 229, 0.2);
          color: inherit;
        }
      `}</style>
    </div>
  );
};

export default ProblemDescription;