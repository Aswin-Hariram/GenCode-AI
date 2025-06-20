import React from 'react';
import PropTypes from 'prop-types';

const HeaderButton = ({ onClick, disabled, className = '', title, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={className}
    title={title}
  >
    {children}
  </button>
);

HeaderButton.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node
};

export default HeaderButton;
