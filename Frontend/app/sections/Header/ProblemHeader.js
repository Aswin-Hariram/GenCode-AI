"use client";
import PropTypes from 'prop-types';
import { FiShare, FiRefreshCw, FiClock } from 'react-icons/fi';
import DifficultyBadge from '../../components/Header/DifficultyBadge';
import Timer from '../../components/Header/Timer';
import HeaderButton from '../../components/Header/HeaderButton';
import { useSidebar } from '../../context/SidebarContext';
import { useState, useEffect } from 'react';
import { generatePDF as generatePDFUtil } from '../../utils/pdfUtils';

const ProblemHeader = ({ problemData, theme, editorCode, solutionCode, resultsData, generateNewProblem, isLoading, onSubmitCode, setActiveTab }) => {
  const { toggleSidebar } = useSidebar();
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

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

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
    } transition-colors duration-300`} style={{ fontFamily: 'Lexend, sans-serif' }}>
      {/* Left Section */}
      <div className="flex-1 flex items-center space-x-4">
        <h1 className={`font-bold text-xl ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} tracking-tight`}>
          {problemData?.title} 
        </h1>
        <DifficultyBadge difficulty={problemData?.difficulty} theme={theme} />
      </div>

      {/* Center Section (Timer) */}
      <Timer theme={theme} />

      {/* Right Section */}
      {/* Right Section */}
      <div className="flex-1 flex items-center justify-end space-x-3">
        <HeaderButton
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
        </HeaderButton>
        <HeaderButton
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
        </HeaderButton>
        
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