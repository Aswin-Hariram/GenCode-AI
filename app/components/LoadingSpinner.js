export default function LoadingSpinner({ theme = 'light' }) {
  return (
    <div className={`flex items-center justify-center h-screen ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'} transition-colors duration-300`}>
      <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${theme === 'dark' ? 'border-indigo-400' : 'border-indigo-500'}`}></div>
    </div>
  );
}
