import React from 'react';

const FrFiIcon = ({ color = 'var(--datapass-blue)', type }) => (
  <span
    className={`fr-fi-${type}-s-line`}
    aria-hidden="true"
    style={{ color }}
  />
);

export const ArrowUpIcon = ({ color }) => (
  <FrFiIcon type="arrow-up" color={color} />
);

export const ArrowDownIcon = ({ color }) => (
  <FrFiIcon type="arrow-down" color={color} />
);
