import React from 'react';
import './style.css';

const Tag = ({ type = '', onClick, children, ...props }) => {
  let className = `fr-tag`;

  if (type) {
    className += ` ${type}`;
  }

  if (!!onClick) {
    return (
      <button className={className} onClick={onClick} {...props}>
        {children}
      </button>
    );
  }

  return (
    <p className={className} {...props}>
      {children}
    </p>
  );
};

export default Tag;
