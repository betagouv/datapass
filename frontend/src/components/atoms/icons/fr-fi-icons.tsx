import React from 'react';
import '@gouvfr/dsfr/dist/utility/icons/icons-system/icons-system.min.css';
import '@gouvfr/dsfr/dist/utility/icons/icons-business/icons-business.min.css';
import '@gouvfr/dsfr/dist/utility/icons/icons-design/icons-design.min.css';
import '@gouvfr/dsfr/dist/utility/icons/icons-document/icons-document.min.css';
import '@gouvfr/dsfr/dist/utility/icons/icons-device/icons-device.min.css';

const FrFiIcon: React.FC<{ color?: string; type: string }> = ({
  color = 'var(--text-default-info)',
  type,
}) => <span className={`fr-fi-${type}`} aria-hidden="true" style={{ color }} />;

type Props = { color?: string };

// Icons - Business
export const MailIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="mail-line" color={color} />
);

export const MailOpenIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="mail-open-line" color={color} />
);

// Icons - System DSFR
export const InfoFillIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="info-fill" color={color} />
);

export const InfoIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="info-line" color={color} />
);

export const WarningIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="warning-fill" color={color} />
);

// RemixIcon
export const AddCircleIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="add-circle-line" color={color} />
);

export const ArrowUpIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="arrow-up-s-line" color={color} />
);

export const ArrowDownIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="arrow-down-s-line" color={color} />
);

export const CheckCircleIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="checkbox-circle-fill" color={color} />
);

export const ErrorIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="error-warning-fill" color={color} />
);

export const HelpIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="question-fill" color={color} />
);

export const RefreshIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="refresh-line" color={color} />
);

export const ScheduleIcon: React.FC<Props> = ({ color }) => (
  <FrFiIcon type="time-line" color={color} />
);
