import React from "react";
import { ClipboardCopy } from "lucide-react";

const CopyButton = ({ value, onCopy, copied, label }) => (
  <button
    className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
    aria-label={label}
    onClick={onCopy}
    tabIndex={0}
    type="button"
  >
    <ClipboardCopy size={16} />
    <span className="sr-only">{label}</span>
    {copied && <span className="text-xs text-green-500 ml-1">Copied!</span>}
  </button>
);

export default CopyButton;
