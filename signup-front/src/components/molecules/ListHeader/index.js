import React from 'react';
import './style.css';

export const ListHeader = ({ title, children }) => (
  <div className="list-header">
    <h1>{title}</h1>
    <div>{children}</div>
  </div>
);

export default ListHeader;
