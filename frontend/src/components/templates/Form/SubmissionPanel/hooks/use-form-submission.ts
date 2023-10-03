import { useCallback, useContext, useEffect, useState } from 'react';
import {
  EnrollmentEvent,
  EventConfiguration,
  eventConfigurations,
  PromptType,
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
  const messageContext = useContext(OpenMessagePromptContext);
  const setOnOpenMessagePromptClick = messageContext!.setOnClick;

  const onEventButtonClick = useCallback(
    async (event: EnrollmentEvent) => {
      setPendingEvent(event);

      const eventConfiguration = eventConfigurations[
        event
      ] as EventConfiguration;
      if (!eventConfiguration.prompt) {
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
    setOnOpenMessagePromptClick(() => () => {
      onEventButtonClick(EnrollmentEvent.notify);
    });
  }, [setOnOpenMessagePromptClick, onEventButtonClick]);

  const onPromptConfirmationFactory =
    (event: EnrollmentEvent) => async (message?: string) => {
      setLoading(true);
      setPendingEvent(undefined);
      const postEventConfiguration = await processEvent(
        event,
        eventConfigurations[event],
        enrollment,
        updateEnrollment,
        message
      );
      setLoading(false);
      handlePostEvent(postEventConfiguration);
    };

  const eventToProcess =
    pendingEvent &&
    eventConfigurations[pendingEvent]?.prompt === PromptType.submit_instead
      ? EnrollmentEvent.submit
      : pendingEvent;

  const onPromptConfirmation = pendingEvent
    ? onPromptConfirmationFactory(
        eventConfigurations[pendingEvent]?.prompt === PromptType.submit_instead
          ? EnrollmentEvent.submit
          : eventToProcess!
      )
    : () => null;

  const onPromptCancellation = pendingEvent
    ? eventConfigurations[pendingEvent]?.prompt === PromptType.submit_instead
      ? onPromptConfirmationFactory(pendingEvent)
      : () => {
          setPendingEvent(undefined);
        }
    : () => null;

  return {
    loading,
    pendingEvent,
    onEventButtonClick,
    onPromptConfirmation,
    onPromptCancellation,
  };
};
