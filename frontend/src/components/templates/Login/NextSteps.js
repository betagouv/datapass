import React, { useEffect, useState } from 'react';

import AuthIcon from '../../atoms/icons/auth';
import DemandeIcon from '../../atoms/icons/demande';
import HabilitationIcon from '../../atoms/icons/habilitation';
import TokenIcon from '../../atoms/icons/token';
import { getCachedMajorityPercentileProcessingTimeInDays } from '../../../services/stats';
import { APISDGFIP } from './index';
import { APISFRANCECONNECTED } from './index';

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
        <div>
          <div>
            <AuthIcon />
          </div>
          <div>S’identifier avec MonComptePro</div>
        </div>
        <div>
          <div>
            <DemandeIcon />
          </div>
          <div>
            {APISDGFIP.find((apiLabel) => apiLabel === targetApi)
              ? 'Être habilité au bac à sable'
              : APISFRANCECONNECTED.find((apiLabel) => apiLabel === targetApi)
              ? 'Être habilité à FranceConnect'
              : 'Remplir ma demande'}
          </div>
        </div>
        <div>
          <div>
            <HabilitationIcon />
          </div>
          <div>
            {APISDGFIP.find((apiLabel) => apiLabel === targetApi)
              ? 'Être habilité à la production'
              : APISFRANCECONNECTED.find((apiLabel) => apiLabel === targetApi)
              ? 'Être habilité à `{targetApi}`'
              : 'Être habilité'}
          </div>
        </div>
        <div>
          <div>
            <TokenIcon />
          </div>
          <div>
            {isService ? 'Accéder au service' : 'Obtenir le token d’accès'}
          </div>
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
