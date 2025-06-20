import { FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';

const SidebarTopicCard = ({
  topic,
  index,
  view,
  currentTheme,
  formatTopicName,
  handlePractice
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 16 }}
    transition={{ duration: 0.18 }}
    className={`rounded-xl shadow-md border p-4 mb-4 cursor-pointer bg-white dark:bg-gray-900/80 hover:shadow-lg transition-shadow duration-200 relative group`}
  >
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1">
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold border mr-2 ${
          topic.difficulty?.toLowerCase() === 'hard' ? 'bg-red-100 text-red-800' :
          topic.difficulty?.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {topic.difficulty || 'Easy'}
        </span>
      </div>
      <h3 className={`text-base font-semibold line-clamp-2 mb-1.5 ${
        currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        {formatTopicName(topic.name)}
      </h3>
      {view === 'recent' && topic.last_used && (
        <p className={`text-xs flex items-center ${
          currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <FiClock className="mr-1 w-3 h-3 flex-shrink-0" />
          {topic.last_used}
        </p>
      )}
    </div>
    <span className={`inline-flex items-center justify-center w-7 h-7 rounded text-xs font-medium ${
      currentTheme === 'dark' 
        ? 'bg-gray-700 text-gray-300' 
        : 'bg-gray-100 text-gray-600'
    }`}>
      {index + 1}
    </span>
    <div className={`mt-3 pt-3 border-t ${currentTheme === 'dark' ? 'dark:border-gray-100' : 'dark:border-gray-100'}`}>
      <button
        className={`w-full flex items-center justify-center px-3 py-2 rounded-md text-xs font-medium transition-colors ${
          currentTheme === 'dark'
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800'
        }`}
        onClick={e => {
          e.preventDefault();
          handlePractice(topic.name);
        }}
      >
        {view === 'recent' ? 'Practice' : 'Try Now'}
        <svg className="ml-1 -mr-0.5 h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H3a1 1 0 110-2h9.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  </motion.div>
);

export default SidebarTopicCard;
