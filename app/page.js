"use client";

import { useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import Split from 'react-split';
import ProblemHeader from './components/problem/ProblemHeader';
import ProblemDescription from './components/problem/ProblemDescription';
import CodeEditor from './components/editor/CodeEditor';
import ConsoleModal from './components/ConsoleModal';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import { useProblemData } from './hooks/useProblemData';
import { INITIAL_CODE, TABS } from './utils/constants';

const LeetCodeClone = () => {
  // Set the app element for accessibility
  // Removed manual app element setting

  // State management
  const [code, setCode] = useState(INITIAL_CODE);
  const [activeTab, setActiveTab] = useState('description');
  const [theme, setTheme] = useState('light'); // Changed default theme to light
  const [language, setLanguage] = useState('cpp');
  const [fontSize, setFontSize] = useState(14);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [response, setResponse] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState(null);
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [submittedSolution, setSubmittedSolution] = useState(null);
  const editorRef = useRef(null);
  const consoleHeight = useRef(200);

  useEffect(() => {
    // Set app element for react-modal
    if (typeof window !== 'undefined') {
      const appElement = document.body;
      if (appElement) {
        Modal.setAppElement(appElement);
      }
    }
  }, []);

  const { problemData, isLoading: loading, error: problemError } = useProblemData();

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'solution', label: 'Solution' },
    { id: 'discussion', label: 'Discussion' },
    { id: 'submissions', label: 'Submissions' }
  ];

  // Toggle functions
  const toggleConsole = () => setIsConsoleOpen(!isConsoleOpen);
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
  const closeConsole = () => setIsConsoleOpen(false);

  const handleSubmitCode = async (submissionData) => {
    console.log('Submission Data:', submissionData);
    setSubmittedSolution(submissionData);
    
    try {
      const response = await fetch('http://127.0.0.1:8080/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setResponse(result.markdown_report);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error submitting solution:', error);
      // Optionally, set an error state or show a notification
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
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (problemError) {
    return <ErrorDisplay error={problemError} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-800">
      <ProblemHeader problemData={problemData} />
      <Split
        className="flex flex-1 overflow-hidden split-horizontal"
        sizes={[45, 55]}
        minSize={250}
        expandToMin={false}
        gutterSize={6}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize"
        gutterStyle={() => ({
          backgroundColor: '#e5e7eb',
          cursor: 'col-resize'
        })}
      >
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
          <div className="flex border-b border-gray-200">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-800'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <ProblemDescription problemData={problemData} activeTab={activeTab} />
        </div>
        <div className="flex flex-col h-full">
          <CodeEditor
            language={language}
            code={code}
            fontSize={fontSize}
            isFullscreen={isFullscreen}
            onCodeChange={handleEditorChange}
            onEditorMount={handleEditorDidMount}
            onFullscreenToggle={toggleFullscreen}
            onRunCode={runCode}
            setLanguage={setLanguage}
            onSubmitCode={handleSubmitCode}
            problemData={problemData}
          />
          {isConsoleOpen && compilationResult && (
            <div className="bg-white p-4 border-t border-gray-200 shadow-inner">
              <div className="flex justify-between items-center mb-2">
                <div className={`text-${compilationResult.result === 'Compilation Success' ? 'green' : 'red'}-600 font-semibold`}>
                  {compilationResult.result}
                </div>
              </div>
              <pre className="text-gray-700 whitespace-pre-wrap">
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
        theme={theme} // Pass the theme to ConsoleModal
      />
    <Modal
  isOpen={isModalOpen}
  onRequestClose={() => setIsModalOpen(false)}
  className="fixed inset-0 flex items-center justify-center p-4 z-50"
  overlayClassName="fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out"
  style={{
    content: {
      background: '#ffffff',
      borderRadius: '1rem',
      border: '1px solid #e5e7eb',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
      maxWidth: '40rem',
      maxHeight: '85vh',
      margin: 'auto',
      padding: '2rem',
      overflow: 'auto',
      transition: 'all 0.3s ease-in-out',
      transform: isModalOpen ? 'scale(1)' : 'scale(0.95)',
      opacity: isModalOpen ? 1 : 0
    }
  }}
  contentLabel="Solution Response"
>
  <div className="relative w-full h-full text-gray-800">
    {response && (
      <div className="prose max-w-full prose-pre:bg-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-auto">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              return !inline ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language="javascript"
                  PreTag="div"
                  className="rounded-md"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code
                  className="bg-gray-200 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }
          }}
          remarkPlugins={[remarkGfm]}
        >
          {response}
        </ReactMarkdown>
      </div>
    )}

    <div className="flex justify-center mt-8">
      <button
        onClick={() => setIsModalOpen(false)}
        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-md 
                   hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
      >
        Close
      </button>
    </div>
  </div>
</Modal>


    </div>
  );
}

export default LeetCodeClone;