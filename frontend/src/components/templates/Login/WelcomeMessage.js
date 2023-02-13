import React from 'react';
import { useDataProvider } from '../hooks/use-data-provider';

import NextSteps from './NextSteps';
import Button from '../../atoms/hyperTexts/Button';
import './WelcomeMessage.css';

const WelcomeMessage = ({
  isOnNewEnrollmentPage,
  targetApi,
  isService = false,
  newEnrollmentPageMessage,
}) => {
  const { label } = useDataProvider(targetApi);

  return (
    <>
      {isOnNewEnrollmentPage ? (
        <>
          <div className="fr-mb-3w">
            {newEnrollmentPageMessage || (
              <>
                Vous souhaitez accéder à l'<b>{label}</b>.
              </>
            )}
            <br /> Votre demande d’habilitation va se dérouler en 4 étapes.
            <NextSteps targetApi={targetApi} isService={isService} />
          </div>
        </>
      ) : (
        <>
          <p>
            DataPass, c’est le service qui vous permet de profiter facilement
            d’habilitations conformes entre administrations et d’accéder à des
            données en accès restreint.
          </p>
          <div className="fr-mb-3w"></div>
          <div className="new-login-container">
            <p>Pour découvrir les APis du service public</p>
            <Button class="fr-btn fr-btn--tertiary" href="https://api.gouv.fr">
              api.gouv.fr
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default WelcomeMessage;
