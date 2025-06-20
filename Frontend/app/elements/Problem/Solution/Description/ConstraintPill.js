import React from "react";
import { BadgeInfo } from "lucide-react";

const ConstraintPill = ({ constraint, theme }) => (
  <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium shadow-sm border ${
    theme === 'dark' ? 'bg-gray-900/80 text-blue-200 border-blue-900/30' : 'bg-blue-100 text-blue-800 border-blue-300'
  }`}>
    <BadgeInfo size={14} /> {constraint}
  </span>
);

export default ConstraintPill;
