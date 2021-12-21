import React from 'react';

const FrFiIcon = ({ color = 'var(--datapass-blue)', type }) => (
  <span className={`fr-fi-${type}`} aria-hidden="true" style={{ color }} />
);

export const ArrowUpIcon = ({ color }) => (
  <FrFiIcon type="arrow-up-s-line" color={color} />
);

export const ArrowDownIcon = ({ color }) => (
  <FrFiIcon type="arrow-down-s-line" color={color} />
);

export const InfoIcon = ({ color }) => (
  <FrFiIcon type="information-fill" color={color} />
);

export const ExternalLinkIcon = ({ color }) => (
  <FrFiIcon type="external-link-line" color={color} />
);
