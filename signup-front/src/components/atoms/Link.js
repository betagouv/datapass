import React from 'react';

const Link = ({
  type = '',
  closeButton,
  icon,
  onClick,
  href,
  children,
  ...props
}) => {
  let className = `fr-link`;

  if (icon) {
    className += ` fr-fi-${icon}-line`;
  }

  if (closeButton) {
    className += ` fr-link--close`;
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
