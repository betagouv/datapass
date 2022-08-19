import { isEmpty } from 'lodash';
import { useContext, useMemo } from 'react';
import { markEventsAsProcessed } from '../../../../services/enrollments';
import AlertWithTwoButtons from '../../../molecules/notification-with-buttons/AlertWithTwoButtons';
import { OpenMessagePromptContext } from '../../../templates/Form/OpenMessagePromptContextProvider';
import useListItemNavigation from '../../../templates/hooks/use-list-item-navigation';
import { useAuth } from '../../AuthContext';

const CallToProcessedMessageNotification = ({
  enrollmentId,
  aclNotify,
  team_members = [],
  events,
  target_api,
}) => {
  const { onClick: openMessagePrompt } = useContext(OpenMessagePromptContext);
  const { goBackToList } = useListItemNavigation();
  const { getIsUserAnInstructor } = useAuth();

  const markAsProcessed = async () => {
    await markEventsAsProcessed({ id: enrollmentId });
    goBackToList();
  };

  const isUserAnInstructor = useMemo(() => {
    return getIsUserAnInstructor(target_api);
  }, [getIsUserAnInstructor, target_api]);

  const isThereAnyNotifyEventFromDemandeur = useMemo(() => {
    const demandeurEmails = team_members
      .filter(({ type }) => type === 'demandeur')
      .map(({ email }) => email);
    const filteredEvents = events.filter((event) => {
      return (
        event.name === 'notify' &&
        event.processed_at === null &&
        demandeurEmails.includes(event.user.email)
      );
    });

    if (isEmpty(filteredEvents)) {
      return false;
    }

    return filteredEvents;
  }, [events, team_members]);

  if (!isUserAnInstructor || !aclNotify || !isThereAnyNotifyEventFromDemandeur)
    return null;

  return (
    <AlertWithTwoButtons
      title="Message"
      labelAction1="Rédiger un message"
      labelAction2="Marquer comme traité"
      onClickAction1={openMessagePrompt}
      onClickAction2={markAsProcessed}
    >
      Un ou plusieurs messages sont en attente de traitement
    </AlertWithTwoButtons>
  );
};

export default CallToProcessedMessageNotification;
