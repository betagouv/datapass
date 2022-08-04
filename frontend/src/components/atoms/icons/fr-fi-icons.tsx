import React from 'react';

const FrFiIcon: React.FC<{ color?: string; type: string }> = ({
  color = 'var(--datapass-blue)',
  type,
}) => <span className={`fr-fi-${type}`} aria-hidden="true" style={{ color }} />;

type Props = { color?: string };

export const ArrowUpIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="arrow-up-s-line" color={color} />
);

export const ArrowDownIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="arrow-down-s-line" color={color} />
);

export const InfoIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="information-fill" color={color} />
);

export const ExternalLinkIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="external-link-line" color={color} />
);

export const MailIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="mail-line" color={color} />
);
