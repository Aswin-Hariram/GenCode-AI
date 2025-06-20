"use client";
import { useState, useEffect } from "react";
import FloatingCopyButton from "../../elements/Copy/FloatingCopyButton";
import DifficultyBadge from "../../elements/Problem/DifficultyBadge";
import CopyNotification from "../../components/ProblemWorkspace/CopyNotification";
import DescriptionTab from './tabs/DescriptionTab';
import ResultsTab from './tabs/ResultsTab';
import SolutionTab from './tabs/SolutionTab';

const ProblemWorkspace = ({ problemData, activeTab, response, status, theme, isLoading }) => {
  const [copied, setCopied] = useState(false);
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



  return (
    <div className="h-full overflow-auto p-6 relative" style={{ fontFamily: 'Urbanist, sans-serif' }}>
      {renderContent()}
      <FloatingCopyButton selectedText={selectedText} onCopy={copyToClipboard} />
      <CopyNotification copied={copied} />
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

export default ProblemWorkspace;