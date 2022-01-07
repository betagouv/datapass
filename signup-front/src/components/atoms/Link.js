import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';

const Link = ({
  type = '',
  closeButton,
  icon,
  onClick,
  href,
  children,
  className = '',
  inline = false,
  ...props
}) => {
  if (!inline && !className) {
    className = 'fr-link';
  }

  if (icon) {
    className += ` fr-fi-${icon}-line`;
  }

  if (closeButton) {
    className += ` fr-link--close`;
  }

  if (href) {
    // Actually we should also use a <a> element if href:
    // - start with #
    // - start with /doc
    // - start with mailto:
    const isExternalRefPattern = /^https?:\/\//i;
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
  if (type === 'submit') {
    return (
      <button type={type} className={className} {...props}>
        {children}
      </button>
    );
  }
  throw new Error("Please specify either 'href', 'onClick' or 'type' props");
};

export default Link;
