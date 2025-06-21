"use client";
import { useState, useEffect } from "react";
import DescriptionTab from './tabs/DescriptionTab';
import ResultsTab from './tabs/ResultsTab';
import SolutionTab from './tabs/SolutionTab';
import ProblemTabs from '../../components/ProblemWorkspace/ProblemTabs';

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
    <div className="h-full overflow-auto p-6 relative" style={{ fontFamily: 'Lexend, sans-serif' }}>
      {renderContent()}
    
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
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