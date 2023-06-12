import React, { MouseEvent } from 'react';
import HyperText from './HyperText';
import './Button.css';

type Props = {
  href?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  secondary?: boolean;
  tertiary?: boolean;
  tertiaryNoOutline?: boolean;
  quaternary?: boolean;
  large?: boolean;
  xLarge?: boolean;
  icon?: string;
  iconRight?: boolean;
  iconFill?: boolean;
  className?: string;
  disabled?: boolean;
  download?: boolean;
};

const Button: React.FC<Props> = ({
  href,
  onClick,
  secondary = false,
  tertiary = false,
  tertiaryNoOutline = false,
  quaternary = false,
  large = false,
  xLarge = false,
  icon,
  iconRight = false,
  iconFill = false,
  children,
  className = '',
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

  if (tertiary) {
    className += ' fr-btn--tertiary';
  }

  if (tertiaryNoOutline) {
    className += ' fr-btn--tertiary-no-outline';
  }

  if (quaternary) {
    // NOTE: The following class doesn't exist in the DSFR.
    // This will need to be updated with future DSFR versions to maintain compatibility.
    className += ' fr-btn--quaternary';
  }

  return (
    <HyperText
      icon={icon}
      iconRight={iconRight}
      iconFill={iconFill}
      onClick={onClick}
      href={href}
      children={children}
      className={className}
      {...props}
    />
  );
};

export default Button;
