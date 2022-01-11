import React from 'react';
import HyperText from './HyperText';

type linkProps = {
  target: string;
  rel: string;
};

const Link = ({
  href,
  onClick,
  inline = false,
  footerContent = false,
  footerBottom = false,
  sidemenu = false,
  closeButton = false,
  icon,
  newTab = false,
  children,
  ...props
}: {
  href?: string;
  onClick?: () => void;
  inline?: boolean;
  footerContent?: boolean;
  footerBottom?: boolean;
  sidemenu?: boolean;
  closeButton?: boolean;
  icon?: string;
  newTab?: boolean;
  children: React.ReactNode;
}) => {
  let className = 'fr-link';

  if (inline) {
    className = '';
  }

  if (footerContent) {
    className = 'fr-footer__content-link';
  }

  if (footerBottom) {
    className = 'fr-footer__bottom-link';
  }

  if (sidemenu) {
    className = 'fr-sidemenu__link';
  }

  if (closeButton) {
    className += ` fr-link--close`;
  }

  if (href && newTab) {
    (props as linkProps).target = '_blank';
    (props as linkProps).rel = 'noreferrer';
  }

  return (
    <HyperText
      href={href}
      onClick={onClick}
      className={className}
      icon={icon}
      children={children}
      {...props}
    />
  );
};

export default Link;
