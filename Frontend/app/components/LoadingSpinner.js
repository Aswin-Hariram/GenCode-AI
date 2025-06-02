import { useEffect } from 'react';

export default function LoadingSpinner({ theme = 'light' }) {
  useEffect(() => {
    localStorage.removeItem("editor-lang");
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'} transition-colors duration-300`}>
      <div className="relative">
        <div className={`animate-spin rounded-full h-16 w-16 border-4 border-opacity-20 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}></div>
        <div className={`animate-spin rounded-full h-16 w-16 border-t-4 border-l-4 absolute top-0 ${theme === 'dark' ? 'border-blue-400' : 'border-blue-600'}`}></div>
      </div>
      <p className={`mt-4 text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Loading problem data...</p>
    </div>
  );
}
