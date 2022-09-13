import React, { useEffect, useRef, useState } from 'react';
import './style.css';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  InfoFillIcon,
} from '../../atoms/icons/fr-fi-icons';

type Props = {
  title: string;
  large?: boolean;
  openOnMount?: boolean;
  scrollOnMount?: boolean;
};

export const ExpandableQuote: React.FC<Props> = ({
  title,
  large = false,
  openOnMount = false,
  scrollOnMount = false,
  children,
}) => {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (scrollOnMount) {
      // @ts-ignore
      ref.current.scrollIntoView();
    }
  }, [ref, scrollOnMount]);

  useEffect(() => setExpanded(openOnMount), [openOnMount]);

  return (
    <div
      ref={ref}
      className={`expandable-quote ${expanded ? 'expanded' : ''} ${
        large ? 'large' : ''
      }`}
    >
      <div
        className="expandable-quote-header"
        onClick={() => setExpanded(!expanded)}
      >
        <InfoFillIcon />
        <div>{title}</div>
        {expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </div>
      <div className={`expandable-quote-content`}>{children}</div>
    </div>
  );
};

export default ExpandableQuote;
