import { Check } from "lucide-react";

const FloatingCopyButton = ({ selectedText, onCopy }) => {
  if (!selectedText) return null;
  return (
    <button
      className="fixed z-50 bg-slate-100 hover:bg-blue-100 rounded-md shadow-lg border border-gray-300 flex items-center px-3 py-1 gap-2 text-sm font-medium"
      style={{ bottom: 90, right: 32 }}
      onClick={() => onCopy(selectedText)}
      aria-label="Copy selected text"
    >
      <Check size={16} className="text-green-600" />
      Copy
    </button>
  );
};

export default FloatingCopyButton;
