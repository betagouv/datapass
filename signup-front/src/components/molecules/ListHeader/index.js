import React from 'react';
import './style.css';

export const ListHeader = ({ title, children }) => (
  <div className="list-header-container">
    <div className="list-header">
      <span style={{ margin: 0 }} className="fr-text--lead">
        {title}
      </span>
      {children}
    </div>
  </div>
);

export default ListHeader;
