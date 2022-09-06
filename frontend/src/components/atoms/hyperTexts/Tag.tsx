import React, { MouseEvent } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';

type Props = {
  icon?: string;
  href?: string;
  className?: string;
  small?: boolean;
  dismiss?: boolean;
  ariaPressed?: boolean;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};

export const Tag: React.FC<Props> = ({
  icon = false,
  className = '',
  href,
  small = false,
  dismiss = false,
  ariaPressed = false,
  onClick,
  children,
  ...props
}) => {
  className += ' fr-tag';
  if (small) {
    className += ' fr-tag--sm';
  }
  if (icon) {
    className += ` fr-fi-arrow-right-line`;
  }
  if (dismiss) {
    className += ` fr-tag-dismiss`;
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
        aria-pressed={ariaPressed}
        onClick={onClick}
        {...props}
      >
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
export default Tag;
