import React from "react";

const SectionHeader = ({ children, className = "", icon }) => (
  <h3 className={className}>
    {icon} {children}
  </h3>
);

export default SectionHeader;
