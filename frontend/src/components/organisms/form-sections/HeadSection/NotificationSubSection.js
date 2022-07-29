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
    user: { email },
  } = useAuth();

  const {
    isUserEnrollmentLoading,
    enrollment: { id, team_members, acl = {} },
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

  // TODO add isUserAnInstructor userMemo to display 'CallToProcessedMessageNotification'
  // Get is user roles (`{target_api}:instructor`) ?
  // est ce que le user roles match avec la target_api de l'enrollment ?
  // Si oui
  // Display CallToProcessedMessageNotification
  // Si non ne pas display CallToProcessedMessageNotification

  // const isUserAnInstructor = useMemo(() => {
  //   if (isEmpty(user.roles.includes(`${targetApi}:'instructor'`))) {
  //     return false;
  //   }
  //   const enrollmentTargetApi = enrollment.target_api;
  //   const userRole = user.roles.includes(`${targetApi}:'instructor'`);
  //   const userEmail = userRole.map(({ email }) => email);
  //   const currentUser = userEmail.includes(email);
  //   return userRole;
  // }, [target_api, user, email]);

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
          {/* {isUserAnInstructor && id && ( */}
          <CallToProcessedMessageNotification enrollment={id} />
          {/* )} */}
        </>
      )}
    </>
  );
};

export default NotificationSubSection;
