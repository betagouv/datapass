import { chain } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import {
  EnrollmentStatus,
  STATUS_LABELS,
} from '../../../config/status-parameters';
import { getCachedMajorityPercentileProcessingTimeInDays } from '../../../services/stats';
import Alert, { AlertType } from '../../atoms/Alert';
import { EventItem } from '../../organisms/form-sections/HeadSection/ActivityFeed';
import { Enrollment } from '../../../config';

type ActivityFeedWrapperProps = {
  events: Enrollment['events'];
  status: EnrollmentStatus;
  target_api: string;
};

const ActivityFeedWrapper: React.FC<ActivityFeedWrapperProps> = ({
  events,
  status,
  target_api,
}) => {
  const [
    majorityPercentileProcessingTimeInDays,
    setMajorityPercentileTimeInDays,
  ] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      const {
        data: { majority_percentile_processing_time_in_days },
      } = await getCachedMajorityPercentileProcessingTimeInDays(target_api);
      setMajorityPercentileTimeInDays(
        majority_percentile_processing_time_in_days
      );
    }

    if (status === 'submitted') {
      fetchStats();
    }
  }, [status, target_api]);

  const {
    comment = '',
    name: lastEventName,
    user,
    diff,
    created_at,
    updated_at,
    id,
  } = useMemo(
    () => chain(events).sortBy('updated_at').last().value() || {},
    [events]
  );

  if (
    ['draft', 'changes_requested'].includes(status) &&
    ['request_changes'].includes(lastEventName)
  ) {
    return (
      <Alert title={STATUS_LABELS[status]} type={AlertType.warning}>
        Votre demande d’habilitation est incomplète et requiert les
        modifications suivantes :
        <div style={{ margin: '1rem 0' }}>
          <EventItem
            id={id}
            updated_at={updated_at}
            comment={comment}
            name={lastEventName}
            created_at={created_at}
            user={user}
            diff={diff}
          />
        </div>
      </Alert>
    );
  }

  if (
    ['draft', 'changes_requested'].includes(status) &&
    ['create', 'update', 'reminder', 'reminder_before_archive'].includes(
      lastEventName
    )
  ) {
    return (
      <Alert title={STATUS_LABELS[status]}>
        <p>
          Votre demande d’habilitation est actuellement en cours d’édition.
          Notre service juridique pourra la consulter lorsque vous cliquerez sur
          "Soumettre la demande d’habilitation".
        </p>
      </Alert>
    );
  }

  if (status === 'submitted' && majorityPercentileProcessingTimeInDays > 0) {
    return (
      <Alert title={STATUS_LABELS[status]}>
        La majorité des demandes d’habilitation des 6 derniers mois reçoivent
        une réponse en moins de{' '}
        <b>{majorityPercentileProcessingTimeInDays} jours</b>.
      </Alert>
    );
  }

  return null;
};

export default ActivityFeedWrapper;
