import React from 'react';

export const Alert = ({ type, title, children }) => (
  <div role="alert" className={`fr-alert fr-alert--${type}`}>
    {title && <p className="fr-alert__title">{title}</p>}
    {children}
  </div>
);

export default Alert;
