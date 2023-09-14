import {
  EnrollmentEvent,
  EventConfiguration,
  eventConfigurations,
} from '../config/event-configuration';
jest.mock('../services/enrollments');
// eslint-disable-next-line import/first
import { processEvent } from './process-event';
// eslint-disable-next-line import/first
import {
  changeEnrollmentState,
  deleteEnrollment,
  createOrUpdateEnrollment,
} from '../services/enrollments';

describe('When submitting the enrollment form', () => {
  const enrollment = { id: Symbol(), acl: {} };
  const updateEnrollment = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('with the notify event', () => {
    const event = EnrollmentEvent.notify;
    const eventConfiguration = eventConfigurations.notify;

    it('calls for the enrollment state update', async () => {
      const userMessage = 'La barbe de la femme à Georges Moustaki';

      const output = await processEvent(
        event,
        eventConfiguration as EventConfiguration,
        enrollment,
        updateEnrollment,
        userMessage
      );

      expect(changeEnrollmentState).toHaveBeenCalledWith({
        event: 'notify',
        comment: userMessage,
        id: enrollment.id,
      });
      expect(output).toMatchSnapshot();
    });
  });

  describe('with the destroy event', () => {
    const event = EnrollmentEvent.destroy;
    const eventConfiguration = eventConfigurations.destroy;

    it('calls the delete endpoint', async () => {
      const output = await processEvent(
        event,
        eventConfiguration as EventConfiguration,
        enrollment,
        updateEnrollment
      );

      expect(deleteEnrollment).toHaveBeenCalledWith({
        id: enrollment.id,
      });
      expect(output).toMatchSnapshot();
    });
  });

  describe('with the update event', () => {
    const event = EnrollmentEvent.update;
    const eventConfiguration = eventConfigurations.update;

    const enrollmentToUpdate = { ...enrollment, acl: { update: true } };

    it('calls the update endpoint', async () => {
      (
        createOrUpdateEnrollment as jest.MockedFunction<
          typeof createOrUpdateEnrollment
        >
      ).mockResolvedValue(enrollmentToUpdate);

      const output = await processEvent(
        event,
        eventConfiguration as EventConfiguration,
        enrollmentToUpdate,
        updateEnrollment
      );

      expect(
        createOrUpdateEnrollment as jest.MockedFunction<
          typeof createOrUpdateEnrollment
        >
      ).toHaveBeenCalledWith({
        enrollment: enrollmentToUpdate,
      });
      expect(output).toMatchSnapshot();
    });

    it('displays an error if update fails', async () => {
      (
        createOrUpdateEnrollment as jest.MockedFunction<
          typeof createOrUpdateEnrollment
        >
      ).mockRejectedValue("Pas d'update désolé");

      const output = await processEvent(
        event,
        eventConfiguration as EventConfiguration,
        enrollmentToUpdate,
        updateEnrollment
      );

      expect(output).toMatchSnapshot();
    });
  });
});
