import React, { useEffect, useState } from 'react';

import AuthIcon from '../../atoms/icons/auth';
import DemandeIcon from '../../atoms/icons/demande';
import HabilitationIcon from '../../atoms/icons/habilitation';
import TokenIcon from '../../atoms/icons/token';
import { getCachedMajorityPercentileProcessingTimeInDays } from '../../../services/stats';

const NextSteps = ({ targetApi, isService = false }) => {
  const [stat, setStat] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const {
        data: { majority_percentile_processing_time_in_days },
      } = await getCachedMajorityPercentileProcessingTimeInDays(targetApi);
      setStat(majority_percentile_processing_time_in_days);
    }

    fetchData();
  }, [targetApi]);

  return (
    <>
      <div className="next-steps">
        <div className="next-steps-center">
          <div>
            <AuthIcon />
          </div>
          <div>S’identifier avec MonComptePro</div>
        </div>
        <div>
          <div>
            <DemandeIcon />
          </div>
          <div>Remplir ma demande</div>
        </div>
        <div>
          <div>
            <HabilitationIcon />
          </div>
          <div>{isService ? 'Habilitation validée' : 'Être habilité'}</div>
        </div>
        <div>
          <div>
            <TokenIcon />
          </div>
          <div>{isService ? 'Accéder au service' : 'Recevoir son token'}</div>
        </div>
      </div>
      <div className="timeline">
        <div>
          <div className="step" />
        </div>
        <div>
          <div className="step" />
          {stat && <div className="time-indication">~ {stat} jour(s)</div>}
        </div>
        <div>
          <div className="step" />
        </div>
        <div>
          <div className="step" />
        </div>
      </div>
    </>
  );
};

export default NextSteps;
