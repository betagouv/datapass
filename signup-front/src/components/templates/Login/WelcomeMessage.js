import React from 'react';

import { DATA_PROVIDER_LABELS } from '../../../config/data-provider-emails';
import NextSteps from './NextSteps';

const WelcomeMessage = ({
  isOnNewEnrollmentPage,
  targetApi,
  isService = false,
  newEnrollmentPageMessage,
}) => (
  <>
    {isOnNewEnrollmentPage ? (
      <>
        <h3>Bienvenue !</h3>
        <div className="call-to-action">
          {newEnrollmentPageMessage ||
            `Vous souhaitez connecter votre service en ligne à « ${DATA_PROVIDER_LABELS[targetApi]} »`}
          , l’obtention de votre habilitation va se dérouler en 4 étapes :
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
        <h3>Bienvenue sur DataPass !</h3>
        <p>
          Vous cherchez à accéder à des données protégées pour construire un
          service en ligne innovant, DataPass remplace les conventions et vous
          délivre un passe vers la donnée.{' '}
          <a href="https://beta.gouv.fr/startups/datapass.html">
            En savoir plus
          </a>
        </p>
        <div className="call-to-action">
          Vous souhaitez suivre le traitement d’une demande d’habilitation,
          merci de vous identifier afin que nous puissions configurer vos accès.
        </div>
      </>
    )}
  </>
);

export default WelcomeMessage;
