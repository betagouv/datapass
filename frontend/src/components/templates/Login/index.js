import React from 'react';
import Alert from '../../atoms/Alert';
import MonComptePro from '../../atoms/MonComptePro';
import { useDataProvider } from '../hooks/use-data-provider';
import ApiImpotParticulierFcSandboxWelcomeMessage from './ApiImpotParticulierFcSandboxWelcomeMessage';
import ApiImpotParticulierSandboxWelcomeMessage from './ApiImpotParticulierSandboxWelcomeMessage';
import './style.css';
import WelcomeMessage from './WelcomeMessage';

const WelcomeMessageRouter = ({ targetApi, isOnNewEnrollmentPage }) => {
  if (!isOnNewEnrollmentPage) {
    return (
      <WelcomeMessage
        isOnNewEnrollmentPage={isOnNewEnrollmentPage}
        targetApi={targetApi}
      />
    );
  }
  switch (targetApi) {
    // case 'api_impot_particulier_fc_sandbox':
    //   return <ApiImpotParticulierFcSandboxWelcomeMessage />;
    // case 'api_impot_particulier_sandbox':
    //   return <ApiImpotParticulierSandboxWelcomeMessage />;
    case 'api_impot_particulier_sandbox' && 'api_impot_particulier_production':
      return (
        <WelcomeMessage
          isOnNewEnrollmentPage={isOnNewEnrollmentPage}
          target_api={targetApi}
        />
      );
    case 'franceconnect':
      return (
        <WelcomeMessage
          isOnNewEnrollmentPage={isOnNewEnrollmentPage}
          targetApi={targetApi}
          newEnrollmentPageMessage="Vous souhaitez intégrer le bouton d’identification FranceConnect à votre service en ligne"
        />
      );
    case 'aidants_connect':
      return (
        <WelcomeMessage
          isOnNewEnrollmentPage={isOnNewEnrollmentPage}
          targetApi={targetApi}
          isService
          newEnrollmentPageMessage="Vous souhaitez habiliter des aidants de votre structure à Aidants Connect"
        />
      );
    case 'hubee_portail':
      return (
        <WelcomeMessage
          isOnNewEnrollmentPage={isOnNewEnrollmentPage}
          targetApi={targetApi}
          isService
          newEnrollmentPageMessage="Vous souhaitez abonner votre structure à une démarche en ligne sur HubEE."
        />
      );
    case 'hubee_portail_dila':
      return (
        <WelcomeMessage
          isOnNewEnrollmentPage={isOnNewEnrollmentPage}
          targetApi={targetApi}
          isService
          newEnrollmentPageMessage="Vous souhaitez abonner votre structure à une démarche en ligne sur HubEE"
        />
      );

    default:
      return (
        <WelcomeMessage
          isOnNewEnrollmentPage={isOnNewEnrollmentPage}
          targetApi={targetApi}
        />
      );
  }
};

export const Login = () => {
  const targetApi = (window.location.pathname.split('/')[1] || '').replace(
    /-/g,
    '_'
  );

  const { label } = useDataProvider(targetApi);

  const isOnNewEnrollmentPage =
    !!label && !window.location.pathname.split('/')[2];

  return (
    <section className="fr-container--fluid">
      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col-5">
          <div style={{ backgroundColor: '#F6F6F6', height: '100%' }}>
            <div
              style={{
                textAlign: 'center',
              }}
            >
              <img
                src={`/images/logo-welcome-page.svg`}
                alt={`Logo welcome page`}
                className="fr-mt-10w"
              />
            </div>
          </div>
        </div>
        <div class="fr-col-7">
          <div className="fr-m-8w">
            <div className="panel" style={{ textAlign: 'left' }}>
              <h2>Bienvenue sur DataPass !</h2>
              <WelcomeMessageRouter
                targetApi={targetApi}
                isOnNewEnrollmentPage={isOnNewEnrollmentPage}
              />
              <div className="new-login-container">
                <div className="login-button">
                  <p>Pour suivre vos demandes d’habilitation</p>
                  <MonComptePro />
                </div>
              </div>
              <Alert type="info" title="Votre connexion évolue">
                <p>
                  Votre compte DataPass devient MonComptePro.
                  <br />
                  Votre email et votre mot de passe restent inchangés.
                </p>
              </Alert>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
