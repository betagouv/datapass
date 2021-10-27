import React from 'react';
import './style.css';

const Tag = ({ type = '', onClick, href, children, ...props }) => {
  let className = `fr-tag`;

  if (type) {
    className += ` ${type}`;
  }

  if (href) {
    return (
      <a className={className} href={href} {...props}>
        {children}
      </a>
    );
  }
  if (onClick) {
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
