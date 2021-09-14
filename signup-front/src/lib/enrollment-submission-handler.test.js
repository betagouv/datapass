import {
  EnrollmentAction,
  userInteractionsConfiguration,
} from './enrollment-actions-configuration';
jest.mock('../services/enrollments');
// eslint-disable-next-line import/first
import { handleSubmissionAction } from './enrollment-submission-handler';
// eslint-disable-next-line import/first
import {
  computeNextEnrollmentState,
  deleteEnrollment,
  createOrUpdateEnrollment,
} from '../services/enrollments';

describe('When submitting the enrollment form', () => {
  const enrollment = { id: Symbol(), acl: {} };
  const updateEnrollment = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('with the notify action', () => {
    const action = EnrollmentAction.notify;
    const actionConfiguration = userInteractionsConfiguration.notify;

    it('calls for the enrollment state update', async () => {
      const userMessage = 'La barbe de la femme à Georges Moustaki';

      const output = await handleSubmissionAction(
        action,
        actionConfiguration,
        enrollment,
        updateEnrollment,
        userMessage,
        false
      );

      expect(computeNextEnrollmentState).toHaveBeenCalledWith({
        action: 'notify',
        comment: userMessage,
        id: enrollment.id,
      });
      expect(output).toMatchSnapshot();
    });
  });

  describe('with the destroy action', () => {
    const action = EnrollmentAction.destroy;
    const actionConfiguration = userInteractionsConfiguration.destroy;

    it('calls the delete endpoint', async () => {
      const output = await handleSubmissionAction(
        action,
        actionConfiguration,
        enrollment,
        updateEnrollment
      );

      expect(deleteEnrollment).toHaveBeenCalledWith({
        id: enrollment.id,
      });
      expect(output).toMatchSnapshot();
    });
  });

  describe('with the update action', () => {
    const action = EnrollmentAction.update;
    const actionConfiguration = userInteractionsConfiguration.update;

    const enrollmentToUpdate = { ...enrollment, acl: { update: true } };

    it('calls the update endpoint', async () => {
      createOrUpdateEnrollment.mockResolvedValue(enrollmentToUpdate);

      const output = await handleSubmissionAction(
        action,
        actionConfiguration,
        enrollmentToUpdate,
        updateEnrollment
      );

      expect(createOrUpdateEnrollment).toHaveBeenCalledWith({
        enrollment: enrollmentToUpdate,
      });
      expect(output).toMatchSnapshot();
    });

    it('displays an error if update fails', async () => {
      createOrUpdateEnrollment.mockRejectedValue("Pas d'update désolé");

      const output = await handleSubmissionAction(
        action,
        actionConfiguration,
        enrollmentToUpdate,
        updateEnrollment
      );

      expect(output).toMatchSnapshot();
    });
  });
});
