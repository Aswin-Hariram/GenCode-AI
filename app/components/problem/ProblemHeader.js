"use client";
import PropTypes from 'prop-types';
import { FiBookmark, FiThumbsUp, FiShare } from 'react-icons/fi';
import { Tooltip } from '@nextui-org/react';

const ProblemHeader = ({ problemData, theme }) => {
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

  return (
    <div className={`flex items-center justify-between p-4 px-6 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-900 shadow-sm border-b border-gray-700' 
        : 'bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-sm border-b border-gray-200'
    } transition-colors duration-300`}>
      <div className="flex items-center space-x-4">
        <h1 className={`font-bold text-xl ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} tracking-tight`}>
          {title}
        </h1>
        <Tooltip content={`${difficulty} difficulty problem`}>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getDifficultyClasses(difficulty)}`}>
            {difficulty}
          </span>
        </Tooltip>
      </div>
      <div className="flex items-center space-x-3">
        <button className={`${
          theme === 'dark' 
            ? 'text-blue-400 hover:bg-blue-900/30 hover:text-blue-300' 
            : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
        } p-2 rounded-full transition-all duration-300 ease-in-out`}>
          <FiBookmark className="w-5 h-5" />
        </button>
        <button className={`${
          theme === 'dark' 
            ? 'text-blue-400 hover:bg-blue-900/30 hover:text-blue-300' 
            : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700' 
        } p-2 rounded-full transition-all duration-300 ease-in-out`}>
          <FiThumbsUp className="w-5 h-5" />
        </button>
        <button className={`${
          theme === 'dark' 
            ? 'text-blue-400 hover:bg-blue-900/30 hover:text-blue-300' 
            : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
        } p-2 rounded-full transition-all duration-300 ease-in-out`}>
          <FiShare className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

ProblemHeader.propTypes = {
  problemData: PropTypes.shape({
    title: PropTypes.string,
    difficulty: PropTypes.oneOf(['Easy', 'Medium', 'Hard', ''])
  }),
  theme: PropTypes.oneOf(['light', 'dark'])
};

ProblemHeader.defaultProps = {
  problemData: { title: 'Untitled Problem', difficulty: 'Unknown' },
  theme: 'light'
};

export default ProblemHeader;