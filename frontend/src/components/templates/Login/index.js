import React from 'react';
import Alert from '../../atoms/Alert';
import MonComptePro from '../../atoms/MonComptePro';
import { useDataProvider } from '../hooks/use-data-provider';
import './style.css';
import WelcomeMessage from './WelcomeMessage';
import NextSteps from './NextSteps';
import Button from '../../atoms/hyperTexts/Button';
import { DataProviderType } from '../../../config/data-provider-configurations';

export const APISDGFIP = [
  'api_impot_particulier_sandbox',
  'api_impot_particulier_production',
  'api_r2p_sandbox',
  'api_r2p_production',
  'api_hermes_sandbox',
  'api_hermes_production',
  'api_e_contacts_sandbox',
  'api_e_contacts_production',
  'api_opale_sandbox',
  'api_opale_production',
  'api_mire_sandbox',
  'api_mire_production',
  'api_ocfi_sandbox',
  'api_ocfi_production',
  'api_e_pro_sandbox',
  'api_e_pro_production',
  'api_robf_sandbox',
  'api_robf_production',
  'api_cpr_pro_sandbox',
  'api_cpr_pro_production',
  'api_infinoe_sandbox',
  'api_infinoe_production',
  'api_ficoba_sandbox',
  'api_ficoba_production',
  'api_ensu_documents_sandbox',
  'api_ensu_documents_production',
  'api_satelit_sandbox',
  'api_satelit_production',
  'api_sfip_sandbox',
  'api_sfip_production',
];

export const APISFRANCECONNECTED = [
  'api_impot_particulier_fc_sandbox',
  'api_impot_particulier_fc_production',
  'api_droits_cnam',
  'api_prestations_sociales',
  'api_statut_etudiant',
  'api_statut_demandeur_emploi',
  'api_statut_etudiant_boursier',
  'api_indemnisation_pole_emploi',
];

const WelcomeMessageRouter = ({ targetApi, isOnNewEnrollmentPage }) => {
  if (!isOnNewEnrollmentPage) {
    return (
      <WelcomeMessage
        isOnNewEnrollmentPage={isOnNewEnrollmentPage}
        targetApi={targetApi}
      />
    );
  }

  if (APISDGFIP.includes(targetApi)) {
    return (
      <WelcomeMessage
        isOnNewEnrollmentPage={isOnNewEnrollmentPage}
        target_api={targetApi}
        newEnrollmentPageSubTitleMessage={
          <>
            <br />
            Cette procédure nécessite <b>2 demandes</b> d’habilitation
            distinctes :
          </>
        }
      />
    );
  }

  if (APISFRANCECONNECTED.includes(targetApi)) {
    return (
      <WelcomeMessage
        isOnNewEnrollmentPage={isOnNewEnrollmentPage}
        targetApi={targetApi}
        newEnrollmentPageSubTitleMessage={
          <>
            <br />
            Cette procédure nécessite <b>2 demandes</b> d’habilitation
            distinctes :
          </>
        }
      />
    );
  }

  switch (targetApi) {
    case 'aidants_connect':
      return (
        <WelcomeMessage
          isOnNewEnrollmentPage={isOnNewEnrollmentPage}
          targetApi={targetApi}
          newEnrollmentPageMessage={
            <>
              Vous souhaitez habiliter des aidants de votre structure à{' '}
              <b>Aidants Connect</b>.
            </>
          }
        />
      );
    case 'hubee_portail':
      return (
        <WelcomeMessage
          isOnNewEnrollmentPage={isOnNewEnrollmentPage}
          targetApi={targetApi}
          newEnrollmentPageMessage={
            <>
              Vous souhaitez abonner votre structure à une démarche en ligne sur{' '}
              <b>HubEE</b>.
            </>
          }
        />
      );
    case 'hubee_portail_dila':
      return (
        <WelcomeMessage
          isOnNewEnrollmentPage={isOnNewEnrollmentPage}
          targetApi={targetApi}
          newEnrollmentPageMessage={
            <>
              Vous souhaitez abonner votre structure à une démarche en ligne sur{' '}
              <b>HubEE</b>.
            </>
          }
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

  const { type } = useDataProvider(targetApi);
  const isService = type === DataProviderType.service;

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
        <div className="fr-col-7">
          <div className="fr-m-8w">
            <div className="panel" style={{ textAlign: 'left' }}>
              <h2>Bienvenue sur DataPass !</h2>
              <WelcomeMessageRouter
                targetApi={targetApi}
                isOnNewEnrollmentPage={isOnNewEnrollmentPage}
              />
              {isOnNewEnrollmentPage && (
                <NextSteps targetApi={targetApi} isService={isService} />
              )}
              <div className="new-login-container">
                <div className="login-button">
                  <p>Pour suivre vos demandes d’habilitation</p>
                  <MonComptePro />
                </div>
              </div>
              {!isOnNewEnrollmentPage && (
                <div className="new-login-container">
                  <p>Pour découvrir les APIs du service public</p>
                  <Button
                    className="fr-btn fr-btn--secondary"
                    href="https://api.gouv.fr"
                    icon="external-link"
                    iconRight
                  >
                    api.gouv.fr
                  </Button>
                  <p></p>
                </div>
              )}
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
