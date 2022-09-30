import { renderHook } from '@testing-library/react-hooks';
import { FunctionComponent } from 'react';
import { act } from 'react-dom/test-utils';
import {
  EnrollmentEvent,
  eventConfigurations,
} from '../../../../../config/event-configuration';
import { OpenMessagePromptContext } from '../../OpenMessagePromptContextProvider';
import { useFormSubmission } from './use-form-submission';

describe('The form submission hook', () => {
  const handlePostEvent = jest.fn();
  const enrollment = jest.fn();
  const updateEnrollment = jest.fn();
  const processEvent = jest.fn();

  const wrapper: FunctionComponent = ({ children }) => (
    <OpenMessagePromptContext.Provider
      value={{
        onClick: jest.fn(),
        setOnClick: jest.fn(),
      }}
    >
      {children}
    </OpenMessagePromptContext.Provider>
  );

  it('sets default state when mounted for the first time', () => {
    const { result } = renderHook(
      () =>
        useFormSubmission(
          handlePostEvent,
          enrollment,
          updateEnrollment,
          processEvent
        ),
      { wrapper }
    );

    expect(result.current.loading).toBeFalsy();
    expect(result.current.pendingEvent).toBeUndefined();
  });

  it('waits for user input when an event needing user input is pending', () => {
    const { result } = renderHook(
      () =>
        useFormSubmission(
          handlePostEvent,
          enrollment,
          updateEnrollment,
          processEvent
        ),
      { wrapper }
    );

    expect(!!result.current.pendingEvent).toBeFalsy();

    act(() => {
      result.current.onEventButtonClick(EnrollmentEvent.notify);
    });

    expect(!!result.current.pendingEvent).toBeTruthy();
  });

  it('provides a button click handler', () => {
    const { result } = renderHook(
      () =>
        useFormSubmission(
          handlePostEvent,
          enrollment,
          updateEnrollment,
          processEvent
        ),
      { wrapper }
    );

    act(() => {
      result.current.onEventButtonClick(EnrollmentEvent.notify);
    });

    expect(result.current.pendingEvent).toBe(EnrollmentEvent.notify);
  });

  it('provides a prompt confirmation handler', async () => {
    const { result } = renderHook(
      () =>
        useFormSubmission(
          handlePostEvent,
          enrollment,
          updateEnrollment,
          processEvent
        ),
      { wrapper }
    );

    act(() => {
      result.current.onEventButtonClick(EnrollmentEvent.notify);
    });

    expect(result.current.pendingEvent).toBe(EnrollmentEvent.notify);

    await act(async () => {
      result.current.onPromptConfirmation('croute');
    });

    expect(result.current.loading).toBeFalsy();
    expect(result.current.pendingEvent).toBeUndefined();
  });

  it('triggers the update event when the user cancel the prompt submission modal', async () => {
    const { result } = renderHook(
      () =>
        useFormSubmission(
          handlePostEvent,
          enrollment,
          updateEnrollment,
          processEvent
        ),
      { wrapper }
    );
    const eventResult = Symbol('event result');
    processEvent.mockResolvedValue(eventResult);

    await act(async () => {
      result.current.onEventButtonClick(EnrollmentEvent.update);
    });

    expect(result.current.pendingEvent).toBe(EnrollmentEvent.update);

    await act(async () => {
      result.current.onPromptCancellation();
    });

    expect(processEvent).toHaveBeenCalledWith(
      EnrollmentEvent.update,
      eventConfigurations.update,
      enrollment,
      updateEnrollment,
      undefined
    );
    expect(handlePostEvent).toHaveBeenCalledWith(eventResult);
    expect(result.current.loading).toBeFalsy();
  });

  it('triggers the submit event when the user confirm the prompt submission modal', async () => {
    const { result } = renderHook(
      () =>
        useFormSubmission(
          handlePostEvent,
          enrollment,
          updateEnrollment,
          processEvent
        ),
      { wrapper }
    );
    const eventResult = Symbol('event result');
    processEvent.mockResolvedValue(eventResult);

    await act(async () => {
      result.current.onEventButtonClick(EnrollmentEvent.update);
    });

    expect(result.current.pendingEvent).toBe(EnrollmentEvent.update);

    await act(async () => {
      result.current.onPromptConfirmation();
    });

    expect(processEvent).toHaveBeenCalledWith(
      EnrollmentEvent.submit,
      eventConfigurations.submit,
      enrollment,
      updateEnrollment,
      undefined
    );
    expect(handlePostEvent).toHaveBeenCalledWith(eventResult);
    expect(result.current.loading).toBeFalsy();
  });

  it('provides a prompt cancellation handler', () => {
    const { result } = renderHook(
      () =>
        useFormSubmission(
          handlePostEvent,
          enrollment,
          updateEnrollment,
          processEvent
        ),
      { wrapper }
    );

    act(() => {
      result.current.onEventButtonClick(EnrollmentEvent.notify);
    });

    expect(!!result.current.pendingEvent).toBeTruthy();

    act(() => {
      result.current.onPromptCancellation();
    });

    expect(!!result.current.pendingEvent).toBeFalsy();
  });
});
