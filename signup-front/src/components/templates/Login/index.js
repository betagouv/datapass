import React from 'react';
import { hashToQueryParams } from '../../../lib';
import './index.css';
import {
  DATA_PROVIDER_ICONS,
  DATA_PROVIDER_LABELS,
} from '../../../config/data-provider-parameters';
import WelcomeMessage from './WelcomeMessage';
import ApiImpotParticulierFcSandboxWelcomeMessage from './ApiImpotParticulierFcSandboxWelcomeMessage';
import ApiImpotParticulierSandboxWelcomeMessage from './ApiImpotParticulierSandboxWelcomeMessage';
import Button from '../../atoms/Button';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

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
    case 'api_impot_particulier_fc_sandbox':
      return <ApiImpotParticulierFcSandboxWelcomeMessage />;
    case 'api_impot_particulier_sandbox':
      return <ApiImpotParticulierSandboxWelcomeMessage />;
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

export const loginUrl = `${BACK_HOST}/users/auth/api_gouv${hashToQueryParams({
  prompt: 'login',
})}`;

const createAccountUrl = `${BACK_HOST}/users/auth/api_gouv${hashToQueryParams({
  prompt: 'create_account',
})}`;

const LoginButtons = ({ isOnNewEnrollmentPage }) => (
  <div className="login-buttons">
    <form
      action={isOnNewEnrollmentPage ? loginUrl : createAccountUrl}
      method="post"
      style={{ margin: 0 }}
    >
      <Button outline large type="submit">
        {isOnNewEnrollmentPage ? 'Se connecter' : 'Créer un compte'}
      </Button>
    </form>
    <span className="login-buttons-or">ou</span>
    <form
      action={isOnNewEnrollmentPage ? createAccountUrl : loginUrl}
      method="post"
      style={{ margin: 0 }}
    >
      <Button large type="submit">
        {isOnNewEnrollmentPage ? 'Créer un compte' : 'Se connecter'}
      </Button>
    </form>
  </div>
);

export const Login = () => {
  const targetApi = (window.location.pathname.split('/')[1] || '').replace(
    /-/g,
    '_'
  );

  const isOnNewEnrollmentPage =
    !!DATA_PROVIDER_LABELS[targetApi] &&
    !window.location.pathname.split('/')[2];

  return (
    <section className="section-grey layout-full-page">
      <div className="container">
        <div className="panel" style={{ textAlign: 'center' }}>
          {DATA_PROVIDER_ICONS[targetApi] && (
            <img
              src={`/images/${DATA_PROVIDER_ICONS[targetApi]}`}
              alt={`Logo ${DATA_PROVIDER_LABELS[targetApi]}`}
              height="90"
            />
          )}
          <WelcomeMessageRouter
            targetApi={targetApi}
            isOnNewEnrollmentPage={isOnNewEnrollmentPage}
          />
          <LoginButtons isOnNewEnrollmentPage={isOnNewEnrollmentPage} />
        </div>
      </div>
    </section>
  );
};
