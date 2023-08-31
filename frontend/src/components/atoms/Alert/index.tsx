import React, { MouseEventHandler } from 'react';
import './style.css';
import { BadgeType } from '../hyperTexts/Badge';

export enum AlertType {
  info = 'info',
  success = 'success',
  warning = 'warning',
  error = 'error',
}

type Props = {
  type?: AlertType;
  title?: string | React.ReactNode;
  onAlertClose?: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
};

export const Alert: React.FC<Props> = ({
  type = BadgeType.info,
  title,
  onAlertClose = null,
  children,
}) => (
  <div role="alert" className={`fr-alert fr-alert--${type}`}>
    {title && <p className="fr-alert__title">{title}</p>}
    {children}
    {onAlertClose && (
      <button className="fr-link--close fr-link" onClick={onAlertClose}>
        Masquer le message
      </button>
    )}
  </div>
);

export default Alert;
