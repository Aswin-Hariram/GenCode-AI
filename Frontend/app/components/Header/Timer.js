import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TimerDisplay from '../../elements/Header/TimerDisplay';
import { FiClock, FiPause, FiPlay } from 'react-icons/fi';

const Timer = ({ theme }) => {
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

  const getTimerColorClasses = () => {
    const minutes = time / 60;
    if (minutes >= 45) {
      return theme === 'dark'
        ? 'bg-red-900/30 text-red-400'
        : 'bg-red-100 text-red-700';
    }
    if (minutes >= 30) {
      return theme === 'dark'
        ? 'bg-yellow-900/30 text-yellow-400'
        : 'bg-yellow-100 text-yellow-700';
    }
    return theme === 'dark'
      ? 'bg-green-900/30 text-green-400'
      : 'bg-green-100 text-green-700';
  };

  return (
    <TimerDisplay
      time={time}
      isPaused={isPaused}
      togglePause={() => setIsPaused(!isPaused)}
      formatTime={formatTime}
      getTimerColorClasses={getTimerColorClasses}
      theme={theme}
    />
  );
};

Timer.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark'])
};

export default Timer;
