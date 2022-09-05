import React from 'react';

const FrFiIcon: React.FC<{
  color?: string;
  type: string;
}> = ({ color = 'var(--datapass-blue)', type }) => (
  <span className={`fr-icon-${type}`} aria-hidden="true" style={{ color }} />
);

type Props = { color?: string };

export const ArrowUpIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="arrow-up-s-line" color={color} />
);

export const ArrowDownIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="arrow-down-s-line" color={color} />
);

// round info icon
export const InformationFillIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="information-fill" color={color} />
);

export const InformationIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="information-line" color={color} />
);

// Square info icon
export const InfoFillIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="info-fill" color={color} />
);

export const InfoIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="info-line" color={color} />
);

export const ExternalLinkIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="external-link-line" color={color} />
);

export const MailIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="mail-line" color={color} />
);

// New Icon with update DSFR

export const HelpIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="question-fill" color={color} />
);

export const AlertIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="alert-line" color={color} />
);

export const RefreshIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="refresh-line" color={color} />
);

export const CheckCircleIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="checkbox-circle-fill" color={color} />
);

export const CheckIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="check-line-fill" color={color} />
);

export const EditIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="edit-line" color={color} />
);

export const ControlPointIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="add-circle-line" color={color} />
);

export const ErrorIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="error-warning-fill" color={color} />
);

export const WarningIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="warning-fill" color={color} />
);

export const ScheduleIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="time-line" color={color} />
);
