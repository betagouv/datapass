import React, { PropsWithChildren } from 'react';

const FrFiIcon: React.FC<PropsWithChildren<{ color?: string; type: string }>> =
  ({ color = 'var(--datapass-blue)', type }) => (
    <span className={`fr-fi-${type}`} aria-hidden="true" style={{ color }} />
  );

type FrFiIconsType = React.FC<PropsWithChildren<{ color?: string }>>;

export const ArrowUpIcon: FrFiIconsType = ({ color }) => (
  <FrFiIcon type="arrow-up-s-line" color={color} />
);

export const ArrowDownIcon: FrFiIconsType = ({ color }) => (
  <FrFiIcon type="arrow-down-s-line" color={color} />
);

export const InfoIcon: FrFiIconsType = ({ color }) => (
  <FrFiIcon type="information-fill" color={color} />
);

export const ExternalLinkIcon: FrFiIconsType = ({ color }) => (
  <FrFiIcon type="external-link-line" color={color} />
);
