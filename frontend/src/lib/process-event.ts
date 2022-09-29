import { getErrorMessages } from '.';
import {
  EnrollmentEvent,
  EventConfiguration,
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
    let comment = null;
    let enrollmentId = enrollment.id;

    if (eventConfiguration.promptForComment) {
      try {
        comment = message;
      } catch (e) {
        return resultMessages;
      }
    }

    if (eventConfiguration.createOrUpdate) {
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

    if (eventConfiguration.delete) {
      await deleteEnrollment({ id: enrollmentId });
    }

    if (eventConfiguration.changeEnrollmentState) {
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
    resultMessages.errorMessages.push(...getErrorMessages(error));

    return resultMessages;
  }
};
