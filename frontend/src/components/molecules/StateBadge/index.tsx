import { Enrollment } from '../../../config';
import { EnrollmentEvent } from '../../../config/event-configuration';
import Badge, { BadgeType } from '../../atoms/hyperTexts/Badge';
import { RecycleIcon } from '../../atoms/icons/fr-fi-icons';

type Props = {
  enrollment: Enrollment;
};

const StateBadge: React.FC<Props> = ({ enrollment }) => {
  if (
    enrollment.events?.find(
      (event) => event.name === EnrollmentEvent.opinion_comment_created
    )
  ) {
    return (
      <Badge type={BadgeType.info} icon={true} small={true}>
        Avis reçu
      </Badge>
    );
  }

  if (
    enrollment.events?.find(
      (event) => event.name === EnrollmentEvent.opinion_created
    )
  ) {
    return (
      <Badge type={BadgeType.new} icon={true} small={true}>
        Avis demandé
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
