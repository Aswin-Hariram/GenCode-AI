import React from 'react';

const Badge = ({ children, className = '', ...props }) => (
  <span className={className} {...props}>
    {children}
  </span>
);

export default Badge;
