import { FunctionComponent, MouseEvent } from 'react';
import {
  EnrollmentAction,
  userInteractionsConfiguration,
} from '../../lib/enrollment-actions-configuration';
import FormActionButton from '../atoms/FormActionButton';
import ButtonGroup from './ButtonGroup';

export const listAuthorizedActions = (acl: Record<string, boolean>) =>
  (Object.keys(userInteractionsConfiguration) as EnrollmentAction[]).filter(
    (key) => acl[key]
  );

type Props = {
  enrollment: any;
  loading: boolean;
  pendingAction?: EnrollmentAction;
  onActionButtonClick: Function;
};

const FormActionButtonList: FunctionComponent<Props> = ({
  enrollment,
  loading,
  pendingAction,
  onActionButtonClick,
}) => {
  const authorizedActions = listAuthorizedActions(enrollment.acl);

  return (
    <ButtonGroup alignRight>
      {authorizedActions.map((action) => {
        const actionConfiguration = userInteractionsConfiguration[action];
        const onClick = (event: MouseEvent<HTMLElement>) => {
          event.preventDefault();
          onActionButtonClick(action);
        };
        const isPendingAction = action === pendingAction;
        return (
          <FormActionButton
            key={action}
            loading={loading}
            onClick={onClick}
            isPendingAction={isPendingAction}
            {...actionConfiguration.displayProps}
          />
        );
      })}
    </ButtonGroup>
  );
};

export default FormActionButtonList;
