"use client";
import { useState, useEffect } from 'react';
import Split from 'react-split';

// Import components
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import ProblemDescription from './components/ProblemDescription';
import CodeEditor from './components/CodeEditor';

// Import constants
import { PROBLEM_DESCRIPTION, INITIAL_CODE } from './constants/problemData';

export default function ProblemViewer() {
  const [code, setCode] = useState(INITIAL_CODE);
  const [activeTab, setActiveTab] = useState('description');
  const [theme, setTheme] = useState('dark');
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [problemData, setProblemData] = useState({
    description: PROBLEM_DESCRIPTION,
    initialCode: INITIAL_CODE
  });

  useEffect(() => {
    fetch('http://127.0.0.1:5000/get_dsa_question')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setProblemData({
          description: data.markdown,
          initialCode: data.initialCode || INITIAL_CODE
        });
        setCode(data.initialCode || INITIAL_CODE);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Toggle console
  const toggleConsole = () => setIsConsoleOpen(!isConsoleOpen);

  // Render active tab content
  // Update renderTabContent to use problemData.description
  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return <ProblemDescription problemDescription={problemData.description} />;
      case 'solution':
        return (
          <ProblemDescription problemDescription={PROBLEM_DESCRIPTION} />
        );
      case 'submissions':
        return (
          <ProblemDescription problemDescription={PROBLEM_DESCRIPTION} />
        );
      default:
        return <ProblemDescription problemDescription={PROBLEM_DESCRIPTION} />;
    }
  };

  return (
    <div className="max-h-screen overflow-hidden flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Top Navigation Bar */}
      <Header theme={theme} setTheme={setTheme} />
      
      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <Split 
        className="flex flex-1"
        sizes={[40, 60]}
        minSize={200}
        gutterSize={8}
        gutterStyle={() => ({
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          cursor: 'col-resize'
        })}
      >
        {/* Left Panel - Dynamic Tab Content */}
        {renderTabContent()}
        
        {/* Right Panel - Code Editor */}
        <CodeEditor 
          code={code} 
          setCode={setCode} 
          isConsoleOpen={isConsoleOpen} 
          toggleConsole={toggleConsole} 
        />
      </Split>
    </div>
  );
}
