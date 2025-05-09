"use client";
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiCheck, FiClock, FiAward, FiTrendingUp } from 'react-icons/fi';

export default function ProblemDescription({ problemDescription }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full overflow-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-800"
    >
      <div className="p-6">
        <div className="prose prose-invert prose-headings:text-indigo-400 prose-a:text-indigo-400 max-w-none">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={atomDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {problemDescription}
          </ReactMarkdown>
        </div>
        
        {/* Enhanced Stats Section */}
        <div className="mt-8 pt-4 border-t border-indigo-900/30">
          <h3 className="text-lg font-medium mb-3 text-indigo-400">Problem Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl shadow-lg border border-indigo-900/20"
            >
              <div className="flex items-center text-indigo-400 mb-1">
                <FiCheck className="mr-2" />
                Acceptance Rate
              </div>
              <div className="text-xl font-semibold">72.4%</div>
              <div className="text-sm text-gray-400 mt-1">Global Average: 65.2%</div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl shadow-lg border border-indigo-900/20"
            >
              <div className="flex items-center text-indigo-400 mb-1">
                <FiClock className="mr-2" />
                Total Submissions
              </div>
              <div className="text-xl font-semibold">1.2M</div>
              <div className="text-sm text-gray-400 mt-1">Last 24h: 2.5K</div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl shadow-lg border border-indigo-900/20"
            >
              <div className="flex items-center text-indigo-400 mb-1">
                <FiAward className="mr-2" />
                Difficulty
              </div>
              <div className="text-xl font-semibold text-yellow-500">Medium</div>
              <div className="text-sm text-gray-400 mt-1">Points: 300</div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl shadow-lg border border-indigo-900/20"
            >
              <div className="flex items-center text-indigo-400 mb-1">
                <FiTrendingUp className="mr-2" />
                Success Rate
              </div>
              <div className="text-xl font-semibold text-green-500">85%</div>
              <div className="text-sm text-gray-400 mt-1">Your Success: 92%</div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}