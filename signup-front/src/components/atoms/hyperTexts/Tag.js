import React from 'react';
import HyperText from './HyperText';

export const Tag = ({ type = '', href, onClick, children, ...props }) => (
  <HyperText
    className="fr-tag"
    type={type}
    href={href}
    onClick={onClick}
    children={children}
    {...props}
  />
);

export default Tag;
