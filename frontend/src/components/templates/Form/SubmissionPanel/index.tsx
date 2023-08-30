import { FunctionComponent, MouseEventHandler, useState } from 'react';
import {
  EventConfiguration,
  eventConfigurations,
  PromptType,
} from '../../../../config/event-configuration';
import { processEvent } from '../../../../lib/process-event';
import Loader from '../../../atoms/Loader';
import EventButtonList from '../../../molecules/EventButtonList';
import ConfirmationModal from '../../../organisms/ConfirmationModal';
import { useFormSubmission } from './hooks/use-form-submission';
import Prompt from './Prompt';
import { useAuth } from '../../../organisms/AuthContext';

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
  const [promptInputValue, setPromptInputValue] = useState('');
  const { user } = useAuth();
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
  if (user && user?.roles && user?.roles?.length > 1) {
    return null;
  }

  return (
    <>
      <EventButtonList
        disabled={!!pendingEvent || loading}
        acl={enrollment.acl}
        onEventButtonClick={onEventButtonClick}
      />

      {loading && <Loader enableBePatientMessage />}

      {pendingEvent &&
        eventConfigurations[pendingEvent] &&
        eventConfigurations[pendingEvent]?.prompt === PromptType.comment && (
          <Prompt
            inputValue={promptInputValue}
            setInputValue={setPromptInputValue}
            onAccept={onPromptConfirmation}
            onCancel={
              onPromptCancellation as MouseEventHandler<HTMLButtonElement>
            }
            displayProps={
              eventConfigurations[pendingEvent!]
                ?.displayProps as EventConfiguration['displayProps']
            }
            selectedEvent={pendingEvent}
            enrollment={enrollment}
          />
        )}
      {pendingEvent &&
        eventConfigurations[pendingEvent] &&
        eventConfigurations[pendingEvent]?.prompt ===
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
        eventConfigurations[pendingEvent] &&
        eventConfigurations[pendingEvent]?.prompt ===
          PromptType.confirm_deletion && (
          <ConfirmationModal
            title="La suppression d'une habilitation est irréversible"
            handleCancel={onPromptCancellation}
            handleConfirm={onPromptConfirmation}
          >
            Voulez vous continuer ?
          </ConfirmationModal>
        )}
      {pendingEvent &&
        eventConfigurations[pendingEvent] &&
        eventConfigurations[pendingEvent]?.prompt ===
          PromptType.confirm_archive && (
          <ConfirmationModal
            title="Vous n’aurez plus accès à cette habilitation"
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
