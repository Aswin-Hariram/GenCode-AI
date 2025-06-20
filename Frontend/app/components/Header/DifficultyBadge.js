import React from 'react';
import PropTypes from 'prop-types';
import Badge from '../../elements/Header/Badge';

const DifficultyBadge = ({ difficulty, theme }) => {
  const getDifficultyClasses = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return theme === 'dark'
          ? "bg-green-900/30 text-green-400 border border-green-700"
          : "bg-green-100 text-green-700 border border-green-300";
      case "Medium":
        return theme === 'dark'
          ? "bg-yellow-900/30 text-yellow-400 border border-yellow-700"
          : "bg-yellow-100 text-yellow-700 border-yellow-300";
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
  return (
    <Badge className={`text-xs font-semibold px-3 py-1 rounded-full ${getDifficultyClasses(difficulty)}`}
      title={`${difficulty} difficulty problem`}>
      {difficulty}
    </Badge>
  );
};

DifficultyBadge.propTypes = {
  difficulty: PropTypes.string,
  theme: PropTypes.oneOf(['light', 'dark'])
};

export default DifficultyBadge;
