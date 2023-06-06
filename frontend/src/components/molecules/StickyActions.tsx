import { FunctionComponent, useState } from 'react';
import {
  EnrollmentEvent,
  PromptType,
  eventConfigurations,
} from '../../config/event-configuration';
import EventButton from '../atoms/EventButton';
import ButtonGroup from './ButtonGroup';
import './StickyActions.css';
import Button from '../atoms/hyperTexts/Button';
import { useFormSubmission } from '../templates/Form/SubmissionPanel/hooks/use-form-submission';
import { processEvent } from '../../lib/process-event';
import Loader from '../atoms/Loader';
import Prompt from '../templates/Form/SubmissionPanel/Prompt';
import ConfirmationModal from '../organisms/ConfirmationModal';

export const listAuthorizedEvents = (acl: Record<string, boolean>) =>
  (Object.keys(eventConfigurations) as EnrollmentEvent[]).filter(
    (key) => acl[key]
  );

type StickyActionsProps = {
  enrollment: any;
  handlePostEvent: Function;
  updateEnrollment: Function;
};

type StickyActionsDialogProps = {
  title: string;
  onClose: Function;
  body: any;
};

type EnrollmentAction =
  | EnrollmentEvent.instruct
  | EnrollmentEvent.notify
  | null;

const StickyActionsDialog: FunctionComponent<StickyActionsDialogProps> = ({
  title,
  body,
  onClose,
}) => {
  return (
    <div className="sticky-actions-dialog">
      <div className="sticky-actions-dialog-header">
        <div className="sticky-actions-dialog-header-title">{title}</div>
        <Button
          className="sticky-actions-dialog-header-action"
          onClick={() => onClose()}
          tertiaryNoOutline
        >
          Réduire
        </Button>
      </div>
      <div className="sticky-actions-dialog-body">{body}</div>
    </div>
  );
};

export const StickyActions: FunctionComponent<StickyActionsProps> = ({
  enrollment,
  updateEnrollment,
  handlePostEvent,
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

  const [currentAction, setCurrentAction] = useState<EnrollmentAction>(null);
  const authorizedEvents = listAuthorizedEvents(enrollment.acl);

  const toggleCurrentAction = (action: EnrollmentAction) =>
    setCurrentAction((prevAction) => (prevAction === action ? null : action));

  const getContent = (currentAction: EnrollmentAction) => {
    switch (currentAction) {
      case EnrollmentEvent.instruct:
        return {
          title: 'Instruire',
          body: (
            <div className="instruction-dialog">
              <div>Comment souhaitez vous instruire cette demande ?</div>
              {authorizedEvents
                .filter((event) => event !== EnrollmentEvent.notify)
                .map((event) => {
                  const eventConfiguration = eventConfigurations[event];
                  return (
                    <EventButton
                      key={event}
                      disabled={!!pendingEvent || loading}
                      onClick={() => onEventButtonClick(event)}
                      {...eventConfiguration.displayProps}
                    />
                  );
                })}

              {loading && <Loader enableBePatientMessage />}

              {pendingEvent &&
                eventConfigurations[pendingEvent].prompt ===
                  PromptType.comment && (
                  <Prompt
                    onAccept={onPromptConfirmation}
                    onCancel={onPromptCancellation}
                    displayProps={
                      eventConfigurations[pendingEvent!].displayProps
                    }
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
                      Souhaitez-vous soumettre votre habilitation à validation,
                      afin qu'elle soit étudiée par les équipes compétentes ?
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
              {pendingEvent &&
                eventConfigurations[pendingEvent].prompt ===
                  PromptType.confirm_archive && (
                  <ConfirmationModal
                    title="Vous n’aurez plus accès à cette habilitation"
                    handleCancel={onPromptCancellation}
                    handleConfirm={onPromptConfirmation}
                  >
                    Voulez vous continuer ?
                  </ConfirmationModal>
                )}
            </div>
          ),
        };

      case EnrollmentEvent.notify:
        return {
          title: 'Écrire au demandeur',
          body: null,
        };

      default:
        return null;
    }
  };

  const content = getContent(currentAction);

  return (
    <div className="sticky-actions">
      {content && (
        <StickyActionsDialog
          title={content.title}
          body={content.body}
          onClose={() => setCurrentAction(null)}
        />
      )}
      <ButtonGroup className="sticky-actions-buttons" align="right">
        {authorizedEvents.length > 1 && (
          <EventButton
            onClick={() => toggleCurrentAction(EnrollmentEvent.instruct)}
            label="Instruction"
            icon="edit"
            quaternary={currentAction !== EnrollmentEvent.instruct}
            iconFill
          />
        )}
        {authorizedEvents.includes(EnrollmentEvent.notify) && (
          <EventButton
            onClick={() => toggleCurrentAction(EnrollmentEvent.notify)}
            label="Messagerie"
            icon="mail"
            quaternary={currentAction !== EnrollmentEvent.notify}
            iconFill
          />
        )}
      </ButtonGroup>
    </div>
  );
};

export default StickyActions;
