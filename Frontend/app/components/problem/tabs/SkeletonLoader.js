import React from 'react';

const SkeletonLoader = ({ theme = 'light' }) => {
  const baseClasses = 'animate-pulse rounded';
  const themeClasses = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300';

  return (
    <div className="space-y-3 p-4">
      <div className={`${baseClasses} ${themeClasses} h-4 w-1/3`}></div>
      <div className={`${baseClasses} ${themeClasses} h-4 w-3/4`}></div>
      <div className={`${baseClasses} ${themeClasses} h-4 w-1/2`}></div>
      <div className={`${baseClasses} ${themeClasses} h-4 w-5/6`}></div>
      <div className={`${baseClasses} ${themeClasses} h-4 w-full`}></div>
      <div className={`${baseClasses} ${themeClasses} h-4 w-2/3`}></div>
    </div>
  );
};

export default SkeletonLoader;
