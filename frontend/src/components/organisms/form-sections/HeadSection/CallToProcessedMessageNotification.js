import { useContext } from 'react';
import HighlightWithTwoButtons from '../../../molecules/HighlightWithTwoButtons';
import { OpenMessagePromptContext } from '../../../templates/Form/OpenMessagePromptContextProvider';

const CallToProcessedMessageNotification = ({ title }) => {
  const { onClick } = useContext(OpenMessagePromptContext);

  return (
    <HighlightWithTwoButtons
      title={'1 Message de demandeur'}
      onClick={onClick}
      handleClick={() => console.log('click')}
    >
      Un message de demandeur est en attente de traitement
    </HighlightWithTwoButtons>
  );
};

export default CallToProcessedMessageNotification;
