import React, { MouseEventHandler } from 'react';
import HyperText from './HyperText';

type Props = {
  withArrow?: string;
  href?: string;
  small?: boolean;
  dismiss?: boolean;
  isActive?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  children: React.ReactNode;
};

export const Tag: React.FC<Props> = ({
  withArrow = false,
  href,
  small = false,
  dismiss = false,
  isActive = false,
  onClick,
  children,
  ...props
}) => {
  let className = 'fr-tag';

  if (small) {
    className += ' fr-tag--sm';
  }

  if (dismiss) {
    className += ` fr-tag-dismiss`;
  }

  return (
    <HyperText
      className={className}
      icon={withArrow ? 'arrow-right' : undefined}
      href={href}
      /* we trick the HyperText component to use a button element when href and onClick are not defined */
      onClick={onClick ? onClick : !onClick && !href ? () => null : undefined}
      children={children}
      aria-pressed={isActive}
      {...props}
    />
  );
};
export default Tag;
