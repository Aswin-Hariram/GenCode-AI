import React, { useState, useEffect } from 'react';

const maintenanceTexts = [
  "Updating system components...",
  "Optimizing database performance...", 
  "Installing security patches...",
  "Rebuilding cache layers...",
  "Finalizing deployment..."
];

export default function RetroMaintenancePage() {
  const [text, setText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % maintenanceTexts.length);
    }, 3000);

    return () => {
      clearInterval(textInterval);
    };
  }, []);

  useEffect(() => {
    const currentText = maintenanceTexts[currentTextIndex];
    setText(currentText.substring(0, 1));

    let i = 1;
    const typingInterval = setInterval(() => {
      if (i < currentText.length) {
        setText(currentText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 60);

    return () => clearInterval(typingInterval);
  }, [currentTextIndex]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        .moving-grid-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-color: transparent;
          background-image:
            linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px),
            linear-gradient(180deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px);
          background-size: 32px 32px;
          animation: gridmove 2.5s linear infinite;
        }
        @keyframes gridmove {
          0% { background-position: 0 0, 0 0; }
          100% { background-position: 32px 32px, 32px 32px; }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      
      <div className="flex flex-col items-center justify-center h-screen relative bg-gray-900 text-gray-200 transition-colors duration-300 font-mono overflow-hidden">
        
        {/* Moving grid background */}
        <div className="moving-grid-bg absolute inset-0 z-0 pointer-events-none" />
        
        {/* Retro Gaming Title */}
        <h1
          className="text-center mb-12 mt-2 select-none z-10 animate-pulse"
          style={{
            fontFamily: `'Press Start 2P', 'monospace'`,
            fontSize: '3.5rem',
            letterSpacing: '0.1em',
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7)',
            backgroundSize: '300% 300%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
            filter: 'drop-shadow(0 2px 0 #000)',
            marginBottom: '3rem',
            animation: 'gradientShift 3s ease-in-out infinite',
          }}
        >
          MAINTENANCE
        </h1>

        {/* Terminal Window */}
        <div className="w-full max-w-2xl rounded-lg shadow-2xl z-10 bg-gray-800 border border-gray-700">
          
          {/* Window Header */}
          <div className="relative flex items-center p-3 rounded-t-lg bg-gray-700">
            <div className="flex">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-gray-300">
              System Console
            </div>
          </div>

          {/* Terminal Content */}
          <div className="p-8 space-y-6">
            
            {/* Main Command */}
            <div className="flex items-baseline">
              <span className="text-lg text-green-400">$&gt;</span>
              <p className="ml-3 text-lg text-gray-300">
                {text}
                <span className="ml-1 inline-block w-2 h-5 bg-green-400 animate-pulse"></span>
              </p>
            </div>

            {/* Status Lines */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-cyan-400">
                <span className="mr-2">●</span>
                <span>System Status: MAINTENANCE MODE</span>
              </div>
              <div className="flex items-center text-yellow-400">
                <span className="mr-2">●</span>
                <span>Estimated Time: 8-12 minutes</span>
              </div>
              <div className="flex items-center text-green-400">
                <span className="mr-2">●</span>
                <span>Progress: 65% Complete</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="text-sm text-gray-400">DEPLOYMENT PROGRESS</div>
              <div className="w-full bg-gray-700 border border-gray-600 h-4 rounded">
                <div className="bg-gradient-to-r from-green-400 to-cyan-400 h-full w-2/3 rounded relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                </div>
              </div>
              <div className="text-right text-green-400 text-xs">65%</div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-1 text-xs text-gray-400">
              <div className="text-green-400">✓ Database backup completed</div>
              <div className="text-green-400">✓ Code deployment successful</div>
              <div className="text-yellow-400 animate-pulse">⟳ Restarting services...</div>
              <div className="text-gray-500">○ Cache warming pending</div>
            </div>

          </div>
        </div>

        {/* Bottom Message */}
        <div 
          className="mt-6 mb-1 text-xs text-center font-semibold text-cyan-300"
          style={{ 
            fontFamily: `'Press Start 2P', 'monospace'`, 
            letterSpacing: '0.02em', 
            fontSize: '0.75rem', 
            marginTop: '3rem' 
          }}
        >
          We'll be back shortly!
        </div>

        {/* Retro Gaming Elements */}
        <div className="mt-8 flex justify-center space-x-4 text-2xl z-10">
          <div className="animate-bounce text-cyan-400">▲</div>
          <div className="animate-pulse text-green-400">♦</div>
          <div className="animate-bounce text-yellow-400" style={{animationDelay: '0.3s'}}>●</div>
          <div className="animate-pulse text-purple-400" style={{animationDelay: '0.5s'}}>■</div>
        </div>

        {/* Footer */}
        <footer className="absolute bottom-4 text-xs w-full text-center text-gray-500">
          Thank you for your patience • System will resume automatically
        </footer>

      </div>
    </>
  );
}