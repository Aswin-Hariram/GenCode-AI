"use client";

import { useState, useRef, useEffect } from 'react';
import Split from 'react-split';
import { FiSun, FiMoon, FiX, FiFileText, FiCode, FiBarChart2 } from 'react-icons/fi';
import ProblemHeader from './components/problem/ProblemHeader';
import ProblemDescription from './components/problem/ProblemDescription';
import CodeEditor from './components/editor/CodeEditor';
import ConsoleModal from './components/ConsoleModal';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import { useProblemData } from './hooks/useProblemData';
import { INITIAL_CODE } from './utils/constants';

const GenCode = () => {
  // State management
  const [code, setCode] = useState(INITIAL_CODE);
  const [activeTab, setActiveTab] = useState('description');
  const [theme, setTheme] = useState('light');
  
  // Load theme from localStorage on client-side only
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);
  const [language, setLanguage] = useState('cpp');
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [response, setResponse] = useState(null);
  const [status_data, setStatusData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [compilationResult, setCompilationResult] = useState(null);
  const editorRef = useRef(null);
  const consoleHeight = useRef(200);

  const { problemData, isLoading, error: problemError, setProblemData } = useProblemData();
  const [isLoadingState, setIsLoadingState] = useState(isLoading);
  const [errorState, setErrorState] = useState(problemError);
  
  // Update local state when props change
  useEffect(() => {
    setIsLoadingState(isLoading);
    setErrorState(problemError);
  }, [isLoading, problemError]);
  
  // Constants
  const EDITOR_LANG_KEY = 'editor-lang';
  const DEFAULT_LANGUAGE = 'cpp';

  // Function to fetch a new question for a specific topic
  const fetchQuestionForTopic = async (topic) => {
    try {
      setIsLoadingState(true);
      setErrorState(null);
      
      // Set default language if not already set
      if (!localStorage.getItem(EDITOR_LANG_KEY)) {
        localStorage.setItem(EDITOR_LANG_KEY, DEFAULT_LANGUAGE);
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/get_dsa_question?topic=${encodeURIComponent(topic)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch question: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Update the problem data
      setProblemData(prevData => ({
        ...prevData,
        title: data.title || topic,
        description: data.markdown || '',
        solution: data.solution || '',
        testcases: data.testcases || [],
        difficulty: data.difficulty || 'Medium',
        time_complexity: data.time_complexity || 'O(n)',
        space_complexity: data.space_complexity || 'O(1)',
        initial_code: data.initial_code || ''
      }));
      // Reset the code editor with the new initial code if available
      if (data.initial_code) {
        localStorage.setItem("editor-lang", 'cpp');
        setCode(data.initial_code);
      }
      
      // Reset other states
      setActiveTab('description');
      
    } catch (error) {
      console.error('Error fetching question:', error);
      setErrorState(error.message || 'Failed to load question');
    } finally {
      setIsLoadingState(false);
    }
  };

  // Set up event listeners for custom events
  useEffect(() => {
    const handleUpdateProblemData = (event) => {
      const { detail } = event;
      setProblemData(prevData => ({
        ...prevData,
        ...detail
      }));
    };
    
    const handleShowLoading = (event) => {
      setIsLoadingState(event.detail);
    };
    
    const handleShowError = (event) => {
      setErrorState(event.detail);
      setIsLoadingState(false);
    };
    
    const handleRegenerateQuestion = async (event) => {
      const { topic } = event.detail;
      if (topic) {
        await fetchQuestionForTopic(topic);
      }
    };
    
    // Add event listeners
    window.addEventListener('updateProblemData', handleUpdateProblemData);
    window.addEventListener('showLoading', handleShowLoading);
    window.addEventListener('showError', handleShowError);
    window.addEventListener('regenerateQuestion', handleRegenerateQuestion);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('updateProblemData', handleUpdateProblemData);
      window.removeEventListener('showLoading', handleShowLoading);
      window.removeEventListener('showError', handleShowError);
      window.removeEventListener('regenerateQuestion', handleRegenerateQuestion);
    };
  }, [setProblemData]);

  const tabs = [
    { id: 'description', label: 'Description', icon: <FiFileText className="mr-2" size={18} /> },
    { id: 'solution', label: 'Solution', icon: <FiCode className="mr-2" size={18} /> },
    { id: 'results', label: 'Results', icon: <FiBarChart2 className="mr-2" size={18} /> },
  ];

  // Toggle functions
  const toggleConsole = () => setIsConsoleOpen(!isConsoleOpen);
  const toggleFullscreen = () => setIsFullscreen(prevState => !prevState);
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // Save theme preference to localStorage
    localStorage.setItem('theme', newTheme);
  };
  const closeConsole = () => setIsConsoleOpen(false);

  
  
  const handleSubmitCode = async (submissionData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_SUBMIT_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...submissionData,
          code: code,
          language: language.toLowerCase(),
          problem_id: problemData?.id || 'unknown'
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Submission failed with status: ${response.status}`);
      }
  
      const result = await response.json();
      
      // Create submission entry
      const newSubmission = {
        id: `sub_${Date.now()}`,
        status: result.status || (result.markdown_report?.includes('Accepted') ? 'Accepted' : 'Failed'),
        language: language,
        runtime: result.runtime || 'N/A',
        memory: result.memory_used || 'N/A',
        timestamp: new Date().toISOString(),
        code: code,
        problem_id: problemData?.id || 'unknown',
        problem_title: problemData?.title || 'Unknown Problem'
      };
      
      // Save submission to localStorage
      try {
        const allSubmissions = JSON.parse(localStorage.getItem('submissions')) || {};
        const problemId = problemData?.id || 'unknown';
        if (!allSubmissions[problemId]) {
          allSubmissions[problemId] = [];
        }
        allSubmissions[problemId].unshift(newSubmission);
        localStorage.setItem('submissions', JSON.stringify(allSubmissions));
      } catch (error) {
        console.error('Error saving submission:', error);
      }
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setResponse(result.markdown_report);
      setStatusData(result.status);
      setActiveTab('results');
    } catch (error) {
      console.error('Error submitting solution:', error);
      setError(error.message || 'Failed to submit solution. Please try again.');
      setResponse(`### Error Submitting Solution\n\n${error.message || 'An unexpected error occurred. Please try again.'}`);
      setActiveTab('results');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading indicator component for the Submit button
  const SubmitButtonContent = () => {
    if (isSubmitting) {
      return (
        <div className="flex items-center space-x-2">
          <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full"></div>
          <span>Submitting...</span>
        </div>
      );
    }
    return 'Submit Code';
  };

  // Editor handlers
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  // We'll use a constant value for showCorrectCode since we simplified the UI
  const showCorrectCode = true; // Always show corrected code if available

  const runCode = async () => {
    setIsRunning(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_COMPILER_ENDPOINT}`, {
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
      
      // No need to handle corrected code display here as we've simplified the UI
      
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

  // Loading indicator component for the Run button
  const RunButtonContent = () => {
    if (isRunning) {
      return (
        <div className="flex items-center space-x-2">
          <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full"></div>
          <span>Running...</span>
        </div>
      );
    }
    return 'Run Code';
  };

  if (isLoadingState) {
    return <LoadingSpinner theme={theme} />;
  }

  if (errorState) {
    return <ErrorDisplay error={errorState} />;
  }

  return (
    <div className={`flex flex-col h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} transition-colors duration-300`}>
      <ProblemHeader 
        problemData={problemData} 
        theme={theme} 
        editorCode={code} 
        solutionCode={problemData?.solution} 
        resultsData={response} 
      />
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
            status={status_data}
            theme={theme} 
          
          />
        </div>
        <div className="flex flex-col h-full">
          
          <CodeEditor
            language={language}
            code={problemData.initial_code}
            fontSize={14} // Default font size
            isFullscreen={isFullscreen}
            onCodeChange={handleEditorChange}
            onEditorMount={handleEditorDidMount}
            onRunCode={runCode}
            onToggleFullscreen={toggleFullscreen}
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

export default GenCode;