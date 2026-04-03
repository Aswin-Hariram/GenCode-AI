import { useState, useRef, useEffect, useCallback } from 'react';
import { INITIAL_CODE } from '../utils/constants';
import { useTheme } from '../context/ThemeContext';
import { FiFileText, FiCode, FiBarChart2, FiZap } from 'react-icons/fi';
import { storageGet, storageSet } from '../utils/storage';
import {
  getCompilerUrl,
  getQuestionUrl,
  getSubmitUrl,
  QUESTION_REQUEST_TIMEOUT_MS,
  requestJson,
} from '../utils/api';

const EDITOR_LANG_KEY = 'editor-lang';
const EDITOR_CODE_KEY = 'editor-code';
const DEFAULT_LANGUAGE = 'cpp';
const DEFAULT_PROBLEM_DATA = {
  title: '',
  difficulty: '',
  description: '',
  realtopic: '',
  testcases: [],
  solution: '',
  space_complexity: '',
  time_complexity: '',
  initial_code: '',
};

function normalizeProblemData(data, fallbackTitle = '') {
  return {
    ...DEFAULT_PROBLEM_DATA,
    title: data?.title || fallbackTitle,
    description: data?.markdown || data?.description || '',
    solution: data?.solution || '',
    testcases: Array.isArray(data?.testcases) ? data.testcases : [],
    difficulty: data?.difficulty || 'Medium',
    time_complexity: data?.time_complexity || 'O(n)',
    space_complexity: data?.space_complexity || 'O(1)',
    initial_code: data?.initial_code || INITIAL_CODE,
    realtopic: data?.realtopic || fallbackTitle,
  };
}

export default function useGencodeLogic() {
  const { theme, toggleTheme } = useTheme();
  const [code, setCode] = useState(INITIAL_CODE);
  const [activeTab, setActiveTab] = useState('description');
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
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

  const [problemData, setProblemData] = useState(DEFAULT_PROBLEM_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [problemError, setProblemError] = useState(null);

  const resetProblemWorkspace = useCallback(() => {
    setActiveTab('description');
    setResponse(null);
    setStatusData(null);
    setCompilationResult(null);
    setIsConsoleOpen(false);
    setActiveTestCase(0);
    setError(null);
    setProblemError(null);
  }, []);

  const applyProblemData = useCallback((data, fallbackTitle = '') => {
    const nextProblemData = normalizeProblemData(data, fallbackTitle);
    setProblemData(nextProblemData);
    setCode(nextProblemData.initial_code);
    storageSet(EDITOR_CODE_KEY, nextProblemData.initial_code);
    return nextProblemData;
  }, []);

  const generateNewProblem = useCallback(async () => {
    resetProblemWorkspace();
    setIsLoading(true);
    setLanguage(DEFAULT_LANGUAGE);
    storageSet(EDITOR_LANG_KEY, DEFAULT_LANGUAGE);

    try {
      const data = await requestJson(getQuestionUrl(), {
        method: 'GET',
        timeoutMs: QUESTION_REQUEST_TIMEOUT_MS,
      });

      applyProblemData(data);
    } catch (err) {
      setProblemError(err.message || 'An unexpected error occurred');
      setCode(INITIAL_CODE);
      storageSet(EDITOR_CODE_KEY, INITIAL_CODE);
    } finally {
      setIsLoading(false);
    }
  }, [applyProblemData, resetProblemWorkspace]);

  const fetchQuestionForTopic = useCallback(async (topic) => {
    resetProblemWorkspace();
    setIsLoading(true);
    setLanguage(DEFAULT_LANGUAGE);
    storageSet(EDITOR_LANG_KEY, DEFAULT_LANGUAGE);

    try {
      const data = await requestJson(getQuestionUrl(topic), {
        method: 'GET',
        timeoutMs: QUESTION_REQUEST_TIMEOUT_MS,
      });

      applyProblemData(data, topic);
    } catch (err) {
      setProblemError(err.message || 'Failed to load question');
      setCode(INITIAL_CODE);
      storageSet(EDITOR_CODE_KEY, INITIAL_CODE);
    } finally {
      setIsLoading(false);
    }
  }, [applyProblemData, resetProblemWorkspace]);

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
      const message = typeof detail === 'string' ? detail : detail?.message;
      setProblemError(message || 'Failed to load question');
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
      const result = await requestJson(getSubmitUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...submissionData,
          code,
          language: language.toLowerCase(),
          problem_id: problemData?.id || 'unknown',
        }),
      });

      const newSubmission = {
        id: `sub_${Date.now()}`,
        status: result.status || (result.markdown_report?.includes('Accepted') ? 'Accepted' : 'Failed'),
        language,
        runtime: result.runtime || 'N/A',
        memory: result.memory_used || 'N/A',
        timestamp: new Date().toISOString(),
        code,
        problem_id: problemData?.id || 'unknown',
        problem_title: problemData?.title || 'Unknown Problem',
      };

      try {
        const allSubmissions = JSON.parse(storageGet('submissions', '{}')) || {};
        const problemId = problemData?.id || 'unknown';
        if (!allSubmissions[problemId]) {
          allSubmissions[problemId] = [];
        }
        allSubmissions[problemId].unshift(newSubmission);
        storageSet('submissions', JSON.stringify(allSubmissions));
      } catch {
        // Ignore localStorage issues while keeping submit flow usable.
      }

      if (result.error) {
        throw new Error(result.error);
      }

      setResponse(result.markdown_report);
      setStatusData(result.status);
      setActiveTab('results');
    } catch (err) {
      const message = err.message || 'Failed to submit solution. Please try again.';
      setError(message);
      setResponse(`### Error Submitting Solution\n\n${message}`);
      setActiveTab('results');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const showCorrectCode = true;

  const runCode = async () => {
    setIsRunning(true);
    setError(null);

    try {
      if (!code?.trim()) {
        setIsConsoleOpen(true);
        setCompilationResult({
          result: 'Failure',
          message: 'No code provided',
        });
        return;
      }

      const data = await requestJson(getCompilerUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lang: language.toLowerCase(),
          code,
          problem_id: problemData.id,
          time_complexity: problemData.time_complexity,
          space_complexity: problemData.space_complexity,
        }),
      });

      setCompilationResult(data);
      setIsConsoleOpen(true);
    } catch (err) {
      setCompilationResult({
        result: 'Compilation Error',
        message: err.message || 'Unknown compilation error',
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
