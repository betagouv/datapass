import React from 'react';
import './style.css';

export const Alert = ({ type = 'info', title, children }) => (
  <div role="alert" className={`fr-alert fr-alert--${type}`}>
    {title && <p className="fr-alert__title">{title}</p>}
    {children}
  </div>
);

export default Alert;
