import React from 'react';
import './style.css';
import ControlPointIcon from '../../atoms/icons/control-point';

export const CardHead = ({ children }) => (
  <div className="datapass_card_head">{children}</div>
);

export const Card = ({ children, className = '' }) => (
  <div className={`datapass_card ${className}`}>{children}</div>
);

export const AddCard = ({ onClick, label = '' }) => (
  <div className="datapass_card datapass_add_card" onClick={onClick}>
    <ControlPointIcon size="50px" />
    <div>{label}</div>
  </div>
);

export const CardContainer = ({ flex = true, children }) => (
  <div className={`datapass_card_container${flex ? '' : '_grid'}`}>
    {children}
  </div>
);

export default Card;
