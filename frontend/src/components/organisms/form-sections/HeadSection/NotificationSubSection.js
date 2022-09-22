import { get } from 'lodash';
import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Alert from '../../../atoms/Alert';
import { FormContext } from '../../../templates/Form';
import CallToProcessedMessageNotification from './CallToProcessedMessageNotification';
import CallToWriteMessageNotification from './CallToWriteMessageNotification';
import EnrollmentHasCopiesNotification from './EnrollmentHasCopiesNotification';
import HasNextEnrollmentsNotification from './HasNextEnrollmentsNotification';

export const NotificationSubSection = () => {
  const location = useLocation();

  const {
    isUserEnrollmentLoading,
    enrollment: {
      id,
      team_members,
      target_api,
      acl = {},
      events = {},
      notify_events_from_demandeurs_count,
    },
  } = useContext(FormContext);

  return (
    <>
      {!isUserEnrollmentLoading && !id && (
        <Alert type="error" title="Service momentanément indisponible">
          Suite à une maintenance chez nos partenaires de l’INSEE, la soumission
          de nouvelles demandes est perturbée aujourd’hui. Le service sera
          progressivement rétabli pour un retour à la normale ce vendredi 23
          septembre. Veuillez nous excuser pour la gêne occasionnée.
        </Alert>
      )}
      {get(location, 'state.source') === 'copy-authorization-request' && (
        <Alert type="info">
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
          <CallToWriteMessageNotification
            aclNotify={acl.notify}
            team_members={team_members}
          />
          <CallToProcessedMessageNotification
            enrollmentId={id}
            aclNotify={acl.notify}
            team_members={team_members}
            events={events}
            target_api={target_api}
            messageCount={notify_events_from_demandeurs_count}
          />
        </>
      )}
    </>
  );
};

export default NotificationSubSection;
