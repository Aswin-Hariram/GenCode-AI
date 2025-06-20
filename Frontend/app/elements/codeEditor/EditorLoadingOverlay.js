import React from "react";

export default function EditorLoadingOverlay() {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white/80 dark:bg-gray-900/80 border border-emerald-400 dark:border-emerald-600 rounded-2xl shadow-2xl px-8 py-7 flex flex-col items-center min-w-[260px]">
        <div className="mb-3 flex items-center justify-center">
          <span className="inline-block animate-spin-slow">
            <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#shadow)">
                <polygon points="24,6 42,16 24,26 6,16" fill="#34d399"/>
                <polygon points="24,26 42,16 42,34 24,44" fill="#059669"/>
                <polygon points="24,26 6,16 6,34 24,44" fill="#10b981"/>
                <polygon points="24,6 42,16 24,26 6,16" fill="#6ee7b7" fillOpacity="0.5"/>
              </g>
              <defs>
                <filter id="shadow" x="0" y="0" width="48" height="48" filterUnits="userSpaceOnUse">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.15"/>
                </filter>
              </defs>
            </svg>
          </span>
        </div>
        <span className="text-gray-900 dark:text-gray-100 text-lg font-semibold tracking-wide mb-2">
          Converting...
        </span>
        <div className="w-full h-1.5 rounded bg-emerald-100 dark:bg-emerald-900 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-300 animate-progress-bar"></div>
        </div>
      </div>
      <style jsx>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 1.2s linear infinite;
        }
        @keyframes progress-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress-bar {
          animation: progress-bar 1.2s cubic-bezier(0.4,0,0.2,1) infinite;
          width: 50%;
        }
      `}</style>
    </div>
  );
}
