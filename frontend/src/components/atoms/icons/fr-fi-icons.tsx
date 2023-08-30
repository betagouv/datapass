import React from 'react';
import '@gouvfr/dsfr/dist/utility/icons/icons-system/icons-system.min.css';
import '@gouvfr/dsfr/dist/utility/icons/icons-business/icons-business.min.css';
import '@gouvfr/dsfr/dist/utility/icons/icons-design/icons-design.min.css';
import '@gouvfr/dsfr/dist/utility/icons/icons-document/icons-document.min.css';
import '@gouvfr/dsfr/dist/utility/icons/icons-device/icons-device.min.css';
import '@gouvfr/dsfr/dist/utility/icons/icons-buildings/icons-buildings.min.css';
import '@gouvfr/dsfr/dist/utility/icons/icons-media/icons-media.min.css';
import '@gouvfr/dsfr/dist/utility/icons/icons-user/icons-user.min.css';
import '@gouvfr/dsfr/dist/utility/icons/icons-others/icons-others.min.css';

export type IconProps = {
  color?: string;
  large?: boolean;
  small?: boolean;
  type?: string;
  size?: number;
  title?: string;
};

const FrFiIcon: React.FC<IconProps> = ({
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

// Icons - Business
export const MailIcon: React.FC<IconProps> = ({
  color,
  large,
  small,
  title,
}) => (
  <FrFiIcon
    type="mail-line"
    color={color}
    large={large}
    small={small}
    title={title}
  />
);

export const MailIconFill: React.FC<IconProps> = ({
  color,
  large,
  small,
  title,
}) => (
  <FrFiIcon
    type="mail-fill"
    color={color}
    large={large}
    small={small}
    title={title}
  />
);

export const MailOpenIcon: React.FC<IconProps> = ({
  color,
  large,
  small,
  title,
}) => (
  <FrFiIcon
    type="mail-open-line"
    color={color}
    large={large}
    small={small}
    title={title}
  />
);

export const MailOpenIconFill: React.FC<IconProps> = ({
  color,
  large,
  small,
  title,
}) => (
  <FrFiIcon
    type="mail-open-fill"
    color={color}
    large={large}
    small={small}
    title={title}
  />
);

// Icons - Media
export const NotificationIcon: React.FC<IconProps> = ({
  color,
  large,
  small,
  title,
}) => (
  <FrFiIcon
    type="notification-3-line"
    color={color}
    large={large}
    small={small}
    title={title}
  />
);

// Icons - System DSFR
export const InfoFillIcon: React.FC<IconProps> = ({
  color,
  large,
  small,
  title,
}) => (
  <FrFiIcon
    type="info-fill"
    color={color}
    large={large}
    small={small}
    title={title}
  />
);

export const InfoIcon: React.FC<IconProps> = ({
  color,
  large,
  small,
  title,
}) => (
  <FrFiIcon
    type="info-line"
    color={color}
    large={large}
    small={small}
    title={title}
  />
);

export const WarningIcon: React.FC<IconProps> = ({
  color,
  large,
  small,
  title,
}) => (
  <FrFiIcon
    type="warning-fill"
    color={color}
    large={large}
    small={small}
    title={title}
  />
);

// RemixIcon
export const AddCircleIcon: React.FC<IconProps> = ({
  color,
  large,
  small,
  title,
}) => (
  <FrFiIcon
    type="add-circle-line"
    color={color}
    large={large}
    small={small}
    title={title}
  />
);

export const ArrowUpIcon: React.FC<IconProps> = ({
  color,
  large,
  small,
  title,
}) => (
  <FrFiIcon
    type="arrow-up-s-line"
    color={color}
    large={large}
    small={small}
    title={title}
  />
);

export const ArrowDownIcon: React.FC<IconProps> = ({
  color,
  large,
  small,
  title,
}) => (
  <FrFiIcon
    type="arrow-down-s-line"
    color={color}
    large={large}
    small={small}
    title={title}
  />
);

export const ArrowRightIcon: React.FC<IconProps> = ({
  color,
  large,
  small,
  title,
}) => (
  <FrFiIcon
    type="arrow-right-s-line"
    color={color}
    large={large}
    small={small}
    title={title}
  />
);

export const CheckCircleIcon: React.FC<IconProps> = ({
  color,
  large,
  small,
  title,
}) => (
  <FrFiIcon
    type="checkbox-circle-fill"
    color={color}
    large={large}
    small={small}
    title={title}
  />
);

export const ErrorIcon: React.FC<IconProps> = ({
  color,
  large,
  small,
  title,
}) => (
  <FrFiIcon
    type="error-warning-fill"
    color={color}
    large={large}
    small={small}
    title={title}
  />
);

export const HelpIcon: React.FC<IconProps> = ({
  color,
  large,
  small,
  title,
}) => (
  <FrFiIcon
    type="question-fill"
    color={color}
    large={large}
    small={small}
    title={title}
  />
);

export const RefreshIcon: React.FC<IconProps> = ({
  color,
  large,
  small,
  title,
}) => (
  <FrFiIcon
    type="refresh-line"
    color={color}
    large={large}
    small={small}
    title={title}
  />
);

export const ScheduleIcon: React.FC<IconProps> = ({
  color,
  large,
  small,
  title,
}) => (
  <FrFiIcon
    type="time-line"
    color={color}
    large={large}
    small={small}
    title={title}
  />
);

export const EyeIcon: React.FC<IconProps> = ({
  color,
  large,
  small,
  title,
}) => (
  <FrFiIcon
    type="eye-line"
    color={color}
    large={large}
    small={small}
    title={title}
  />
);

export const EditIcon: React.FC<IconProps> = ({
  color,
  large,
  small,
  title,
}) => (
  <FrFiIcon
    type="edit-line"
    color={color}
    large={large}
    small={small}
    title={title}
  />
);

export const FilterIcon: React.FC<IconProps> = ({
  color,
  large,
  small,
  title,
}) => (
  <FrFiIcon
    type="filter-line"
    color={color}
    large={large}
    small={small}
    title={title}
  />
);

export const ArchiveIcon: React.FC<IconProps> = ({
  color,
  large,
  small,
  title,
}) => (
  <FrFiIcon
    type="archive-line"
    color={color}
    large={large}
    small={small}
    title={title}
  />
);

export const RecycleIcon: React.FC<IconProps> = ({
  color,
  large,
  small,
  title,
}) => (
  <FrFiIcon
    type="recycle-fill"
    color={color}
    large={large}
    small={small}
    title={title}
  />
);
