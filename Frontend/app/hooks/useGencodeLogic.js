import { useState, useRef, useEffect, useCallback } from 'react';
import { INITIAL_CODE } from '../utils/constants';
import { useTheme } from '../context/ThemeContext';
import { FiFileText, FiCode, FiBarChart2, FiZap } from 'react-icons/fi';

const EDITOR_LANG_KEY = 'editor-lang';
const DEFAULT_LANGUAGE = 'cpp';

export default function useGencodeLogic() {
  const { theme, toggleTheme } = useTheme();
  const [code, setCode] = useState(INITIAL_CODE);
  const [activeTab, setActiveTab] = useState('description');
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

  const [problemData, setProblemData] = useState({
    title: '',
    difficulty: '',
    description: '',
    realtopic: '',
    testcases: [],
    solution: '',
    space_complexity: '',
    time_complexity: '',
    initial_code: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [problemError, setProblemError] = useState(null);

  
  const generateNewProblem = useCallback(async () => {
    setActiveTab('description');
    setResponse(null);
    setStatusData(null);
    setCompilationResult(null);
    setIsConsoleOpen(false);
    setIsLoading(true);
    setProblemError(null);
    setLanguage('cpp');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_GET_QUESTION_ENDPOINT}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProblemData({
        title: data.title,
        description: data.markdown,
        solution: data.solution,
        testcases: data.testcases,
        difficulty: data.difficulty,
        time_complexity: data.time_complexity,
        space_complexity: data.space_complexity,
        initial_code: data.initial_code,
        realtopic: data.realtopic,
      });
    } catch (err) {
      setProblemError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchQuestionForTopic = useCallback(async (topic) => {
    setResponse(null);
    setStatusData(null);
    setCompilationResult(null);
    setIsConsoleOpen(false);
    try {
      setIsLoading(true);
      setProblemError(null);
      if (!localStorage.getItem(EDITOR_LANG_KEY)) {
        localStorage.setItem(EDITOR_LANG_KEY, DEFAULT_LANGUAGE);
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/get_dsa_question?topic=${encodeURIComponent(topic)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch question: ${response.statusText}`);
      }
      const data = await response.json();
      setProblemData((prevData) => ({
        ...prevData,
        title: data.title || topic,
        description: data.markdown || '',
        solution: data.solution || '',
        testcases: data.testcases || [],
        difficulty: data.difficulty || 'Medium',
        time_complexity: data.time_complexity || 'O(n)',
        space_complexity: data.space_complexity || 'O(1)',
        initial_code: data.initial_code || '',
      }));
      if (data.initial_code) {
        localStorage.setItem('editor-lang', 'cpp');
        setCode(data.initial_code);
      }
      setActiveTab('description');
    } catch (error) {
      setProblemError(error.message || 'Failed to load question');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const effectRan = useRef(false);
  useEffect(() => {
    if (effectRan.current === false) {
      const urlParams = new URLSearchParams(window.location.search);
      const topic = urlParams.get('topic');
      if (topic) {
        fetchQuestionForTopic(topic);
      } else {
        generateNewProblem();
      }
    }
    return () => {
      effectRan.current = true;
    };
  }, [generateNewProblem, fetchQuestionForTopic]);

  useEffect(() => {
    const handleUpdateProblemData = (event) => {
      const { detail } = event;
      setProblemData((prevData) => ({ ...prevData, ...detail }));
    };
    const handleShowLoading = (event) => {
      setIsLoading(event.detail);
    };
    const handleShowError = (event) => {
      const { detail } = event;
      setProblemError(detail.message);
      setIsLoading(false);
    };
    const handleRegenerateQuestion = (event) => {
      const { topic } = event.detail;
      fetchQuestionForTopic(topic);
    };
    window.addEventListener('updateProblemData', handleUpdateProblemData);
    window.addEventListener('showLoading', handleShowLoading);
    window.addEventListener('showError', handleShowError);
    window.addEventListener('regenerateQuestion', handleRegenerateQuestion);
    return () => {
      window.removeEventListener('updateProblemData', handleUpdateProblemData);
      window.removeEventListener('showLoading', handleShowLoading);
      window.removeEventListener('showError', handleShowError);
      window.removeEventListener('regenerateQuestion', handleRegenerateQuestion);
    };
  }, [fetchQuestionForTopic]);

  const tabs = [
    { id: 'description', label: 'Description', icon: <FiFileText /> },
    { id: 'solution', label: 'Solution', icon: <FiCode /> },
    { id: 'results', label: 'Results', icon: <FiBarChart2 /> },
    { id: 'studywithai', label: 'Study with AI', icon: <FiZap /> },
  ];

  const toggleConsole = () => setIsConsoleOpen((prev) => !prev);
  const toggleFullscreen = () => setIsFullscreen((prev) => !prev);
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
          problem_id: problemData?.id || 'unknown',
        }),
      });
      if (!response.ok) {
        throw new Error(`Submission failed with status: ${response.status}`);
      }
      const result = await response.json();
      const newSubmission = {
        id: `sub_${Date.now()}`,
        status: result.status || (result.markdown_report?.includes('Accepted') ? 'Accepted' : 'Failed'),
        language: language,
        runtime: result.runtime || 'N/A',
        memory: result.memory_used || 'N/A',
        timestamp: new Date().toISOString(),
        code: code,
        problem_id: problemData?.id || 'unknown',
        problem_title: problemData?.title || 'Unknown Problem',
      };
      try {
        const allSubmissions = JSON.parse(localStorage.getItem('submissions')) || {};
        const problemId = problemData?.id || 'unknown';
        if (!allSubmissions[problemId]) {
          allSubmissions[problemId] = [];
        }
        allSubmissions[problemId].unshift(newSubmission);
        localStorage.setItem('submissions', JSON.stringify(allSubmissions));
      } catch (error) {
        // Ignore localStorage errors
      }
      if (result.error) {
        throw new Error(result.error);
      }
      setResponse(result.markdown_report);
      setStatusData(result.status);
      setActiveTab('results');
    } catch (error) {
      setError(error.message || 'Failed to submit solution. Please try again.');
      setResponse(`### Error Submitting Solution\n\n${error.message || 'An unexpected error occurred. Please try again.'}`);
      setActiveTab('results');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const showCorrectCode = true;

  const runCode = async () => {
    setIsRunning(true);
    setError(null);
    try {
      if (!code) {
        setIsConsoleOpen(true);
        setCompilationResult({
          result: 'Failure',
          message: 'No code provided',
        });
        return;
      }
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
          space_complexity: problemData.space_complexity,
        }),
      });
      if (!response.ok) {
        throw new Error(`Compilation failed with status: ${response.status}`);
      }
      const data = await response.json();
      setCompilationResult(data);
      setIsConsoleOpen(true);
    } catch (error) {
      setCompilationResult({
        result: 'Compilation Error',
        message: error.message || 'Unknown compilation error',
        corrected_code: null,
      });
      setIsConsoleOpen(true);
    } finally {
      setIsRunning(false);
    }
  };

  return {
    theme,
    toggleTheme,
    code,
    setCode,
    activeTab,
    setActiveTab,
    language,
    setLanguage,
    isConsoleOpen,
    setIsConsoleOpen,
    isFullscreen,
    setIsFullscreen,
    response,
    setResponse,
    status_data,
    setStatusData,
    error,
    setError,
    activeTestCase,
    setActiveTestCase,
    isRunning,
    setIsRunning,
    isSubmitting,
    setIsSubmitting,
    compilationResult,
    setCompilationResult,
    editorRef,
    consoleHeight,
    problemData,
    setProblemData,
    isLoading,
    setIsLoading,
    problemError,
    setProblemError,
    generateNewProblem,
    fetchQuestionForTopic,
    tabs,
    toggleConsole,
    toggleFullscreen,
    closeConsole,
    handleSubmitCode,
    handleEditorDidMount,
    handleEditorChange,
    showCorrectCode,
    runCode,
  };
}
