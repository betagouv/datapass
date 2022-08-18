import { isEmpty } from 'lodash';
import { useContext, useMemo } from 'react';
import HighlightWithButton from '../../../molecules/notification-with-buttons/HighlightWithButton';
import { OpenMessagePromptContext } from '../../../templates/Form/OpenMessagePromptContextProvider';
import { useAuth } from '../../AuthContext';

export const CallToWriteMessageNotification = ({
  enrollmentId,
  team_members,
}) => {
  const { onClick } = useContext(OpenMessagePromptContext);
  const {
    user: { email },
  } = useAuth();

  const isUserADemandeur = useMemo(() => {
    if (isEmpty(team_members)) {
      return false;
    }
    return team_members
      .filter(({ type }) => type === 'demandeur')
      .map(({ email }) => email)
      .includes(email);
  }, [team_members, email]);

  if (!isUserADemandeur || !enrollmentId) return null;

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
