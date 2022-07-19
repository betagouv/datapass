import { get } from 'lodash';
import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Alert from '../../../atoms/Alert';
import { FormContext } from '../../../templates/Form';
import EnrollmentHasCopiesNotification from './EnrollmentHasCopiesNotification';
import HasNextEnrollmentsNotification from './HasNextEnrollmentsNotification';
import MessageFeed from './MessageFeed';

export const NotificationSubSection = () => {
  const location = useLocation();

  const {
    isUserEnrollmentLoading,
    enrollment: { id, acl = {} },
  } = useContext(FormContext);

  return (
    <>
      {get(location, 'state.source') === 'copy-authorization-request' && (
        <Alert className="info">
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
            <Alert type="info">
              Pensez à enregistrer régulièrement vos modifications.
            </Alert>
          )}
          {id && <MessageFeed enrollmentId={id} />}
        </>
      )}
    </>
  );
};

export default NotificationSubSection;
