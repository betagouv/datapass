import React, { useEffect, useState } from 'react';

import AuthIcon from '../../atoms/icons/auth';
import DemandeIcon from '../../atoms/icons/demande';
import HabilitationIcon from '../../atoms/icons/habilitation';
import TokenIcon from '../../atoms/icons/token';
import { getCachedMajorityPercentileProcessingTimeInDays } from '../../../services/stats';
import { APISDGFIP } from './index';
import { APISFRANCECONNECTED } from './index';
import { useDataProvider } from '../hooks/use-data-provider';

const NextSteps = ({ targetApi, isService = false }) => {
  const [stat, setStat] = useState(null);

  const { label: targetApiLabel } = useDataProvider(targetApi);

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
            {APISDGFIP.find((targetApiID) => targetApiID === targetApi)
              ? 'Être habilité au bac à sable'
              : APISFRANCECONNECTED.find(
                  (targetApiID) => targetApiID === targetApi
                )
              ? 'Être habilité à FranceConnect'
              : 'Remplir ma demande'}
          </div>
        </div>
        <div>
          <div>
            <HabilitationIcon />
          </div>
          <div>
            {APISDGFIP.find((targetApiID) => targetApiID === targetApi)
              ? 'Être habilité à la production'
              : APISFRANCECONNECTED.find(
                  (targetApiID) => targetApiID === targetApi
                )
              ? `Être habilité à ${targetApiLabel}`
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
