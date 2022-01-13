import React, { MouseEvent } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { useMatomo } from '@datapunt/matomo-tracker-react';

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
  const { trackEvent } = useMatomo();

  if (type) {
    className += ` fr-background-flat--${type} fr-text-inverted--${type}`;
  }

  if (icon) {
    className += ` fr-fi-${icon}-line`;
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
    const handleClick: (e: MouseEvent<HTMLElement>) => void = (e) => {
      trackEvent({ category: 'DataPass', action: 'click-event' });
      onClick(e);
    };

    return (
      <button className={className} onClick={handleClick} {...props}>
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
