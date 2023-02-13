import React from 'react';
import { useDataProvider } from '../hooks/use-data-provider';

import NextSteps from './NextSteps';
import './WelcomeMessage.css';
import MonComptePro from '../../atoms/MonComptePro';
import { ExternalLinkIcon } from '../../atoms/icons/fr-fi-icons';
import Link from '../../atoms/hyperTexts/Link';

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
                Vous souhaitez connecter votre service en ligne à <b>{label}</b>
              </>
            )}
            <br /> Votre demande d’habilitation va se dérouler en 4 étapes :
            <NextSteps targetApi={targetApi} isService={isService} />
            {/* <p>
              Merci de <b>créer un compte</b> pour déposer votre demande
              d’habilitation et suivre son traitement.
              <br /> Si vous possédez déjà un compte, identifiez-vous.
            </p> */}
          </div>
        </>
      ) : (
        <>
          <p>
            DataPass, c’est le service qui vous permet de profiter facilement
            d’habilitations conformers entre administrations et d’accéder à des
            données et services en accès restreint.
          </p>
          <div className="apis">
            <p>Pour suivre vos demandes d’habilitation</p>
            <MonComptePro />
          </div>
          <div className="fr-mb-3w"></div>
          <div className="apis">
            <p>Pour découvrir les APis du service public</p>
            <button
              icon="ExternalLinkIcon"
              iconRight
              class="fr-btn fr-btn--tertiary"
              href={`https://api.gouv.fr/`}
            >
              api.gouv.fr
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default WelcomeMessage;
