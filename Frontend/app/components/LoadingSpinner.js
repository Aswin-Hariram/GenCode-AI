import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const loadingTexts = [
  "Initializing AI Model...",
  "Selecting Topic...",
  "Generating Problem...",
  "Setting up Initial Code...",
  "Finalizing Environment..."
];



export default function LoadingSpinner() {
  const { theme } = useTheme();
  const [text, setText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    localStorage.removeItem("editor-lang");
  }, []);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
    }, 2500); // Change text every 2.5 seconds

    return () => {
      clearInterval(textInterval);
    };
  }, []);

  useEffect(() => {
    const currentText = loadingTexts[currentTextIndex];
    // Immediately set the first character to avoid a blank state
    setText(currentText.substring(0, 1));

    let i = 1; // Start typing from the second character
    const typingInterval = setInterval(() => {
      if (i < currentText.length) {
        // Build the string from scratch to ensure correctness
        setText(currentText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50); // Typing speed

    return () => clearInterval(typingInterval);
  }, [currentTextIndex]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Global font import for arcade style */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
      `}</style>
      <div className={`flex flex-col items-center justify-center h-screen relative ${theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'} transition-colors duration-300 font-mono`}>
        {/* Moving grid background */}
        <div className="moving-grid-bg absolute inset-0 z-0 pointer-events-none" />
        {/* Retro Gaming Title */}
        <h1
          className="text-center mb-12 mt-2 select-none z-10"
          style={{
            fontFamily: `'Press Start 2P', 'monospace'`,
            fontSize: '3rem',
            letterSpacing: '0.06em',
            color: theme === 'dark' ? '#00FF00' : '#009B2D',
            textShadow: theme === 'dark'
              ? '0 3px 16px #00ff0080, 0 2px 2px #000b'
              : '0 3px 16px #009b2d80, 0 2px 2px #fff8',
            filter: 'drop-shadow(0 2px 0 #2226)',
            marginBottom: '3rem',
          }}
        >
          Gencode-AI
        </h1>
        <div className={`w-full max-w-md rounded-lg shadow-2xl z-10 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border'}`}>
          <div className={`relative flex items-center p-3 rounded-t-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div className="flex">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className={`absolute left-1/2 -translate-x-1/2 text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Gencode-AI
              </div>
            </div>
            <div className="p-8 h-30 flex items-center">
              <div className="flex items-baseline">
                <span className={`text-lg ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>$&gt;</span>
                <p className={`ml-3 text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {text}
                  <span className={`ml-1 inline-block w-2 h-5 ${theme === 'dark' ? 'bg-green-400' : 'bg-green-600'} animate-pulse`}></span>
                </p>
              </div>
            </div>
          </div>
          <div className={`mt-4 mb-1 text-xs text-center font-semibold ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}
            style={{ fontFamily: `'Press Start 2P', 'monospace'`, letterSpacing: '0.02em', fontSize: '0.75rem', marginTop: '3rem' }}>
            Practice makes progress.
          </div>
          <footer className={`absolute bottom-4 text-xs w-full text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            Designed and Developed By Aswin Hariram
          </footer>
        </div>
        <style jsx>{`
          .moving-grid-bg {
            position: absolute;
            inset: 0;
            pointer-events: none;
            background-color: transparent;
            background-image:
              linear-gradient(90deg, rgba(100,116,139,0.06) 1px, transparent 1px),
              linear-gradient(180deg, rgba(100,116,139,0.06) 1px, transparent 1px);
            background-size: 32px 32px;
            animation: gridmove 2.5s linear infinite;
          }
          @keyframes gridmove {
            0% { background-position: 0 0, 0 0; }
            100% { background-position: 32px 32px, 32px 32px; }
          }
        `}</style>
    </>
  );
}
