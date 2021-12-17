import { FunctionComponent } from 'react';
import Prompt from './Prompt';
import EventButtonList from '../../../molecules/EventButtonList';
import { eventConfigurations } from '../../../../config/event-configuration';
import { useFormSubmission } from './hooks/use-form-submission';
import { processEvent } from '../../../../lib/process-event';
import ConfirmationModal from '../../../organisms/ConfirmationModal';

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
        pendingEvent={pendingEvent}
        acl={enrollment.acl}
        loading={loading}
        onEventButtonClick={onEventButtonClick}
      />

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
          title="La suppression d'une demande est irréversible"
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
