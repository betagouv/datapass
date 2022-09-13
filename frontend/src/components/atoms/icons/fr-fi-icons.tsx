import React from 'react';
import '@gouvfr/dsfr/dist/utility/icons/icons-system/icons-system.min.css';
import '@gouvfr/dsfr/dist/utility/icons/icons-business/icons-business.min.css';
import '@gouvfr/dsfr/dist/utility/icons/icons-design/icons-design.min.css';
import '@gouvfr/dsfr/dist/utility/icons/icons-document/icons-document.min.css';
import '@gouvfr/dsfr/dist/utility/icons/icons-device/icons-device.min.css';

const FrFiIcon: React.FC<{ color?: string; type: string; large?: boolean }> = ({
  color = 'var(--text-default-info)',
  type,
  large = false,
}) => {
  let className = `fr-icon-${type}`;

  if (large) {
    className += ` fr-icon--lg`;
  }
  return <span className={className} aria-hidden="true" style={{ color }} />;
};

type Props = { color?: string; large?: boolean };

// Icons - Business
export const MailIcon: React.FC<Props> = ({ color, large }) => (
  <FrFiIcon type="mail-line" color={color} large={large} />
);

export const MailOpenIcon: React.FC<Props> = ({ color, large }) => (
  <FrFiIcon type="mail-open-line" color={color} large={large} />
);

// Icons - System DSFR
export const InfoFillIcon: React.FC<Props> = ({ color, large }) => (
  <FrFiIcon type="info-fill" color={color} large={large} />
);

export const InfoIcon: React.FC<Props> = ({ color, large }) => (
  <FrFiIcon type="info-line" color={color} large={large} />
);

export const WarningIcon: React.FC<Props> = ({ color, large }) => (
  <FrFiIcon type="warning-fill" color={color} large={large} />
);

// RemixIcon
export const AddCircleIcon: React.FC<Props> = ({ color, large }) => (
  <FrFiIcon type="add-circle-line" color={color} large={large} />
);

export const ArrowUpIcon: React.FC<Props> = ({ color, large }) => (
  <FrFiIcon type="arrow-up-s-line" color={color} large={large} />
);

export const ArrowDownIcon: React.FC<Props> = ({ color, large }) => (
  <FrFiIcon type="arrow-down-s-line" color={color} large={large} />
);

export const CheckCircleIcon: React.FC<Props> = ({ color, large }) => (
  <FrFiIcon type="checkbox-circle-fill" color={color} large={large} />
);

export const ErrorIcon: React.FC<Props> = ({ color, large }) => (
  <FrFiIcon type="error-warning-fill" color={color} large={large} />
);

export const HelpIcon: React.FC<Props> = ({ color, large }) => (
  <FrFiIcon type="question-fill" color={color} large={large} />
);

export const RefreshIcon: React.FC<Props> = ({ color, large }) => (
  <FrFiIcon type="refresh-line" color={color} large={large} />
);

export const ScheduleIcon: React.FC<Props> = ({ color, large }) => (
  <FrFiIcon type="time-line" color={color} large={large} />
);
