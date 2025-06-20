import React from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ time }) => (
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
);

ProgressBar.propTypes = {
  time: PropTypes.number.isRequired
};

export default ProgressBar;
