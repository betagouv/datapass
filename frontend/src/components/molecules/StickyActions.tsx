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
import { chain, isEmpty } from 'lodash';
import { getChangelog } from '../../lib';
import moment from 'moment';
import { useAuth } from '../organisms/AuthContext';

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
    <div className="datapass-sticky-actions-dialog">
      <div className="datapass-sticky-actions-dialog-header">
        <div className="datapass-sticky-actions-dialog-header-title">
          {title}
        </div>
        <Button
          className="datapass-sticky-actions-dialog-header-action"
          onClick={() => onClose()}
          tertiaryNoOutline
        >
          Réduire
        </Button>
      </div>
      <div className="datapass-sticky-actions-dialog-body">{body}</div>
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

  const { user } = useAuth();
  const [currentAction, setCurrentAction] = useState<EnrollmentAction>(null);
  const authorizedEvents = listAuthorizedEvents(enrollment.acl);

  const handleActionChange = (action: EnrollmentAction) => {
    if (currentAction !== action) {
      setCurrentAction(action);
    } else {
      setCurrentAction(null);
    }
    onPromptCancellation();
  };

  const getContent = (currentAction: EnrollmentAction) => {
    switch (currentAction) {
      case EnrollmentEvent.instruct:
        return {
          title: 'Instruire',
          body: (
            <div className="datapass-instruct-dialog">
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
        let messages = chain(enrollment.events)
          .sortBy('created_at')
          .reject(
            ({ name, diff }) => name !== 'notify' && isEmpty(getChangelog(diff))
          )
          .value();

        return {
          title: 'Écrire au demandeur',
          body: (
            <div className="datapass-notify-dialog">
              <div className="datapass-notify-dialog-messages">
                {messages.map((message) => {
                  const isFromUser = message.user.id === user?.id;
                  return (
                    <div
                      key={message.id}
                      className={`datapass-notify-dialog-message ${
                        isFromUser && 'datapass-notify-dialog-message-from-user'
                      }`}
                    >
                      <div className="datapass-notify-dialog-message-content">
                        {message.comment}
                      </div>
                      <div className="datapass-notify-dialog-message-footer">
                        {moment(message.created_at).calendar()}
                      </div>
                    </div>
                  );
                })}
              </div>
              {pendingEvent &&
                eventConfigurations[pendingEvent].prompt ===
                  PromptType.notify && (
                  <Prompt
                    alignButtons="right"
                    onAccept={onPromptConfirmation}
                    displayProps={
                      eventConfigurations[pendingEvent!].displayProps
                    }
                    selectedEvent={pendingEvent as string}
                    enrollment={enrollment}
                  />
                )}
            </div>
          ),
        };

      default:
        return null;
    }
  };

  const content = getContent(currentAction);

  return (
    <div className="datapass-sticky-actions">
      {currentAction && content && (
        <StickyActionsDialog
          title={content.title}
          body={content.body}
          onClose={() => {
            handleActionChange(null);
          }}
        />
      )}
      <ButtonGroup className="datapass-sticky-actions-buttons" align="right">
        {user && user.roles.length > 1 && authorizedEvents.length > 1 && (
          <EventButton
            onClick={() => handleActionChange(EnrollmentEvent.instruct)}
            label="Instruction"
            icon="edit"
            quaternary={currentAction !== EnrollmentEvent.instruct}
            iconFill
          />
        )}
        {authorizedEvents.includes(EnrollmentEvent.notify) && (
          <EventButton
            onClick={() => {
              handleActionChange(EnrollmentEvent.notify);
              onEventButtonClick(EnrollmentEvent.notify);
            }}
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
