import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';

type linkProps = {
  target: string;
  rel: string;
};

const Link = ({
  type,
  closeButton = false,
  icon,
  onClick,
  href,
  children,
  className = '',
  inline = false,
  newTab = false,
  ...props
}: {
  type?: string;
  closeButton?: boolean;
  icon?: string;
  onClick?: () => void;
  href?: string;
  children: React.ReactNode;
  className?: string;
  inline?: boolean;
  newTab?: boolean;
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

  if (newTab) {
    (props as linkProps).target = '_blank';
    (props as linkProps).rel = 'noreferrer';
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
