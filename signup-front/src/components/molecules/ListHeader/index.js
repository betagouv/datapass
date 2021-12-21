import React from 'react';
import './style.css';
import { TagContainer } from '../../atoms/Tag';

export const ListHeader = ({ title, children }) => (
  <div className="list-header">
    <h1>{title}</h1>
    <TagContainer>{children}</TagContainer>
  </div>
);

export default ListHeader;
