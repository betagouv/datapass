import {
  FunctionComponent,
  MouseEventHandler,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  EnrollmentEvent,
  EventConfiguration,
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
import { chain } from 'lodash';
import moment from 'moment';
import { useAuth } from '../organisms/AuthContext';
import { markEventAsRead } from '../../services/enrollments';
import { Event } from '../../config';

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
  const [notifyPrompt, setNotifyPrompt] = useState('');
  const [commentPrompt, setCommentPrompt] = useState('');
  const { user, getIsUserAnInstructor } = useAuth();
  const [hasUnprocessedMessages, setHasUnprocessedMessage] = useState(false);
  const [currentAction, setCurrentAction] = useState<EnrollmentAction>(null);
  const authorizedEvents: EnrollmentEvent[] = listAuthorizedEvents(
    enrollment.acl
  );

  const [messages, setMessages] = useState<Event[]>([]);

  const extractMessagesFromEvents = (events: Event[]) =>
    chain(events)
      .sortBy('created_at')
      .filter(({ name }) => name === EnrollmentEvent.notify)
      .value();

  useEffect(() => {
    if (enrollment) {
      setMessages(extractMessagesFromEvents(enrollment.events));
      setHasUnprocessedMessage(
        enrollment.unprocessed_notify_events_from_demandeurs_count > 0
      );
    }
  }, [enrollment]);

  const handleActionChange = (action: EnrollmentAction) => {
    if (currentAction !== action) {
      setCurrentAction(action);
    } else {
      setCurrentAction(null);
    }
    onPromptCancellation();
  };

  const instructionAuthorizedEvents = authorizedEvents.filter(
    (event) => event !== EnrollmentEvent.notify
  );

  const getEventButtonList = () =>
    instructionAuthorizedEvents.map((event) => {
      const eventConfiguration = eventConfigurations[event];

      if (eventConfiguration) {
        return (
          <EventButton
            key={event}
            disabled={!!pendingEvent || loading}
            onClick={() => onEventButtonClick(event)}
            {...eventConfiguration.displayProps}
          />
        );
      }

      return null;
    });

  const isUserAnInstructor = useMemo(() => {
    return getIsUserAnInstructor(enrollment.target_api);
  }, [getIsUserAnInstructor, enrollment]);

  const getContent = (currentAction: EnrollmentAction) => {
    switch (currentAction) {
      case EnrollmentEvent.instruct:
        return {
          title: 'Instruire',
          body: (
            <div className="datapass-instruct-dialog">
              <div>Comment souhaitez vous instruire cette demande ?</div>
              {pendingEvent || loading ? null : getEventButtonList()}

              {loading && <Loader enableBePatientMessage />}

              {pendingEvent &&
                eventConfigurations[pendingEvent] &&
                eventConfigurations[pendingEvent]?.prompt ===
                  PromptType.comment && (
                  <Prompt
                    inputValue={commentPrompt}
                    setInputValue={setCommentPrompt}
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
                      Souhaitez-vous soumettre votre habilitation à validation,
                      afin qu'elle soit étudiée par les équipes compétentes ?
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
            </div>
          ),
        };

      case EnrollmentEvent.notify:
        return {
          title: `Écrire ${
            isUserAnInstructor ? 'au demandeur' : 'à l’instructeur'
          }`,
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
                eventConfigurations[pendingEvent] &&
                eventConfigurations[pendingEvent]?.prompt ===
                  PromptType.notify && (
                  <Prompt
                    hideMostUsedComments
                    inputValue={notifyPrompt}
                    setInputValue={setNotifyPrompt}
                    alignButtons="right"
                    onAccept={(inputValue: string) => {
                      onPromptConfirmation(inputValue);
                      setNotifyPrompt('');
                      const fakeNotifyEvent: Event = {
                        id: 1234,
                        name: EnrollmentEvent.notify,
                        comment: inputValue,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        user: user!,
                      };
                      setMessages((prev) => [...prev, fakeNotifyEvent]);
                    }}
                    displayProps={
                      eventConfigurations[pendingEvent!]
                        ?.displayProps as EventConfiguration['displayProps']
                    }
                    selectedEvent={pendingEvent}
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
        {user &&
          user.roles &&
          user.roles.length > 1 &&
          !!instructionAuthorizedEvents.length && (
            <div className="datapass-sticky-actions-container">
              <EventButton
                onClick={() => handleActionChange(EnrollmentEvent.instruct)}
                label="Instruction"
                icon="edit"
                quaternary={currentAction !== EnrollmentEvent.instruct}
                iconFill
              />
            </div>
          )}
        {authorizedEvents.includes(EnrollmentEvent.notify) && (
          <div className="datapass-sticky-actions-container">
            <EventButton
              onClick={() => {
                handleActionChange(EnrollmentEvent.notify);
                onEventButtonClick(EnrollmentEvent.notify);
                markEventAsRead({
                  id: enrollment?.id,
                  event_name: EnrollmentEvent.notify,
                });
                setHasUnprocessedMessage(false);
              }}
              label="Messagerie"
              icon="mail"
              quaternary={currentAction !== EnrollmentEvent.notify}
              iconFill
            />
            {hasUnprocessedMessages ? (
              <div className="red-dot datapass-sticky-actions-notification"></div>
            ) : null}
          </div>
        )}
      </ButtonGroup>
    </div>
  );
};

export default StickyActions;
