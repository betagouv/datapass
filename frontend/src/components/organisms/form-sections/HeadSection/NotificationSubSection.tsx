import { get } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Alert, { AlertType } from '../../../atoms/Alert';
import { FormContext } from '../../../templates/Form';
import EnrollmentHasCopiesNotification from './EnrollmentHasCopiesNotification';
import HasNextEnrollmentsNotification from './HasNextEnrollmentsNotification';
import { pingInsee } from '../../../../services/external';

export const NotificationSubSection = () => {
  const location = useLocation();

  const {
    isUserEnrollmentLoading,
    enrollment: { id, acl = {} },
  } = useContext(FormContext)!;

  const [isApiAvailable, setIsApiAvailable] = useState(true);

  useEffect(() => {
    pingInsee().then((response) => {
      setIsApiAvailable(response);
    });
  }, []);

  return (
    <>
      {get(location, 'state.source') === 'copy-authorization-request' && (
        <Alert type={AlertType.info}>
          Vous trouverez ci-dessous une copie de votre habilitation initiale.
          Merci de vérifier que ces informations sont à jour puis cliquez sur
          "Soumettre la demande d’habilitation".
        </Alert>
      )}
      {!isUserEnrollmentLoading && (
        <>
          <EnrollmentHasCopiesNotification enrollmentId={id} />
          <HasNextEnrollmentsNotification enrollmentId={id} />
          {acl.update && (
            <Alert type={AlertType.info}>
              Pensez à enregistrer régulièrement vos modifications.
            </Alert>
          )}
        </>
      )}

      {!isApiAvailable && (
        <Alert type={AlertType.warning}>
          L'API Sirene de l'INSEE est actuellement indisponible, nous empêchant
          de réaliser certaines vérifications de sécurité. Merci de soumettre
          votre demande ultérieurement.
        </Alert>
      )}
    </>
  );
};

export default NotificationSubSection;
