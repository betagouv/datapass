import { useContext } from 'react';
import HighlightWithButton from '../../../molecules/notification-with-buttons/HighlightWithButton';
import { OpenMessagePromptContext } from '../../../templates/Form/OpenMessagePromptContextProvider';
import { useAuth } from '../../AuthContext';
import { isUserADemandeur } from '../../../../lib';

export const CallToWriteMessageNotification = ({ aclNotify, team_members }) => {
  const { onClick } = useContext(OpenMessagePromptContext);
  const {
    user: { email },
  } = useAuth();

  if (!isUserADemandeur({ team_members, user_email: email }) || !aclNotify)
    return null;

  return (
    <HighlightWithButton
      title="Message"
      label="Rédiger un message"
      onClick={onClick}
    >
      Si vous avez une question vous pouvez à présent laisser un message aux
      instructeurs. <br />
      Nous vous répondrons dans les meilleurs délais.
    </HighlightWithButton>
  );
};

export default CallToWriteMessageNotification;
