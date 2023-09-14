import {
  STATUS_TO_BADGE_TYPE,
  STATUS_LABELS,
} from '../../../config/status-parameters';
import Badge from '../../atoms/hyperTexts/Badge';

type Props = {
  status: EnrollmentStatus;
  icon?: boolean;
};

export const StatusBadge: React.FC<Props> = ({ status, icon = false }) => {
  return (
    <Badge icon={icon} type={STATUS_TO_BADGE_TYPE[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  );
};

export default Badge;
