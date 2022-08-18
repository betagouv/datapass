import { isEmpty } from 'lodash';
import { useContext, useMemo } from 'react';
import { markEventsAsProcessed } from '../../../../services/enrollments';
import AlertWithTwoButtons from '../../../molecules/notification-with-buttons/AlertWithTwoButtons';
import { OpenMessagePromptContext } from '../../../templates/Form/OpenMessagePromptContextProvider';
import useListItemNavigation from '../../../templates/hooks/use-list-item-navigation';
import { useAuth } from '../../AuthContext';

const CallToProcessedMessageNotification = ({
  enrollmentId,
  events,
  target_api,
}) => {
  const { onClick: openMessagePrompt } = useContext(OpenMessagePromptContext);
  const { goBackToList } = useListItemNavigation();
  const {
    user,
    user: { email },
  } = useAuth();

  const markAsProcessed = async () => {
    await markEventsAsProcessed({ enrollmentId });
    goBackToList();
  };

  const isUserAnInstructor = useMemo(() => {
    const targetApiInstructorRole = `${target_api}:instructor`;

    return user.roles.includes(targetApiInstructorRole);
  }, [user, target_api]);

  const isEventNotifyFromDemandeur = useMemo(() => {
    const filteredEvents = events.filter((event) => {
      return (
        event.name === 'notify' &&
        event.processed_at === null &&
        event.user.email !== email
      );
    });

    if (isEmpty(filteredEvents)) {
      return false;
    }

    return filteredEvents;
  }, [events, email]);

  if (!isUserAnInstructor || !enrollmentId || !isEventNotifyFromDemandeur)
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
