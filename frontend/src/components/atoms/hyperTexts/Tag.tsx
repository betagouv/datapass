import React, { MouseEvent } from 'react';
import HyperText, { ButtonType } from './HyperText';

type Props = {
  type?: ButtonType;
  icon?: string;
  href?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};

export const Tag: React.FC<Props> = ({
  type,
  icon,
  href,
  onClick,
  children,
  ...props
}) => (
  <HyperText
    className="fr-tag"
    type={type}
    icon={icon}
    href={href}
    onClick={onClick}
    children={children}
    {...props}
  />
);

export default Tag;
