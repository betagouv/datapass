import {
  EnrollmentStatus,
  INSTRUCTOR_STATUS_LABELS,
  STATUS_TO_BADGE_TYPE,
  USER_STATUS_LABELS,
} from '../../../config/status-parameters';
import Badge from '../../atoms/hyperTexts/Badge';

type Props = {
  status: EnrollmentStatus;
  userType: 'user' | 'instructor';
};

export const StatusBadge: React.FC<Props> = ({ status, userType = 'user' }) => {
  const getStatusLabelsEnum = () => {
    switch (userType) {
      case 'user':
        return USER_STATUS_LABELS;

      case 'instructor':
        return INSTRUCTOR_STATUS_LABELS;

      default:
        return USER_STATUS_LABELS;
    }
  };

  const STATUS_LABEL_ENUM = getStatusLabelsEnum();

  return (
    <Badge type={STATUS_TO_BADGE_TYPE[status]}>
      {STATUS_LABEL_ENUM[status]}
    </Badge>
  );
};

export default Badge;
