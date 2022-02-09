import React, { useContext } from 'react';
import { get } from 'lodash';
import EnrollmentHasCopiesNotification from './EnrollmentHasCopiesNotification';
import Alert from '../../../atoms/Alert';
import { FormContext } from '../../../templates/Form';
import { useLocation } from 'react-router-dom';
import HasNextEnrollmentsNotification from './HasNextEnrollmentsNotification';

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
          <Alert type="warning">
            Votre organisation a déjà une habilitation à une ou plusieurs
            démarches de la DILA :
            <span>
              {' '}
              <a href={`/authorization-request/1234`}>l'habilitation #7421</a>
            </span>
            . Merci de la consulter avant de remplir ce formulaire : toute
            habilitation demandée en doublon entraînera le refus de votre
            requête.
          </Alert>
        </>
      )}
    </>
  );
};

export default NotificationSubSection;
