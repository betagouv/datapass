import { getErrorMessages } from '.';
import {
  EventConfiguration,
  EnrollmentEvent,
} from '../config/event-configuration';
import {
  createOrUpdateEnrollment,
  deleteEnrollment,
  changeEnrollmentState,
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
      const newEnrollment = await createOrUpdateEnrollment({
        enrollment,
      });
      updateEnrollment(newEnrollment);
      enrollmentId = newEnrollment.id;

      resultMessages.successMessages.push(
        'Votre habilitation a été sauvegardée.'
      );
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

    return resultMessages;
  } catch (error) {
    resultMessages.errorMessages.push(...getErrorMessages(error));

    return resultMessages;
  }
};
