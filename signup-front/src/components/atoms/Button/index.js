import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';

const Button = ({
  href,
  onClick,
  outline = false,
  large = false,
  type,
  icon,
  iconRight = false,
  children,
  className = '',
  ...props
}) => {
  className += ' fr-btn';

  if (!large) {
    className += ' fr-btn--sm';
  }

  if (outline) {
    className += ' fr-btn--secondary';
  }

  if (type) {
    className += ` fr-background-flat--${type} fr-text-inverted--${type}`;
  }

  if (icon) {
    className += ` fr-fi-${icon}-line`;
  }

  if (icon && children) {
    className += iconRight ? ' fr-btn--icon-right' : ' fr-btn--icon-left';
  }

  if (href) {
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
      <button onClick={onClick} className={className} {...props}>
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

export default Button;
