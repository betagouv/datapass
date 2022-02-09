import React from 'react';

import './ApiImpotParticulierWelcomeMessage.css';
import Stepper from '../../molecules/Stepper';

const ApiImpotParticulierFcSandboxWelcomeMessage = () => (
  <>
    <h3>Habilitation à l’API Impôt particulier</h3>
    <p>La procédure consiste en 3 demandes d’habilitation distinctes :</p>
    <Stepper
      steps={[
        'franceconnect',
        'api_impot_particulier_fc_sandbox',
        'api_impot_particulier_fc_production',
      ]}
    />
    <ol className="steps-form-description">
      <li>
        L’équipe FranceConnect de la{' '}
        <abbr title="Direction Interministérielle du Numérique">DINUM</abbr>{' '}
        valide votre accès à <b>l’espace partenaire FranceConnect</b> vous
        permettant de procéder à la configuration technique du bouton
        FranceConnect et de récupérer l’identité pivot.
      </li>
      <li>
        L’équipe en charge de l’API Impôt particulier à la{' '}
        <abbr title="Direction Générale des Finances Publiques">DGFiP</abbr>{' '}
        valide votre accès à <b>l' API Manager (APIM) DGFiP</b> vous permettant
        de récupérer des données d’imposition de test avec votre bouton
        FranceConnect.
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
      Pour commencer, merci de créer un compte pour déposer votre demande
      d’habilitation et suivre son traitement.
    </p>
  </>
);

export default ApiImpotParticulierFcSandboxWelcomeMessage;
