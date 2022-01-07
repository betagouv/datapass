import React from 'react';
import './style.css';
import { Link as ReactRouterLink } from 'react-router-dom';

export const TagContainer = ({ children }) => (
  <div className="tag-container">{children}</div>
);

export const Tag = ({ type = '', onClick, href, children, ...props }) => {
  let className = `fr-tag`;

  if (type) {
    className += ` fr-background-flat--${type} fr-text-inverted--${type}`;
  }

  if (href) {
    const isExternalRefPattern = /^(https?:\/\/|mailto:|\/docs\/|#)/;
    const isExternalRef = isExternalRefPattern.test(href);

    if (isExternalRef) {
      return (
        <a className={className} href={href} {...props}>
          {children}
        </a>
      );
    }

    return (
      <ReactRouterLink className={className} to={href} {...props}>
        {children}
      </ReactRouterLink>
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
