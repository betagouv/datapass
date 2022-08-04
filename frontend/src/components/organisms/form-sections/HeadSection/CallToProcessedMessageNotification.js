import { useContext } from 'react';
import HighlightWithTwoButtons from '../../../molecules/HighlightWithTwoButtons';
import { OpenMessagePromptContext } from '../../../templates/Form/OpenMessagePromptContextProvider';

const CallToProcessedMessageNotification = ({ title }) => {
  const { onClick } = useContext(OpenMessagePromptContext);

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
