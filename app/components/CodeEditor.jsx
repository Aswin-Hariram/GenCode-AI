"use client";
import { useRef, useState } from 'react';
import Editor from "@monaco-editor/react";
import { motion } from 'framer-motion';
import { FiPlay, FiSave, FiX, FiMaximize, FiMinimize } from 'react-icons/fi';

export default function CodeEditor({ code, setCode, isConsoleOpen, toggleConsole }) {
  const editorRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`flex flex-col bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen'}`}
    >
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-indigo-900/30">
        <div className="flex items-center space-x-3">
          <select 
            className="bg-gray-800 text-white px-3 py-1.5 rounded-lg text-sm border border-indigo-900/30 focus:border-indigo-500 focus:ring focus:ring-indigo-500/20 focus:outline-none"
            onChange={(e) => editorRef.current?.updateOptions({ tabSize: parseInt(e.target.value) })}
          >
            <option value="2">2 spaces</option>
            <option value="4">4 spaces</option>
          </select>
          <button 
            className="flex items-center text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-300 border border-indigo-900/30"
            onClick={() => {
              // Add save functionality
            }}
          >
            <FiSave className="mr-1" />
            Save
          </button>
          <button
            className="flex items-center text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-300 border border-indigo-900/30"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <FiMinimize className="mr-1" /> : <FiMaximize className="mr-1" />}
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all duration-300"
          onClick={toggleConsole}
        >
          <FiPlay className="mr-2" />
          Run Code
        </motion.button>
      </div>
      
      {/* Code Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="cpp"
          value={code}
          theme="vs-dark"
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            tabSize: 2,
            wordWrap: 'on',
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            autoIndent: 'full',
            folding: true
          }}
        />
      </div>
      
      {/* Console Output */}
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: isConsoleOpen ? '10rem' : '0rem' }}
        transition={{ duration: 0.3 }}
        className="border-t border-indigo-900/30 bg-gray-800 overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-indigo-900/30">
          <span className="text-sm font-medium text-indigo-400">Console Output</span>
          <button className="text-gray-400 hover:text-white" onClick={toggleConsole}>
            <FiX className="w-4 h-4" />
          </button>
        </div>
        <div className="p-3 text-sm text-gray-300 font-mono">
          <p className="text-indigo-400">// Run your code to see output</p>
        </div>
      </motion.div>
    </motion.div>
  );
}