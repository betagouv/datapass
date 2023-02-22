import React from 'react';
import { useDataProvider } from '../hooks/use-data-provider';

const WelcomeMessage = ({
  isOnNewEnrollmentPage,
  targetApi,
  newEnrollmentPageMessage,
  newEnrollmentPageSubTitleMessage,
}) => {
  const { label } = useDataProvider(targetApi);

  return (
    <>
      {isOnNewEnrollmentPage ? (
        <div className="fr-mb-3w">
          {newEnrollmentPageMessage || (
            <>
              Vous souhaitez accéder à l'<b>{label}</b>.
            </>
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
