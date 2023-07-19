import './Badge.css';

export enum BadgeType {
  info = 'info',
  success = 'success',
  warning = 'warning',
  error = 'error',
  new = 'new',
  purple = 'purple-glycine',
}

type Props = {
  type?: BadgeType | null;
  icon?: boolean;
  small?: boolean;
  className?: string;
  round?: boolean;
  children: React.ReactNode;
};

export const Badge: React.FC<Props> = ({
  type = '',
  small = false,
  icon = false,
  round = false,
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
  if (round) {
    className += ` round`;
  }

  return <p className={className}>{children}</p>;
};

export default Badge;
