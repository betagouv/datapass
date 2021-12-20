import React, { useState } from 'react';
import './ExpandableQuote.css';
import AlertIcon from '../icons/alert';
import { ArrowDownIcon, ArrowUpIcon } from '../icons/fr-fi-icons';

export const ExpandableQuote = ({ title, large, children }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`expandable-quote ${expanded ? 'expanded' : ''} ${
        large ? 'large' : ''
      }`}
    >
      <div
        className="expandable-quote-header"
        onClick={() => setExpanded(!expanded)}
      >
        <AlertIcon />
        <div>{title}</div>
        {expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </div>
      <div className={`expandable-quote-content`}>{children}</div>
    </div>
  );
};

export default ExpandableQuote;
