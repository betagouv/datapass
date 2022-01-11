import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';

const HyperText = ({
  type,
  icon,
  iconRight = false,
  onClick,
  href,
  children,
  className = '',
  ...props
}: {
  type?: string;
  icon?: string;
  iconRight?: boolean;
  onClick?: () => void;
  href?: string;
  children: React.ReactNode;
  className?: string;
}) => {
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

export default HyperText;
