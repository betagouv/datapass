import { useState } from 'react';
import {
  EnrollmentAction,
  userInteractionsConfiguration,
} from '../../../../../lib/enrollment-actions-configuration';

export const useFormSubmission = (
  handleSubmit: Function,
  enrollment: any,
  updateEnrollment: Function,
  doAction: Function
) => {
  const [pendingAction, setPendingAction] = useState<EnrollmentAction>();
  const loading = pendingAction !== undefined;

  const waitingForUserInput =
    pendingAction !== undefined &&
    userInteractionsConfiguration[pendingAction]?.promptForComment === true;

  const pendingActionConfiguration =
    pendingAction !== undefined
      ? userInteractionsConfiguration[pendingAction]
      : undefined;

  const onActionButtonClick = async (action: EnrollmentAction) => {
    setPendingAction(action);

    const actionConfiguration = userInteractionsConfiguration[action];
    if (!actionConfiguration.promptForComment) {
      handleSubmit(
        await doAction(
          action,
          actionConfiguration,
          enrollment,
          updateEnrollment
        )
      );

      setPendingAction(undefined);
    }
  };

  const onPromptConfirmation = async (message: string) => {
    handleSubmit(
      await doAction(
        pendingAction!,
        pendingActionConfiguration!,
        enrollment,
        updateEnrollment,
        message
      )
    );

    setPendingAction(undefined);
  };

  const onPromptCancellation = () => {
    setPendingAction(undefined);
  };

  return {
    loading,
    waitingForUserInput,
    pendingAction,
    pendingActionConfiguration,
    onActionButtonClick,
    onPromptConfirmation,
    onPromptCancellation,
  };
};
