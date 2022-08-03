import { get, isEmpty } from 'lodash';
import { useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Alert from '../../../atoms/Alert';
import { FormContext } from '../../../templates/Form';
import { useAuth } from '../../AuthContext';
import CallToProcessedMessageNotification from './CallToProcessedMessageNotification';
import CallToWriteMessageNotification from './CallToWriteMessageNotification';
import EnrollmentHasCopiesNotification from './EnrollmentHasCopiesNotification';
import HasNextEnrollmentsNotification from './HasNextEnrollmentsNotification';

export const NotificationSubSection = () => {
  const location = useLocation();
  const {
    user,
    user: { email },
  } = useAuth();

  const {
    isUserEnrollmentLoading,
    enrollment: { id, team_members, target_api, acl = {} },
  } = useContext(FormContext);

  const isUserADemandeur = useMemo(() => {
    if (isEmpty(team_members)) {
      return false;
    }
    return team_members
      .filter(({ type }) => type === 'demandeur')
      .map(({ email }) => email)
      .includes(email);
  }, [team_members, email]);

  const isUserAnInstructor = useMemo(() => {
    const targetApiInstructorRole = `${target_api}:instructor`;
    const userInstructor = user.roles.includes(targetApiInstructorRole);

    return userInstructor;
  }, [user, target_api]);

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
          {isUserADemandeur && id && (
            <CallToWriteMessageNotification enrollmentId={id} />
          )}
          {isUserAnInstructor && id && (
            <CallToProcessedMessageNotification enrollment={id} />
          )}
        </>
      )}
    </>
  );
};

export default NotificationSubSection;
