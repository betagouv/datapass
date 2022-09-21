import React from 'react';
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
  title?: string;
};

export const Alert: React.FC<Props> = ({
  type = BadgeType.info,
  title,
  children,
}) => (
  <div role="alert" className={`fr-alert fr-alert--${type}`}>
    {title && <p className="fr-alert__title">{title}</p>}
    {children}
  </div>
);

export default Alert;
