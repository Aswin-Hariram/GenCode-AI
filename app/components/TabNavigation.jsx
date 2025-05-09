"use client";
import { motion } from 'framer-motion';
import { FiBookOpen, FiCode, FiList } from 'react-icons/fi';

export default function TabNavigation({ activeTab, setActiveTab }) {
  return (
    <div className="flex items-center px-6 py-3 bg-gray-900/50 border-b border-indigo-900/30">
      {['description', 'solution', 'submissions'].map((tab) => (
        <motion.button 
          key={tab}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center px-4 py-2 mr-4 rounded-full transition-all duration-300 ${activeTab === tab 
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab === 'description' && <FiBookOpen className="mr-2" />}
          {tab === 'solution' && <FiCode className="mr-2" />}
          {tab === 'submissions' && <FiList className="mr-2" />}
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </motion.button>
      ))}
    </div>
  );
}