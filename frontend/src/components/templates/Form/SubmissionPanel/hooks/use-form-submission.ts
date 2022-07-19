import { useState } from 'react';
import {
  EnrollmentEvent,
  eventConfigurations,
} from '../../../../../config/event-configuration';

export const useFormSubmission = (
  handlePostEvent: Function,
  enrollment: any,
  updateEnrollment: Function,
  processEvent: Function
) => {
  const [pendingEvent, setPendingEvent] = useState<EnrollmentEvent>();
  const [loading, setLoading] = useState<boolean>(false);

  const waitingForUserInput =
    pendingEvent !== undefined &&
    eventConfigurations[pendingEvent]?.promptForComment === true;

  const pendingEventConfiguration =
    pendingEvent !== undefined ? eventConfigurations[pendingEvent] : undefined;

  const waitingForUserConfirmation =
    pendingEvent !== undefined &&
    eventConfigurations[pendingEvent]?.promptForConfirmation === true;

  const onEventButtonClick = async (event: EnrollmentEvent) => {
    setPendingEvent(event);

    const eventConfiguration = eventConfigurations[event];
    if (
      !eventConfiguration.promptForComment &&
      !eventConfiguration.promptForConfirmation
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
  };

  const onPromptConfirmation = async (message?: string) => {
    setLoading(true);
    setPendingEvent(undefined);
    const postEventConfiguration = await processEvent(
      pendingEvent!,
      pendingEventConfiguration!,
      enrollment,
      updateEnrollment,
      message
    );
    setLoading(false);
    handlePostEvent(postEventConfiguration);
  };

  const onPromptCancellation = () => {
    setPendingEvent(undefined);
  };

  return {
    loading,
    waitingForUserInput,
    waitingForUserConfirmation,
    pendingEvent,
    pendingEventConfiguration,
    onEventButtonClick,
    onPromptConfirmation,
    onPromptCancellation,
  };
};
