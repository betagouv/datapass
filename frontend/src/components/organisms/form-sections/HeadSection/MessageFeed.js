import { useContext } from 'react';
import Highlight from '../../../atoms/Highlight';
import { OpenMessagePromptContext } from '../../../templates/Form/FormSectionsContainer';

export const MessageFeed = ({ title }) => {
  const { onClick } = useContext(OpenMessagePromptContext);

  return (
    <Highlight title={'Message'} onClick={onClick}>
      Si vous avez une question vous pouvez à présent laisser un message aux
      instructeurs,
      <br />
      nous vous répondrons dans les meilleurs délais.
    </Highlight>
  );
};

export default MessageFeed;
