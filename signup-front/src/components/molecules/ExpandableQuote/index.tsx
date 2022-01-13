import React, { useEffect, useState } from 'react';
import './style.css';
import AlertIcon from '../../atoms/icons/alert';
import { ArrowDownIcon, ArrowUpIcon } from '../../atoms/icons/fr-fi-icons';

type Props = { title: string; large?: boolean; openOnMount?: boolean };

export const ExpandableQuote: React.FC<Props> = ({
  title,
  large = false,
  openOnMount = false,
  children,
}) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => setExpanded(openOnMount), [openOnMount]);

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
