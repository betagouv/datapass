import React from 'react';
import '@gouvfr/dsfr/dist/utility/icons/icons-system/icons-system.min.css';
import '@gouvfr/dsfr/dist/utility/icons/icons-business/icons-business.min.css';
import '@gouvfr/dsfr/dist/utility/icons/icons-design/icons-design.min.css';
import '@gouvfr/dsfr/dist/utility/icons/icons-document/icons-document.min.css';
import '@gouvfr/dsfr/dist/utility/icons/icons-others/icons-others.min.css';
import '@gouvfr/dsfr/dist/utility/icons/icons-device/icons-device.min.css';
import '@gouvfr/dsfr/dist/utility/icons/icons-buildings/icons-buildings.min.css';
import '@gouvfr/dsfr/dist/utility/icons/icons-media/icons-media.min.css';
import '@gouvfr/dsfr/dist/utility/icons/icons-user/icons-user.min.css';

export const FrFiIcon: React.FC<{
  color?: string;
  type: string;
  large?: boolean;
  small?: boolean;
}> = ({
  color = 'var(--text-default-info)',
  type,
  large = false,
  small = false,
}) => {
  let className = `fr-icon-${type}`;

  if (small) {
    className += ` fr-icon--sm`;
  }

  if (large) {
    className += ` fr-icon--lg`;
  }

  return <span className={className} aria-hidden="true" style={{ color }} />;
};

type Props = { color?: string; large?: boolean; small?: boolean };

// Icons - Business
export const MailIcon: React.FC<Props> = ({ color, large, small }) => (
  <FrFiIcon type="mail-line" color={color} large={large} small={small} />
);

export const MailIconFill: React.FC<Props> = ({ color, large, small }) => (
  <FrFiIcon type="mail-fill" color={color} large={large} small={small} />
);

export const MailOpenIcon: React.FC<Props> = ({ color, large, small }) => (
  <FrFiIcon type="mail-open-line" color={color} large={large} small={small} />
);

export const MailOpenIconFill: React.FC<Props> = ({ color, large, small }) => (
  <FrFiIcon type="mail-open-fill" color={color} large={large} small={small} />
);

// Icons - Media
export const NotificationIcon: React.FC<Props> = ({ color, large, small }) => (
  <FrFiIcon
    type="notification-3-line"
    color={color}
    large={large}
    small={small}
  />
);

// Icons - System DSFR
export const InfoFillIcon: React.FC<Props> = ({ color, large, small }) => (
  <FrFiIcon type="info-fill" color={color} large={large} small={small} />
);

export const InfoIcon: React.FC<Props> = ({ color, large, small }) => (
  <FrFiIcon type="info-line" color={color} large={large} small={small} />
);

export const WarningIcon: React.FC<Props> = ({ color, large, small }) => (
  <FrFiIcon type="warning-fill" color={color} large={large} small={small} />
);

// RemixIcon
export const AddCircleIcon: React.FC<Props> = ({ color, large, small }) => (
  <FrFiIcon type="add-circle-line" color={color} large={large} small={small} />
);

export const ArrowUpIcon: React.FC<Props> = ({ color, large, small }) => (
  <FrFiIcon type="arrow-up-s-line" color={color} large={large} small={small} />
);

export const ArrowDownIcon: React.FC<Props> = ({ color, large, small }) => (
  <FrFiIcon
    type="arrow-down-s-line"
    color={color}
    large={large}
    small={small}
  />
);

export const CheckCircleIcon: React.FC<Props> = ({ color, large, small }) => (
  <FrFiIcon
    type="checkbox-circle-fill"
    color={color}
    large={large}
    small={small}
  />
);

export const ErrorIcon: React.FC<Props> = ({ color, large, small }) => (
  <FrFiIcon
    type="error-warning-fill"
    color={color}
    large={large}
    small={small}
  />
);

export const HelpIcon: React.FC<Props> = ({ color, large, small }) => (
  <FrFiIcon type="question-fill" color={color} large={large} small={small} />
);

export const RefreshIcon: React.FC<Props> = ({ color, large, small }) => (
  <FrFiIcon type="refresh-line" color={color} large={large} small={small} />
);

export const ScheduleIcon: React.FC<Props> = ({ color, large, small }) => (
  <FrFiIcon type="time-line" color={color} large={large} small={small} />
);

export const EyeIcon: React.FC<Props> = ({ color, large, small }) => (
  <FrFiIcon type="eye-line" color={color} large={large} small={small} />
);

export const EditIcon: React.FC<Props> = ({ color, large, small }) => (
  <FrFiIcon type="edit-line" color={color} large={large} small={small} />
);

export const FilterIcon: React.FC<Props> = ({ color, large, small }) => (
  <FrFiIcon type="filter-line" color={color} large={large} small={small} />
);

export const ArchiveIcon: React.FC<Props> = ({ color, large, small }) => (
  <FrFiIcon type="archive-line" color={color} large={large} small={small} />
);
