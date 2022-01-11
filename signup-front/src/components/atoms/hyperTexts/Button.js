import React from 'react';
import HyperText from './HyperText';

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
  submit = false,
  ...props
}) => {
  className += ' fr-btn';

  if (!large) {
    className += ' fr-btn--sm';
  }

  if (outline) {
    className += ' fr-btn--secondary';
  }

  if (submit) {
    return (
      <button type="submit" className={className} {...props}>
        {children}
      </button>
    );
  }

  return (
    <HyperText
      type={type}
      icon={icon}
      iconRight={iconRight}
      onClick={onClick}
      href={href}
      children={children}
      className={className}
      {...props}
    />
  );
};

export default Button;
