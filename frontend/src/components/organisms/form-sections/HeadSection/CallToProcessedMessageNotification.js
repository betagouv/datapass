import { useContext } from 'react';
import { markEventsAsProcessed } from '../../../../services/enrollments';
import HighlightWithTwoButtons from '../../../molecules/HighlightWithTwoButtons';
import { FormContext } from '../../../templates/Form';
import { OpenMessagePromptContext } from '../../../templates/Form/OpenMessagePromptContextProvider';
import useListItemNavigation from '../../../templates/hooks/use-list-item-navigation';

const CallToProcessedMessageNotification = () => {
  const { onClick: openMessagePrompt } = useContext(OpenMessagePromptContext);
  const {
    enrollment: { id },
  } = useContext(FormContext);
  const { goBackToList } = useListItemNavigation;

  const markAsProcessed = async () => {
    await markEventsAsProcessed(id);
    goBackToList();
  };

  return (
    <HighlightWithTwoButtons
      title="1 Message de demandeur"
      labelAction1="Rédiger un message"
      labelAction2="Marquer comme traité"
      onClickAction1={openMessagePrompt}
      onClickAction2={markAsProcessed}
    >
      Un message de demandeur est en attente de traitement
    </HighlightWithTwoButtons>
  );
};

export default CallToProcessedMessageNotification;
