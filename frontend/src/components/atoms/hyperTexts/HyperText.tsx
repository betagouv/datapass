import React, { MouseEvent } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';

export enum ButtonType {
  grey = 'grey',
  info = 'info',
  success = 'success',
  warning = 'warning',
  error = 'error',
}

type Props = {
  type?: ButtonType;
  icon?: string;
  iconRight?: boolean;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  href?: string;
  className?: string;
};

const HyperText: React.FC<Props> = ({
  type,
  icon,
  iconRight = false,
  onClick,
  href,
  className = '',
  children,
  ...props
}) => {
  if (type) {
    className += ` fr-background-flat--${type} fr-text-inverted--${type}`;
  }

  if (icon) {
    className += ` fr-icon-${icon}-line`;
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
