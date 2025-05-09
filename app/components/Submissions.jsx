"use client";
import { motion } from 'framer-motion';

export default function Submissions() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full overflow-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-800"
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold text-indigo-400 mb-4">Your Submissions</h2>
        <div className="space-y-4">
          {/* Add your submissions list here */}
          <p>Submissions will be displayed here.</p>
        </div>
      </div>
    </motion.div>
  );
}