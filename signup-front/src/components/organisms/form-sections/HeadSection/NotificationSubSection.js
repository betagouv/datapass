import React, { useContext } from 'react';
import { get } from 'lodash';
import EnrollmentHasCopiesNotification from './EnrollmentHasCopiesNotification';
import Alert from '../../../atoms/Alert';
import { FormContext } from '../../../templates/Form';
import { withRouter } from 'react-router-dom';
import HasNextEnrollmentsNotification from './HasNextEnrollmentsNotification';

export const NotificationSubSection = ({ location }) => {
  const {
    isUserEnrollmentLoading,
    enrollment: { id, acl = {} },
  } = useContext(FormContext);

  return (
    <>
      {get(location, 'state.source') === 'copy-authorization-request' && (
        <Alert className="info">
          Vous trouverez ci-dessous une copie de votre demande initiale. Merci
          de vérifier que ces informations sont à jour puis cliquez sur
          "Soumettre la demande".
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
        </>
      )}
    </>
  );
};

export default withRouter(NotificationSubSection);
