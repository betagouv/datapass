import { isEmpty } from 'lodash';
import { useContext, useMemo } from 'react';
import { isUserADemandeur } from '../../../../lib';
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
  messageCount,
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
    const filteredEvents = events.filter(
      ({ name, processed_at, user: { email } }) => {
        return (
          name === 'notify' &&
          processed_at === null &&
          isUserADemandeur({ team_members, user_email: email })
        );
      }
    );

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
      Vous avez{' '}
      {messageCount > 1
        ? `${messageCount} messages`
        : `${messageCount} message`}{' '}
      en attente de traitement
    </AlertWithTwoButtons>
  );
};

export default CallToProcessedMessageNotification;
