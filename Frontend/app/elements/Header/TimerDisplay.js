import React from 'react';
import { FiClock, FiPause, FiPlay } from 'react-icons/fi';

const TimerDisplay = ({ time, isPaused, togglePause, formatTime, getTimerColorClasses, theme }) => (
  <div className="flex flex-col items-center justify-center min-w-[180px]">
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
);

export default TimerDisplay;
