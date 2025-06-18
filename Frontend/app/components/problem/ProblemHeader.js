"use client";
import PropTypes from 'prop-types';
import { FiShare, FiClock, FiRefreshCw, FiPause, FiPlay } from 'react-icons/fi';
import { useSidebar } from '../../context/SidebarContext';
import { useState, useEffect } from 'react';
import { generatePDF as generatePDFUtil } from '../../utils/pdfUtils';

const ProblemHeader = ({ problemData, theme, editorCode, solutionCode, resultsData, generateNewProblem, isLoading, onSubmitCode, setActiveTab }) => {
  const { toggleSidebar } = useSidebar();
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  const handleRegenerate = async () => {
    if (isRegenerating) return;
    
    try {
      setIsRegenerating(true);
      // Dispatch event to regenerate the same question
      const event = new CustomEvent('regenerateQuestion', { 
        detail: { topic: problemData?.realtopic } 
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error regenerating question:', error);
    } finally {
      setIsRegenerating(false);
    }
  };
  const getDifficultyClasses = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return theme === 'dark'
          ? "bg-green-900/30 text-green-400 border border-green-700"
          : "bg-green-100 text-green-700 border border-green-300";
      case "Medium":
        return theme === 'dark'
          ? "bg-yellow-900/30 text-yellow-400 border border-yellow-700"
          : "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "Hard":
        return theme === 'dark' 
          ? "bg-red-900/30 text-red-400 border border-red-700"
          : "bg-red-100 text-red-700 border border-red-300";
      default:
        return theme === 'dark'
          ? "bg-gray-800 text-gray-300 border border-gray-700"
          : "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  // Fallback for missing data
  const title = problemData?.title || 'Untitled Problem';
  const difficulty = problemData?.difficulty || 'Unknown';
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timer;
    if (!isPaused) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPaused]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const getTimerColorClasses = () => {
    const minutes = time / 60;
    if (minutes >= 45) { // Red
      return theme === 'dark'
        ? 'bg-red-900/30 text-red-400'
        : 'bg-red-100 text-red-700';
    }
    if (minutes >= 30) { // Yellow
      return theme === 'dark'
        ? 'bg-yellow-900/30 text-yellow-400'
        : 'bg-yellow-100 text-yellow-700';
    }
    // Green
    return theme === 'dark'
      ? 'bg-green-900/30 text-green-400'
      : 'bg-green-100 text-green-700';
  };

  // Function to generate PDF
  const generatePDF = async () => {
    if (isGeneratingPDF) return;
    setIsGeneratingPDF(true);
    try {
      await generatePDFUtil(
        problemData?.title,
        problemData?.difficulty,
        problemData,
        editorCode,
        solutionCode,
        resultsData
      );
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className={`flex items-center justify-between py-2 pt-3 px-6 ${
      theme === 'dark' 
        ? 'bg-gray-800 text-gray-200 border-b border-gray-700' 
        : 'bg-gray-100 text-gray-800 border-b border-gray-200'
    } transition-colors duration-300`} style={{ fontFamily: 'Urbanist, sans-serif' }}>
      {/* Left Section */}
      <div className="flex-1 flex items-center space-x-4">
        <h1 className={`font-bold text-xl ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} tracking-tight`}>
          {title}
        </h1>
        <span 
          className={`text-xs font-semibold px-3 py-1 rounded-full ${getDifficultyClasses(difficulty)}`}
          title={`${difficulty} difficulty problem`}
        >
          {difficulty}
        </span>
      </div>

      {/* Center Section (Timer) */}
      <div className="flex-none flex flex-col items-center justify-center min-w-[180px]">
        <div
          className={`flex items-center space-x-2 text-base font-mono px-4 py-1 rounded-xl shadow-md ${theme === 'dark' ? 'dark:shadow-lg dark:backdrop-blur-md dark:bg-gray-900/50 dark:border-gray-700' : 'bg-white border-blue-100'} border transition-colors duration-500 ${getTimerColorClasses()}`}
          tabIndex={0}
          aria-label={`Timer: ${formatTime(time)}`}
          title={`Timer: ${formatTime(time)}`}
        >
          <FiClock className={`w-4 h-4 transition-colors duration-300 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-500'}`} />
          <span className="tracking-widest select-none text-md font-semibold">
            {formatTime(time)}
          </span>
          <button
            onClick={togglePause}
            className={`p-1 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-600/80' : 'text-gray-500 hover:bg-gray-300/80'}`}
            title={isPaused ? 'Resume' : 'Pause'}
            aria-label={isPaused ? 'Resume timer' : 'Pause timer'}
          >
            {isPaused ? <FiPlay className="w-4 h-4" /> : <FiPause className="w-4 h-4" />}
          </button>
        </div>
        {/* Progress Bar below the timer */}
        <div className="w-full mt-1 flex items-center justify-center">
          <div className="relative w-36 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 transition-all duration-500"
              style={{ width: `${Math.min((time / 3600) * 100, 100)}%` }}
              aria-valuenow={time}
              aria-valuemin={0}
              aria-valuemax={3600}
              role="progressbar"
            ></div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-end space-x-3">
        <button
          onClick={generateNewProblem}
          disabled={isLoading}
          className={`group relative inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out overflow-hidden ${
            theme === 'dark'
              ? 'bg-gray-700/80 hover:bg-gray-600/90 text-gray-100 hover:text-white shadow-lg hover:shadow-gray-900/30'
              : 'bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 shadow-md hover:shadow-lg hover:shadow-gray-200/50 border border-gray-200 hover:border-gray-300'
          } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
          title="Generate new problem"
        >
          <span className="relative z-10 flex items-center">
            <FiRefreshCw className={`mr-2 w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
              theme === 'dark' ? 'text-green-300' : 'text-green-500'
            } ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Generating...' : 'New Problem'}</span>
          </span>
          <span className={`absolute inset-0 w-0 transition-all duration-300 ease-out group-hover:w-full ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-green-600/20 to-green-400/20' 
              : 'bg-gradient-to-r from-green-50 to-green-100/50'
          }`}></span>
        </button>
        <button
          onClick={toggleSidebar}
          className={`group relative inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out overflow-hidden ${
            theme === 'dark'
              ? 'bg-gray-700/80 hover:bg-gray-600/90 text-gray-100 hover:text-white shadow-lg hover:shadow-gray-900/30'
              : 'bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 shadow-md hover:shadow-lg hover:shadow-gray-200/50 border border-gray-200 hover:border-gray-300'
          }`}
          title="View recent topics"
        >
          <span className="relative z-10 flex items-center">
            <FiClock className={`mr-2 w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-500'
            }`} />
            <span>Recent</span>
          </span>
            {/* Animated background effect on hover */}
          <span className={`absolute inset-0 w-0 transition-all duration-300 ease-out group-hover:w-full ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-blue-600/20 to-blue-400/20' 
              : 'bg-gradient-to-r from-blue-50 to-blue-100/50'
          }`}></span>
        </button>
        
        {/* Regenerate Button */}
      
        <button 
          onClick={generatePDF}
          className={`${ 
            theme === 'dark' 
              ? 'text-blue-400 hover:bg-blue-900/30 hover:text-blue-300' 
              : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
          } p-2 rounded-full transition-all duration-300 ease-in-out`}
          title="Generate PDF"
        >
          <FiShare className="w-5 h-5" />
        </button>
      
      </div>
    </div>
  );
};

ProblemHeader.propTypes = {
  problemData: PropTypes.shape({
    title: PropTypes.string,
    difficulty: PropTypes.oneOf(['Easy', 'Medium', 'Hard', '']),
    description: PropTypes.string,
    examples: PropTypes.array,
    solution: PropTypes.string,
    realtopic: PropTypes.string
  }),
  theme: PropTypes.oneOf(['light', 'dark']),
  editorCode: PropTypes.string,
  solutionCode: PropTypes.string,
  resultsData: PropTypes.string,
  generateNewProblem: PropTypes.func,
  isLoading: PropTypes.bool,
  onSubmitCode: PropTypes.func,
  setActiveTab: PropTypes.func
};

ProblemHeader.defaultProps = {
  problemData: { title: 'Untitled Problem', difficulty: 'Unknown', realtopic: '' },
  theme: 'light',
  editorCode: '',
  solutionCode: '',
  resultsData: '',
  generateNewProblem: () => {},
  isLoading: false,
  onSubmitCode: null,
  setActiveTab: null
};

export default ProblemHeader;