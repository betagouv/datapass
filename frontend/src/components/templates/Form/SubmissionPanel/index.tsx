import { FunctionComponent } from 'react';
import {
  eventConfigurations,
  PromptType,
} from '../../../../config/event-configuration';
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
    loading,
    pendingEvent,
    onEventButtonClick,
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
        disabled={!!pendingEvent || loading}
        acl={enrollment.acl}
        onEventButtonClick={onEventButtonClick}
      />

      {loading && <Loader enableBePatientMessage />}

      {pendingEvent &&
        eventConfigurations[pendingEvent].prompt === PromptType.comment && (
          <Prompt
            onAccept={onPromptConfirmation}
            onCancel={onPromptCancellation}
            displayProps={eventConfigurations[pendingEvent!].displayProps}
            selectedEvent={pendingEvent as string}
            enrollment={enrollment}
          />
        )}
      {pendingEvent &&
        eventConfigurations[pendingEvent].prompt ===
          PromptType.submit_instead && (
          <ConfirmationModal
            title="Vos modifications vont être enregistrées."
            confirmLabel="Soumettre la demande"
            handleConfirm={onPromptConfirmation}
            cancelLabel="Non, je l’enregistre seulement"
            handleCancel={onPromptCancellation}
          >
            <p>
              Souhaitez-vous soumettre votre habilitation à validation, afin
              qu'elle soit étudiée par les équipes compétentes ?
            </p>
          </ConfirmationModal>
        )}
      {pendingEvent &&
        eventConfigurations[pendingEvent].prompt ===
          PromptType.confirm_deletion && (
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
