import React from "react";
import { Copy, Check } from "lucide-react";

const CopyButton = ({ onClick, copied, disabled, className = "" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100 focus:opacity-100'
    } bg-slate-200 hover:bg-slate-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 ${className}`}
    aria-label="Copy code"
    type="button"
  >
    {copied ? (
      <>
        <Check size={16} className="text-green-500" />
        <span className="text-green-500">Copied!</span>
      </>
    ) : (
      <>
        <Copy size={16} />
        <span>Copy</span>
      </>
    )}
  </button>
);

export default CopyButton;
