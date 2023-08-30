import React from 'react';
import { useDataProvider } from '../hooks/use-data-provider';

type WelcomeMessageProps = {
  isOnNewEnrollmentPage: boolean;
  targetApi: string;
  newEnrollmentPageMessage?: JSX.Element;
  newEnrollmentPageSubTitleMessage?: JSX.Element;
};

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({
  isOnNewEnrollmentPage,
  targetApi,
  newEnrollmentPageMessage,
  newEnrollmentPageSubTitleMessage,
}) => {
  const { label } = useDataProvider(targetApi);

  const getLabel = () => {
    const labelElement = <b>{label}</b>;
    if (label.startsWith('API')) {
      return <>l’{labelElement}</>;
    }

    return labelElement;
  };

  return (
    <>
      {isOnNewEnrollmentPage ? (
        <div className="fr-mb-3w">
          {newEnrollmentPageMessage || (
            <>Vous souhaitez accéder à {getLabel()}.</>
          )}
          {newEnrollmentPageSubTitleMessage || (
            <>
              <br /> Votre demande d’habilitation va se dérouler en 4 étapes.
            </>
          )}
        </div>
      ) : (
        <div className="fr-mb-3w">
          <p>
            DataPass, c’est le service qui vous permet de profiter facilement
            d’habilitations conformes entre administrations et d’accéder à des
            données en accès restreint.
          </p>
        </div>
      )}
    </>
  );
};

export default WelcomeMessage;
