"use client";
import { motion } from 'framer-motion';

export default function Solution() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full overflow-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-800"
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold text-indigo-400 mb-4">Solution Approaches</h2>
        <div className="prose prose-invert prose-headings:text-indigo-400 prose-a:text-indigo-400 max-w-none">
          {/* Add your solution content here */}
          <p>Solution content will be displayed here.</p>
        </div>
      </div>
    </motion.div>
  );
}