import React, { useRef, useState } from "react";
import { ClipboardCopy } from "lucide-react";
import CopyButton from "../../../elements/Problem/Solution/Description/CopyButton";

const ExampleFlipCard = ({ example, idx, theme, handleCardKeyDown, copied, handleCopy }) => (
  <div
    key={idx}
    id={`flip-card-${idx}`}
    role="button"
    aria-label={`Example ${idx + 1} flip card`}
    tabIndex={0}
    className={`group perspective h-56 cursor-pointer outline-none focus:ring-2 focus:ring-blue-400`}
    onKeyDown={(e) => handleCardKeyDown(e, idx)}
  >
    <div className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d group-hover:rotate-y-180 group-focus:rotate-y-180`}>
      {/* Front */}
      <div className={`absolute w-full h-full rounded-xl shadow-lg p-5 flex flex-col justify-center gap-2 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-800/90 border border-blue-900/30' : 'bg-slate-100/90 border border-blue-300'
      } backface-hidden`}>
        <div className="font-semibold text-lg mb-2">{example.input}</div>
        <div className="flex items-center gap-2">
          <span className="font-bold">Output:</span>
          <span>{example.output}</span>
          <CopyButton
            value={example.output}
            onCopy={() => handleCopy(example.output, `output${idx}`)}
            copied={copied[`output${idx}`]}
            label="Copy output"
          />
        </div>
        {example.explanation && <span className="text-xs text-gray-400 mt-2">Flip or hover for explanation</span>}
      </div>
      {/* Back */}
      <div className={`absolute w-full h-full rounded-xl shadow-lg p-5 flex flex-col justify-center items-center transition-colors duration-300 ${
        theme === 'dark' ? 'bg-blue-950/95 border border-blue-900/60' : 'bg-blue-200/95 border border-blue-400/60'
      } rotate-y-180 backface-hidden`}>
        <span className={`text-xs font-bold uppercase tracking-wide mb-2 ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>Explanation</span>
        <div className={`text-xs text-center ${theme === 'dark' ? 'text-blue-100' : 'text-blue-800'}`}>{example.explanation}</div>
      </div>
    </div>
  </div>
);

export default ExampleFlipCard;
