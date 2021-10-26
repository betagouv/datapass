import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import ActivityFeed from '../Form/ActivityFeed';
import { getCachedMajorityPercentileProcessingTimeInDays } from '../../../services/stats';

const ActivityFeedWrapper = ({ events, status, target_api }) => {
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

    if (status === 'sent') {
      fetchStats();
    }
  }, [status, target_api]);

  if (status === 'pending') {
    return (
      <div className="notification">
        <p>
          Votre demande est actuellement en cours d’édition. Notre service
          juridique pourra la consulter lorsque vous cliquerez sur "Soumettre la
          demande".
        </p>
      </div>
    );
  }

  if (status === 'sent' && majorityPercentileProcessingTimeInDays > 0) {
    return (
      <div className="notification">
        La majorité des demandes des 6 derniers mois reçoivent une réponse en
        moins de <b>{majorityPercentileProcessingTimeInDays} jours</b>.
      </div>
    );
  }

  if (status === 'modification_pending') {
    return (
      <div className="notification warning">
        Votre demande est incomplète et requiert les modifications suivantes :
        <div style={{ margin: '1em 0' }}>
          {events.length > 0 && <ActivityFeed events={events} />}
        </div>
      </div>
    );
  }

  return null;
};

ActivityFeedWrapper.propTypes = {
  events: PropTypes.array.isRequired,
  status: PropTypes.string.isRequired,
  target_api: PropTypes.string.isRequired,
};

export default ActivityFeedWrapper;
