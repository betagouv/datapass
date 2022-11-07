import React from 'react';
import { useDataProvider } from '../hooks/use-data-provider';

import NextSteps from './NextSteps';
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
            ,<br /> l’obtention de votre habilitation va se dérouler en 4 étapes
            :
            <NextSteps targetApi={targetApi} isService={isService} />
            <p>
              Merci de <b>créer un compte</b> pour déposer votre demande
              d’habilitation et suivre son traitement.
              <br /> Si vous possédez déjà un compte, identifiez-vous.
            </p>
          </div>
        </>
      ) : (
        <>
          <h3>Bienvenue sur DataPass !</h3>
          <p>
            DataPass délivre des habilitations pour accéder à l’ensemble des
            données protégées produites par l’État.{' '}
            <Link inline href="https://beta.gouv.fr/startups/datapass.html">
              En savoir plus
            </Link>
          </p>
          <div className="fr-mb-3w">
            Vous souhaitez suivre le traitement d’une habilitation, merci de
            vous identifier afin que nous puissions configurer vos accès.
          </div>
        </>
      )}
    </>
  );
};

export default WelcomeMessage;
