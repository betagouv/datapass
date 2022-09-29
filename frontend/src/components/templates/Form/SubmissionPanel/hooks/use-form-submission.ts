import { useCallback, useContext, useEffect, useState } from 'react';
import {
  EnrollmentEvent,
  eventConfigurations,
} from '../../../../../config/event-configuration';
import { OpenMessagePromptContext } from '../../OpenMessagePromptContextProvider';

export const useFormSubmission = (
  handlePostEvent: Function,
  enrollment: any,
  updateEnrollment: Function,
  processEvent: Function
) => {
  const [pendingEvent, setPendingEvent] = useState<EnrollmentEvent>();
  const [loading, setLoading] = useState<boolean>(false);
  const { setOnClick } = useContext(OpenMessagePromptContext);
  const [showAlert, setShowAlert] = useState(true);

  const waitingForUserInput =
    pendingEvent !== undefined &&
    eventConfigurations[pendingEvent]?.promptForComment === true;

  const pendingEventConfiguration =
    pendingEvent !== undefined ? eventConfigurations[pendingEvent] : undefined;

  const waitingForUserConfirmation =
    pendingEvent !== undefined &&
    eventConfigurations[pendingEvent]?.promptForConfirmation === true;

  const waitingForUserPromptForSubmission =
    pendingEvent !== undefined &&
    eventConfigurations[pendingEvent]?.promptForSubmission === true;

  const onEventButtonClick = useCallback(
    async (event: EnrollmentEvent) => {
      setPendingEvent(event);

      const eventConfiguration = eventConfigurations[event];
      if (
        !eventConfiguration.promptForComment &&
        !eventConfiguration.promptForConfirmation &&
        !eventConfiguration.promptForSubmission
      ) {
        setLoading(true);
        setPendingEvent(undefined);
        const postEventConfiguration = await processEvent(
          event,
          eventConfiguration,
          enrollment,
          updateEnrollment
        );
        setLoading(false);
        handlePostEvent(postEventConfiguration);
      }
    },
    [enrollment, handlePostEvent, processEvent, updateEnrollment]
  );

  useEffect(() => {
    setOnClick(() => () => {
      onEventButtonClick(EnrollmentEvent.notify);
    });
  }, [setOnClick, onEventButtonClick]);

  const onPromptConfirmation = async (message?: string) => {
    setLoading(true);
    setPendingEvent(undefined);
    setShowAlert(false);
    const postEventConfiguration = await processEvent(
      pendingEvent!,
      pendingEventConfiguration!,
      enrollment,
      updateEnrollment,
      message
    );
    setLoading(false);
    handlePostEvent(postEventConfiguration);
    setShowAlert(true);
  };

  const onPromptSubmission = async (message?: string) => {
    setLoading(true);
    setPendingEvent(undefined);
    setShowAlert(false);
    const postEventConfiguration = await processEvent(
      EnrollmentEvent.submit,
      eventConfigurations.submit,
      enrollment,
      updateEnrollment,
      message
    );
    setLoading(false);
    handlePostEvent(postEventConfiguration);
    setShowAlert(true);
  };

  const onPromptSubmissionCancelation = onPromptConfirmation;

  const onPromptCancellation = () => {
    setPendingEvent(undefined);
  };

  return {
    loading,
    waitingForUserInput,
    waitingForUserConfirmation,
    waitingForUserPromptForSubmission,
    pendingEvent,
    pendingEventConfiguration,
    onEventButtonClick,
    onPromptConfirmation,
    onPromptCancellation,
    onPromptSubmission,
    onPromptSubmissionCancelation,
    showAlert,
  };
};
