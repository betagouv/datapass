import { FunctionComponent } from 'react';
import { eventConfigurations } from '../../../../config/event-configuration';
import { processEvent } from '../../../../lib/process-event';
import Loader from '../../../atoms/Loader';
import EventButtonList from '../../../molecules/EventButtonList';
import ConfirmationModal from '../../../organisms/ConfirmationModal';
import { useFormSubmission } from './hooks/use-form-submission';
import Prompt from './Prompt';

type Props = {
  enrollment: any;
  handlePostEvent: Function;
  updateEnrollment: Function;
};

const SubmissionPanel: FunctionComponent<Props> = ({
  enrollment,
  handlePostEvent,
  updateEnrollment,
}) => {
  const {
    pendingEvent,
    loading,
    onEventButtonClick,
    waitingForUserInput,
    waitingForUserConfirmation,
    onPromptConfirmation,
    onPromptCancellation,
  } = useFormSubmission(
    handlePostEvent,
    enrollment,
    updateEnrollment,
    processEvent
  );

  return (
    <>
      <EventButtonList
        disabled={waitingForUserInput || waitingForUserConfirmation || loading}
        acl={enrollment.acl}
        onEventButtonClick={onEventButtonClick}
      />

      {loading && <Loader enableBePatientMessage />}

      {waitingForUserInput && (
        <Prompt
          onAccept={onPromptConfirmation}
          onCancel={onPromptCancellation}
          displayProps={eventConfigurations[pendingEvent!].displayProps}
          selectedEvent={pendingEvent as string}
          enrollment={enrollment}
        />
      )}
      {waitingForUserConfirmation && (
        <ConfirmationModal
          title="La suppression d'une habilitation est irréversible"
          handleCancel={onPromptCancellation}
          handleConfirm={onPromptConfirmation}
        >
          Voulez vous continuer ?
        </ConfirmationModal>
      )}
    </>
  );
};

export default SubmissionPanel;
