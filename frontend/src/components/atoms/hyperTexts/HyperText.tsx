import React, { MouseEvent, MouseEventHandler } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';

type Props = {
  icon?: string;
  secondary?: boolean;
  iconRight?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  href?: string;
  className?: string;
  submit?: boolean;
  iconFill?: boolean;
  children: React.ReactNode;
  target?: string;
};

const HyperText: React.FC<Props> = ({
  icon,
  iconRight = false,
  onClick,
  href,
  className = '',
  children,
  submit = false,
  iconFill = false,
  ...props
}) => {
  if (icon) {
    className += iconFill ? ` fr-icon-${icon}-fill` : ` fr-icon-${icon}-line`;
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
      <button
        className={className}
        onClick={onClick as (event: MouseEvent<HTMLElement>) => void}
        {...props}
      >
        {children}
      </button>
    );
  }

  if (submit) {
    return (
      <button type="submit" className={className} {...props}>
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
