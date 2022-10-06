import React, { MouseEvent } from 'react';
import HyperText from './HyperText';

type Props = {
  href?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  secondary?: boolean;
  tertiaryNoOutline?: boolean;
  large?: boolean;
  xLarge?: boolean;
  icon?: string;
  iconRight?: boolean;
  className?: string;
  submit?: boolean;
  disabled?: boolean;
};

const Button: React.FC<Props> = ({
  href,
  onClick,
  secondary = false,
  tertiaryNoOutline = false,
  large = false,
  xLarge = false,
  icon,
  iconRight = false,
  children,
  className = '',
  submit = false,
  ...props
}) => {
  className += ' fr-btn';

  if (!large && !xLarge) {
    className += ' fr-btn--sm';
  }

  if (xLarge) {
    className += ' fr-btn--lg';
  }

  if (secondary) {
    className += ' fr-btn--secondary';
  }

  if (tertiaryNoOutline) {
    className += ' fr-btn--tertiary-no-outline';
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
