export enum BadgeType {
  info = 'info',
  success = 'success',
  warning = 'warning',
  error = 'error',
  new = 'new',
}

type Props = {
  type?: BadgeType | null;
  icon?: boolean;
  small?: boolean;
  className?: string;
};

export const Badge: React.FC<Props> = ({
  type = '',
  small = false,
  icon = false,
  className = '',
  children,
}) => {
  className += ' fr-badge';
  if (type) {
    className += ` fr-badge--${type}`;
  }
  if (small) {
    className += ' fr-badge--sm';
  }
  if (!icon) {
    className += ` fr-badge--no-icon`;
  }

  return <p className={className}>{children}</p>;
};

export default Badge;
