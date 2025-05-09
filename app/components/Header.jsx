"use client";
import { motion } from 'framer-motion';
import { FiChevronLeft, FiSun, FiMoon, FiSettings, FiHelpCircle } from 'react-icons/fi';

export default function Header({ theme, setTheme }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-indigo-900/30 backdrop-blur-sm"
    >
      <div className="flex items-center">
        <button className="p-2 mr-3 bg-gray-800/50 hover:bg-indigo-600/50 rounded-full transition-all duration-300 shadow-lg">
          <FiChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">647. Palindromic Substrings</h1>
        <span className="ml-3 px-3 py-1 text-xs font-medium bg-gradient-to-r from-amber-500 to-amber-600 rounded-full shadow-lg">
          Medium
        </span>
      </div>
      <div className="flex items-center space-x-3">
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
                className="p-2 bg-gray-800/50 hover:bg-indigo-600/50 rounded-full transition-all duration-300 shadow-lg">
          {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
        </button>
        <button className="p-2 bg-gray-800/50 hover:bg-indigo-600/50 rounded-full transition-all duration-300 shadow-lg" title="Settings">
          <FiSettings className="w-5 h-5" />
        </button>
        <button className="p-2 bg-gray-800/50 hover:bg-indigo-600/50 rounded-full transition-all duration-300 shadow-lg" title="Help">
          <FiHelpCircle className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}