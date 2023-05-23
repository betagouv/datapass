import React, { useState } from 'react';
import './style.css';
import { ArrowDownIcon, ArrowUpIcon } from '../../atoms/icons/fr-fi-icons';

type Props = {
  title: string;
};

export const ExpandableSection: React.FC<Props> = ({ title, children }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="expandable-section">
      <div
        className="expandable-section-header"
        onClick={() => setExpanded(!expanded)}
      >
        <div>{title}</div>
        {expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </div>
      {expanded && <div className="expandable-section-content">{children}</div>}
    </div>
  );
};

export default ExpandableSection;
