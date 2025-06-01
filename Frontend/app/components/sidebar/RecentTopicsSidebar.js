"use client";

import { useEffect, useState } from 'react';
import { FiClock, FiRotateCw, FiX, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useSidebar } from '../../context/SidebarContext';



const RecentTopicsSidebar = () => {
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const [recentTopics, setRecentTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('light');

  useEffect(() => {
    setCurrentTheme(localStorage.getItem('theme') || 'light');
    const fetchRecentTopics = async () => {
      console.log("Local storage theme",localStorage.getItem('theme'));
      // Use a small timeout to show loading state in UI
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        // Try to fetch from API first
        const response = await fetch('http://127.0.0.1:8000/api/recent-topics', {
          // Add cache control to prevent caching
          cache: 'no-store',
          // Add timeout to fail fast if server is not responding
          signal: AbortSignal.timeout(3000)
        });
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setRecentTopics(result.data);
          setError(null);
        } else {
          throw new Error('Invalid response format from server');
        }
      } catch (error) {
        console.error('Failed to fetch recent topics:', error.message);
        setError('Failed to load recent topics. Please try again later.');
        setRecentTopics([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isSidebarOpen) {
      fetchRecentTopics();
    } else {
      // Reset states when closing sidebar
      setIsLoading(true);
      setError(null);
    }
  }, [isSidebarOpen]);

  const formatTopicName = (name) => {
    return name
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handlePracticeAgain = async (topicName) => {
    try {
      // Close the sidebar
      closeSidebar();
      
      // Show loading state in the main content
      const loadingEvent = new CustomEvent('showLoading', { detail: true });
      window.dispatchEvent(loadingEvent);
      
      // Fetch new DSA question for the selected topic
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/get_dsa_question?topic=${encodeURIComponent(topicName)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch question: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Update the problem data in the main content
      const updateEvent = new CustomEvent('updateProblemData', { 
        detail: {
          title: data.title || topicName,
          description: data.markdown || '',
          solution: data.solution || '',
          testcases: data.testcases || [],
          difficulty: data.difficulty || 'Medium',
          time_complexity: data.time_complexity || 'O(n)',
          space_complexity: data.space_complexity || 'O(1)',
          initial_code: data.initial_code || ''
        }
      });
      window.dispatchEvent(updateEvent);
      
    } catch (error) {
      console.error('Error fetching new question:', error);
      // Show error to the user
      const errorEvent = new CustomEvent('showError', { 
        detail: `Failed to load new question: ${error.message}`
      });
      window.dispatchEvent(errorEvent);
    } finally {
      // Hide loading state
      const loadingEvent = new CustomEvent('showLoading', { detail: false });
      window.dispatchEvent(loadingEvent);
    }
  };

  // Apply theme when sidebar is open or theme changes
  useEffect(() => {
    if (isSidebarOpen) {
      document.documentElement.setAttribute('data-theme', currentTheme);
    }
    return () => {
      document.documentElement.removeAttribute('data-theme');
    };
  }, [isSidebarOpen, currentTheme]);

  if (!isSidebarOpen) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 z-40 backdrop-blur-sm transition-opacity duration-300 ${
          currentTheme === 'dark' ? 'bg-black/70' : 'bg-black/50'
        }`}
        onClick={closeSidebar}
        aria-hidden="true"
      />
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-0 right-0 w-full max-w-md h-full shadow-2xl z-50 overflow-y-auto flex flex-col transition-colors duration-300 ${
          currentTheme === 'dark' 
            ? 'bg-gray-900 border-l border-gray-800' 
            : 'bg-white border-l border-gray-200'
        }`}
      >
        {/* Header */}
        <div className={`p-6 border-b transition-colors duration-300 ${
          currentTheme === 'dark'
            ? 'bg-gradient-to-r from-gray-800 to-gray-900/80 border-gray-800'
            : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-gray-100'
        }`}>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <div className={`p-2.5 rounded-xl shadow-sm ${
                  currentTheme === 'dark' ? 'bg-blue-900/40' : 'bg-blue-50'
                }`}>
                  <FiClock className={`w-6 h-6 ${
                    currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-500'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className={`text-2xl font-bold tracking-tight ${
                    currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Recent Topics
                  </h2>
                  <p className={`text-sm mt-1.5 ${
                    currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Your recently practiced topics and activities
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={closeSidebar}
              className={`ml-4 p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                currentTheme === 'dark'
                  ? 'hover:bg-gray-700/50 text-gray-400 hover:text-gray-200 focus:ring-offset-gray-900'
                  : 'hover:bg-gray-200/70 text-gray-500 hover:text-gray-700 focus:ring-offset-2'
              }`}
              aria-label="Close sidebar"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          
          {error && (
            <div className={`mt-4 p-3 rounded-lg flex items-start space-x-2.5 ${
              currentTheme === 'dark'
                ? 'bg-red-900/20 border border-red-900/50 text-red-300'
                : 'bg-red-50 border border-red-100 text-red-700'
            }`}>
              <FiAlertCircle className="flex-shrink-0 mt-0.5 w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="relative">
                <FiRotateCw className={`animate-spin w-8 h-8 mb-4 ${
                  currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-500'
                }`} />
                <span className="sr-only">Loading...</span>
              </div>
              <p className={`text-sm font-medium ${
                currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Loading your topics...
              </p>
            </div>
          ) : recentTopics.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-5 shadow-inner border border-dashed ${
                currentTheme === 'dark'
                  ? 'bg-gray-800/50 border-gray-700/50'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <FiClock className={`w-9 h-9 ${
                  currentTheme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                }`} />
              </div>
              <h3 className={`text-lg font-semibold mb-1.5 ${
                currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                No recent topics
              </h3>
              <p className={`text-sm max-w-xs mx-auto ${
                currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Your recently practiced topics will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {Array.isArray(recentTopics) && recentTopics.map((topic, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.03, 
                    type: 'spring', 
                    stiffness: 300,
                    damping: 20
                  }}
                  className={`group p-5 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 ${
                    currentTheme === 'dark'
                      ? 'bg-gray-800/70 border-gray-700/50 hover:border-blue-900/50 hover:shadow-blue-900/10'
                      : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-base transition-colors duration-200 truncate ${
                        currentTheme === 'dark'
                          ? 'text-white group-hover:text-blue-400'
                          : 'text-gray-900 group-hover:text-blue-600'
                      }`}>
                        {formatTopicName(topic.name)}
                      </h3>
                      <div className="flex items-center mt-2 space-x-2.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-colors duration-200 ${
                          currentTheme === 'dark'
                            ? 'bg-blue-900/30 text-blue-300 border-blue-800/50'
                            : 'bg-blue-50 text-blue-700 border-blue-100'
                        }`}>
                          {topic.category}
                        </span>
                        <span className={`text-xs flex items-center ${
                          currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <FiClock className="mr-1.5 w-3 h-3 flex-shrink-0" />
                          {topic.last_used}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 relative">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                        currentTheme === 'dark' 
                          ? 'bg-blue-900/30 text-blue-400 group-hover:bg-blue-800/50' 
                          : 'bg-blue-50 text-blue-600 group-hover:text-blue-700 group-hover:bg-blue-100'
                      } transition-colors`}>
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      className="inline-flex items-center text-sm px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePracticeAgain(topic.name);
                      }}
                    >
                      <span>Practice Again</span>
                      <svg className="ml-1.5 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
};

export default RecentTopicsSidebar;
