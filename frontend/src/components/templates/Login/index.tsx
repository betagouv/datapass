import MonComptePro from '../../atoms/MonComptePro';
import { useDataProvider } from '../hooks/use-data-provider';
import './style.css';
import WelcomeMessage from './WelcomeMessage';
import NextSteps from './NextSteps';
import Button from '../../atoms/hyperTexts/Button';
import { DataProviderType } from '../../../config/data-provider-configurations';
import { APISDGFIP } from '../../../config/data-provider-configurations';
import { APISFRANCECONNECTED } from '../../../config/data-provider-configurations';

type WelcomeMessageRouterProps = {
  targetApi: string;
  isOnNewEnrollmentPage: boolean;
};

const WelcomeMessageRouter: React.FC<WelcomeMessageRouterProps> = ({
  targetApi,
  isOnNewEnrollmentPage,
}) => {
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
      <div className="fr-grid-row">
        <div className="fr-col-5">
          <div className="left-panel-background">
            <div className="left-panel">
              <img
                src="/images/logo-welcome-page.svg"
                alt="Logo welcome page"
                className="fr-mt-10w"
              />
            </div>
          </div>
        </div>
        <div className="fr-col-7">
          <div className="fr-m-8w">
            <div className="panel">
              <h2>Bienvenue sur DataPass !</h2>
              <WelcomeMessageRouter
                targetApi={targetApi}
                isOnNewEnrollmentPage={isOnNewEnrollmentPage}
              />
              {isOnNewEnrollmentPage && (
                <NextSteps targetApi={targetApi} isService={isService} />
              )}
              <div className="fr-mb-3w">
                <div className="new-login-container">
                  <div className="login-button">
                    <p>Pour suivre vos demandes d’habilitation</p>
                    <MonComptePro />
                  </div>
                </div>
              </div>
              {!isOnNewEnrollmentPage && (
                <div className="fr-mb-3w">
                  <div className="new-login-container">
                    <p>Pour découvrir les APIs du service public</p>
                    <div className="fr-mb-2w">
                      <Button
                        className="fr-btn fr-btn--secondary"
                        href="https://api.gouv.fr"
                        icon="external-link"
                        iconRight
                      >
                        api.gouv.fr
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
