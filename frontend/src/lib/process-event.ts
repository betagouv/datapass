import { NetworkError, getErrorMessages } from '.';
import {
  EnrollmentEvent,
  EventConfiguration,
  PromptType,
  RequestType,
} from '../config/event-configuration';
import {
  changeEnrollmentState,
  createOrUpdateEnrollment,
  deleteEnrollment,
} from '../services/enrollments';

export const processEvent = async (
  event: EnrollmentEvent,
  eventConfiguration: EventConfiguration,
  enrollment: any,
  updateEnrollment: Function,
  message?: string
): Promise<{
  redirectToHome: boolean;
  successMessages: string[];
  errorMessages: string[];
}> => {
  const resultMessages = {
    errorMessages: [] as string[],
    successMessages: [] as string[],
    redirectToHome: false,
  };

  try {
    let comment: string | null | undefined = null;
    let enrollmentId = enrollment.id;

    if (
      [PromptType.comment, PromptType.notify].includes(
        eventConfiguration.prompt as PromptType
      )
    ) {
      try {
        comment = message;
      } catch (e) {
        return resultMessages;
      }
    }

    if (
      [
        RequestType.create_or_update,
        RequestType.create_or_update_then_change_state,
      ].includes(eventConfiguration.request)
    ) {
      const formattedEnrollment = {
        ...enrollment,
        team_members_attributes: enrollment.team_members,
      };
      const newEnrollment = await createOrUpdateEnrollment({
        enrollment: formattedEnrollment,
      });
      updateEnrollment({ target: { name: 'documents_attributes', value: [] } });
      updateEnrollment(newEnrollment);
      enrollmentId = newEnrollment.id;
    }

    if (eventConfiguration.request === RequestType.delete) {
      await deleteEnrollment({ id: enrollmentId });
    }

    if (
      [
        RequestType.change_state,
        RequestType.create_or_update_then_change_state,
      ].includes(eventConfiguration.request)
    ) {
      await changeEnrollmentState({
        event,
        id: enrollmentId,
        comment,
      });
    }

    if (eventConfiguration.redirectToHome) {
      resultMessages.redirectToHome = true;
    }

    if (eventConfiguration.successMessage) {
      resultMessages.successMessages.push(eventConfiguration.successMessage);
    }

    return resultMessages;
  } catch (error) {
    resultMessages.errorMessages.push(
      ...(getErrorMessages(error as NetworkError) as string[])
    );

    return resultMessages;
  }
};
