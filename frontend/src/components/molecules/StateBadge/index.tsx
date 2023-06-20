import Badge, { BadgeType } from '../../atoms/hyperTexts/Badge';
import { Enrollment } from '../../templates/InstructorEnrollmentList';

type Props = {
  enrollment: Enrollment;
};

const StateBadge: React.FC<Props> = ({ enrollment }) => {
  if (enrollment.requested_changes_have_been_done) {
    return (
      <Badge type={BadgeType.info} icon={true} small={true}>
        Modifications effectuées
      </Badge>
    );
  }

  if (!enrollment.consulted_by_instructor) {
    return (
      <Badge type={BadgeType.new} icon={true} small={true}>
        Nouveau
      </Badge>
    );
  }

  return null;
};

export default StateBadge;
