import React, { ButtonHTMLAttributes } from 'react';
import HyperText from './HyperText';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  secondary?: boolean;
  tertiary?: boolean;
  tertiaryNoOutline?: boolean;
  quaternary?: boolean;
  large?: boolean;
  xLarge?: boolean;
  icon?: string;
  iconRight?: boolean;
  iconFill?: boolean;
  download?: boolean;
  submit?: boolean;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
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
  submit = false,
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
      submit={submit}
      {...props}
    />
  );
};

export default Button;
