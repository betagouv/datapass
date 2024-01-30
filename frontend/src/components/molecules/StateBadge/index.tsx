import { Enrollment } from '../../../config';
import { EnrollmentStatus } from '../../../config/status-parameters';
import { isReopenned } from '../../../lib';
import Badge, { BadgeType } from '../../atoms/hyperTexts/Badge';
import { RecycleIcon } from '../../atoms/icons/fr-fi-icons';

type Props = {
  enrollment: Enrollment;
};

const StateBadge: React.FC<Props> = ({ enrollment }) => {
  if (
    isReopenned(enrollment) &&
    enrollment.status !== EnrollmentStatus.validated
  ) {
    return (
      <Badge type={BadgeType.purple} small={true}>
        Demande de mise à jour
      </Badge>
    );
  }

  if (enrollment.requested_changes_have_been_done) {
    return (
      <p className="fr-badge fr-badge--sm fr-badge--blue-cumulus">
        <RecycleIcon small />
        &nbsp;Modifié
      </p>
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
