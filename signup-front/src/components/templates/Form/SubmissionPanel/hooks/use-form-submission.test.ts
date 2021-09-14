import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import {
  EnrollmentAction,
  userInteractionsConfiguration,
} from '../../../../../lib/enrollment-actions-configuration';
import { useFormSubmission } from './use-form-submission';

describe('The form submission hook', () => {
  const handleSubmit = jest.fn();
  const enrollment = jest.fn();
  const updateEnrollment = jest.fn();
  const doAction = jest.fn();

  it('sets default state when mounted for the first time', () => {
    const { result } = renderHook(() =>
      useFormSubmission(handleSubmit, enrollment, updateEnrollment, doAction)
    );

    expect(result.current.loading).toBeFalsy();
    expect(result.current.pendingAction).toBeUndefined();
  });

  it('waits for user input when an action needing user input is pending', () => {
    const { result } = renderHook(() =>
      useFormSubmission(handleSubmit, enrollment, updateEnrollment, doAction)
    );

    expect(result.current.waitingForUserInput).toBeFalsy();

    act(() => {
      result.current.onActionButtonClick(EnrollmentAction.notify);
    });

    expect(result.current.waitingForUserInput).toBeTruthy();
  });

  it('provides action configuration when an action is pending', () => {
    const { result } = renderHook(() =>
      useFormSubmission(handleSubmit, enrollment, updateEnrollment, doAction)
    );

    act(() => {
      result.current.onActionButtonClick(EnrollmentAction.notify);
    });

    expect(result.current.pendingActionConfiguration).toBe(
      userInteractionsConfiguration.notify
    );
  });

  it('provides a button click handler', () => {
    const { result } = renderHook(() =>
      useFormSubmission(handleSubmit, enrollment, updateEnrollment, doAction)
    );

    act(() => {
      result.current.onActionButtonClick(EnrollmentAction.notify);
    });

    expect(result.current.loading).toBeTruthy();
    expect(result.current.pendingAction).toBe(EnrollmentAction.notify);
  });

  it('provides a prompt confirmation handler', async () => {
    const { result } = renderHook(() =>
      useFormSubmission(handleSubmit, enrollment, updateEnrollment, doAction)
    );

    act(() => {
      result.current.onActionButtonClick(EnrollmentAction.notify);
    });

    expect(result.current.loading).toBeTruthy();
    expect(result.current.pendingAction).toBe(EnrollmentAction.notify);

    await act(async () => {
      result.current.onPromptConfirmation('croute');
    });

    expect(result.current.loading).toBeFalsy();
    expect(result.current.pendingAction).toBeUndefined();
  });

  it('triggers the pending action if no user input is required', async () => {
    const { result } = renderHook(() =>
      useFormSubmission(handleSubmit, enrollment, updateEnrollment, doAction)
    );
    const actionResult = Symbol('action result');
    doAction.mockResolvedValue(actionResult);

    await act(async () => {
      result.current.onActionButtonClick(EnrollmentAction.update);
    });

    expect(doAction).toHaveBeenCalledWith(
      EnrollmentAction.update,
      userInteractionsConfiguration.update,
      enrollment,
      updateEnrollment
    );
    expect(handleSubmit).toHaveBeenCalledWith(actionResult);
    expect(result.current.loading).toBeFalsy();
  });

  it('provides a prompt cancellation handler', () => {
    const { result } = renderHook(() =>
      useFormSubmission(handleSubmit, enrollment, updateEnrollment, doAction)
    );

    act(() => {
      result.current.onActionButtonClick(EnrollmentAction.notify);
    });

    expect(result.current.waitingForUserInput).toBeTruthy();

    act(() => {
      result.current.onPromptCancellation();
    });

    expect(result.current.waitingForUserInput).toBeFalsy();
  });
});
