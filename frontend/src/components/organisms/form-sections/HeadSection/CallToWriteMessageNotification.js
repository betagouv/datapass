import { useContext } from 'react';
import HighlightWithButton from '../../../molecules/HighlightWithButton';
import { OpenMessagePromptContext } from '../../../templates/Form/OpenMessagePromptContextProvider';

export const CallToWriteMessageNotification = ({ title }) => {
  const { onClick } = useContext(OpenMessagePromptContext);

  return (
    <HighlightWithButton title={'Message'} onClick={onClick}>
      Si vous avez une question vous pouvez à présent laisser un message aux
      instructeurs. <br />
      Nous vous répondrons dans les meilleurs délais.
    </HighlightWithButton>
  );
};

export default CallToWriteMessageNotification;
