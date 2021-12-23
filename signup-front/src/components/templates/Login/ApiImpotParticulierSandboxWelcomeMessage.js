import React from 'react';

import './ApiImpotParticulierWelcomeMessage.css';
import Stepper from '../../molecules/Stepper';

const ApiImpotParticulierSandboxWelcomeMessage = () => (
  <>
    <h3>Demande d’accès à « API Impôt particulier »</h3>
    <p>La procédure consiste en 2 demandes d’accès distinctes :</p>
    <Stepper
      steps={[
        'api_impot_particulier_sandbox',
        'api_impot_particulier_production',
      ]}
    />
    <ol className="steps-form-description">
      <li>
        L’équipe en charge de l’API Impôt particulier à la{' '}
        <abbr title="Direction Générale des Finances Publiques">DGFiP</abbr>{' '}
        valide votre accès à <b>l' API Manager (APIM) DGFiP</b> vous permettant
        de récupérer des données d’imposition de test.
      </li>
      <li>
        L’équipe API Impôt particulier valide votre accès aux{' '}
        <b>
          données de production via l'
          <abbr title="API Manager">APIM</abbr> DGFiP
        </b>
        .
      </li>
    </ol>
    <p>
      Pour commencer, merci de créer un compte pour déposer votre demande et
      suivre son traitement.
    </p>
  </>
);

export default ApiImpotParticulierSandboxWelcomeMessage;
