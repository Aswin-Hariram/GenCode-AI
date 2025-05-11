"use client";

import { useState, useRef, useEffect } from 'react';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import Split from 'react-split';
import { FiCode, FiClock, FiFileText, FiList, FiCheck, FiX, FiMaximize, FiMinimize, FiSun, FiMoon } from 'react-icons/fi';
import ProblemHeader from './components/problem/ProblemHeader';
import ProblemDescription from './components/problem/ProblemDescription';
import CodeEditor from './components/editor/CodeEditor';
import ConsoleModal from './components/ConsoleModal';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import { useProblemData } from './hooks/useProblemData';
import { INITIAL_CODE, TABS } from './utils/constants';

const LeetCodeClone = () => {
  // State management
  const [code, setCode] = useState(INITIAL_CODE);
  const [activeTab, setActiveTab] = useState('description');
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('cpp');
  const [fontSize, setFontSize] = useState(14);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [response, setResponse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [submittedSolution, setSubmittedSolution] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef(null);
  const consoleHeight = useRef(200);

  const { problemData, isLoading: loading, error: problemError } = useProblemData();

  const tabs = [
    { id: 'description', label: 'Description', icon: <FiFileText className="mr-2" /> },
    { id: 'solution', label: 'Solution', icon: <FiCode className="mr-2" /> },
    { id: 'results', label: 'Results', icon: <FiClock className="mr-2" /> },
  ];

  // Toggle functions
  const toggleConsole = () => setIsConsoleOpen(!isConsoleOpen);
  
  // Fixed the toggleFullscreen function to properly update state
  const toggleFullscreen = () => {
    setIsFullscreen(prevState => !prevState);
  };
  
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const closeConsole = () => setIsConsoleOpen(false);

  
  
  const handleSubmitCode = async (submissionData) => {
    setIsSubmitting(true);
    setError(null); // Reset any previous errors
    
    try {
      const response = await fetch('http://127.0.0.1:8080/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...submissionData,
          code: code, // Include current code
          language: language.toLowerCase(),
          problem_id: problemData.id
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Submission failed with status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log(result);
      // Save submission to localStorage
      const saveSubmission = () => {
        try {
          // Create a new submission entry
          const newSubmission = {
            id: Date.now().toString(),
            status: result.status,
            language: language,
            runtime: result.runtime || 'N/A',
            memory: result.memory_used || 'N/A',
            timestamp: new Date().toISOString()
          };
         
          // Get existing submissions from localStorage
          const allSubmissions = JSON.parse(localStorage.getItem('submissions')) || {};
          
          // Add the new submission to the problem's submissions array
          const problemId = problemData.id || 'unknown';
          if (!allSubmissions[problemId]) {
            allSubmissions[problemId] = [];
          }
          allSubmissions[problemId].unshift(newSubmission);
          
          // Save back to localStorage
          localStorage.setItem('submissions', JSON.stringify(allSubmissions));
          
        } catch (error) {
          console.error('Error saving submission:', error);
        }
      };
      
      // Save the submission
      saveSubmission();
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Record the submission in local storage
      const newSubmission = {
        id: `sub_${Date.now()}`,
        status: result.status || (result.markdown_report?.includes('Accepted') ? 'Accepted' : 'Failed'),
        language: language,
        runtime: result.runtime || 'N/A',
        memory: result.memory || 'N/A',
        timestamp: new Date().toISOString(),
        code: code,
        problem_id: problemData.id,
        problem_title: problemData.title
      };
      
      setResponse(result.markdown_report);
      setActiveTab('results');
    } catch (error) {
      console.error('Error submitting solution:', error);
      setError(error.message || 'Failed to submit solution. Please try again.');
      setResponse(`### Error Submitting Solution\n\n${error.message || 'An unexpected error occurred. Please try again.'}`);
      setActiveTab('results'); // Show error in results tab
      
      // Record failed submission
      const failedSubmission = {
        id: `sub_${Date.now()}`,
        status: 'Error',
        language: language,
        runtime: 'N/A',
        memory: 'N/A',
        timestamp: new Date().toISOString(),
        code: code,
        problem_id: problemData.id,
        problem_title: problemData.title,
        error: error.message
      };
      
    } finally {
      setIsSubmitting(false);
    }
  };

  // Editor handlers
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const [compilationResult, setCompilationResult] = useState(null);
  const [showCorrectCode, setShowCorrectCode] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8080/compiler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lang: language.toLowerCase(),
          code: code,
          problem_id: problemData.id,
          time_complexity: problemData.time_complexity,
          space_complexity: problemData.space_complexity
        })
      });
  
      if (!response.ok) {
        throw new Error(`Compilation failed with status: ${response.status}`);
      }
  
      const data = await response.json();
      setCompilationResult(data);
      setIsConsoleOpen(true);
      console.log('Compilation result:', data.message);
      
      // Automatically show corrected code if available
      if (data.corrected_code) {
        setShowCorrectCode(true);
      }
      
    } catch (error) {
      console.error('Error running code:', error);
      setCompilationResult({
        result: 'Compilation Error',
        message: error.message || 'Unknown compilation error',
        corrected_code: null
      });
      setIsConsoleOpen(true);
    } finally {
      setIsRunning(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (problemError) {
    return <ErrorDisplay error={problemError} />;
  }

  return (
    <div className={`flex flex-col h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} transition-colors duration-300`}>
      <ProblemHeader problemData={problemData} theme={theme} />
      <Split
        className={`flex flex-1 overflow-hidden split-horizontal ${theme === 'dark' ? ' bg-gray-800' : 'prose-slate'}`}
        sizes={[45, 55]}
        minSize={250}
        expandToMin={false}
        gutterSize={4}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize"
        gutterStyle={() => ({
          backgroundColor: theme === 'dark' ? '#374151' : '#e5e7eb',
          cursor: 'col-resize'
        })}
      >
        <div className={`flex flex-col h-full ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r transition-colors duration-300`}>
          <div className={`flex border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium flex items-center transition-all duration-200 ${
                  activeTab === tab.id 
                    ? `${theme === 'dark' ? 'text-blue-400 border-blue-400' : 'text-blue-600 border-blue-500'} border-b-2` 
                    : `${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
            <div className="ml-auto flex items-center pr-4">
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-full ${theme === 'dark' ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} transition-colors duration-200`}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>
            </div>
          </div>
          <ProblemDescription 
            problemData={problemData} 
            activeTab={activeTab} 
            response={response}
            theme={theme} 
          
          />
        </div>
        <div className="flex flex-col h-full">
          
          <CodeEditor
            language={language}
            code={problemData.initial_code}
            fontSize={fontSize}
            isFullscreen={isFullscreen}
            onCodeChange={handleEditorChange}
            onEditorMount={handleEditorDidMount}
            onRunCode={runCode}
            onToggleFullscreen={toggleFullscreen} // Fixed prop name
            setLanguage={setLanguage}
            onSubmitCode={handleSubmitCode}
            problemData={problemData}
            theme={theme}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
          />
          {isConsoleOpen && compilationResult && (
            <div className={`p-4 border-t shadow-inner transition-colors duration-300 ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700 text-gray-100' 
                : 'bg-white border-gray-200 text-gray-800'
            }`}>
              <div className="flex justify-between items-center mb-2">
                <div className={`font-semibold ${
                  compilationResult.result === 'Compilation Success' 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`}>
                  {compilationResult.result}
                </div>
                <button 
                  onClick={closeConsole}
                  className={`p-1 rounded-full ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-700 text-gray-400' 
                      : 'hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  <FiX size={18} />
                </button>
              </div>
              <pre className={`whitespace-pre-wrap ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {compilationResult.message}
              </pre>
            </div>
          )}
        </div>
      </Split>
      <ConsoleModal
        isOpen={isConsoleOpen}
        onClose={closeConsole}
        compilationResult={compilationResult}
        showCorrectCode={showCorrectCode}
        activeTestCase={activeTestCase}
        theme={theme}
      />
    
    </div>
  );
}

export default LeetCodeClone;