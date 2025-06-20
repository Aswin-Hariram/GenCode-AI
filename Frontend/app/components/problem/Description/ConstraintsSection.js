import React from "react";
import { FileText, ChevronDown, ChevronUp, BadgeInfo } from "lucide-react";
import ConstraintPill from "../../../elements/Problem/Solution/Description/ConstraintPill";
import SectionHeader from "../../../elements/Problem/Solution/Description/SectionHeader";

const ConstraintsSection = ({ constraints, expanded, setExpanded, theme }) => {
  const stickyHeader = `sticky top-0 z-10 bg-opacity-80 backdrop-blur-md py-2 px-2 rounded-t-md shadow-sm ${theme === 'dark' ? 'bg-gray-950/80' : 'bg-slate-100/90'}`;
  return (
    <div className="mt-12 mx-auto max-w-3xl">
      <SectionHeader className={`${stickyHeader} text-xl font-bold flex items-center gap-2 mb-4 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}
        icon={<FileText className="w-6 h-6" />}>
        Constraints
        {constraints.length > 5 && (
          <button
            className="ml-2 flex items-center gap-1 px-2 py-1 text-xs rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls="constraints-list"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />} {expanded ? 'Show less' : 'Show all'}
          </button>
        )}
      </SectionHeader>
      <div id="constraints-list" className="flex flex-wrap gap-3">
        {(expanded || constraints.length <= 5 ? constraints : constraints.slice(0, 5)).map((constraint, i) => (
          <ConstraintPill key={i} constraint={constraint} theme={theme} />
        ))}
        {constraints.length > 5 && !expanded && (
          <span className="text-xs text-gray-400">+{constraints.length - 5} more...</span>
        )}
      </div>
    </div>
  );
};

export default ConstraintsSection;
