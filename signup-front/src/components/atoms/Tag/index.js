import React from 'react';
import './style.css';

export const TagContainer = ({ children }) => (
  <div className="tag-container">{children}</div>
);

export const Tag = ({ type = '', onClick, href, children, ...props }) => {
  let className = `fr-tag`;

  if (type) {
    className += ` fr-background-flat--${type} fr-text-inverted--${type}`;
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
