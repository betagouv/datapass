import { FunctionComponent, useState } from 'react';
import {
  EnrollmentEvent,
  eventConfigurations,
} from '../../config/event-configuration';
import EventButton from '../atoms/EventButton';
import ButtonGroup from './ButtonGroup';
import './EnrollmentActions.css';
import Button from '../atoms/hyperTexts/Button';

export const listAuthorizedEvents = (acl: Record<string, boolean>) =>
  (Object.keys(eventConfigurations) as EnrollmentEvent[]).filter(
    (key) => acl[key]
  );

type EnrollmentActionsProps = {
  acl: Record<string, boolean>;
  disabled: boolean;
  onEventButtonClick: Function;
};

type EnrollmentActionsDialogProps = {
  currentAction: EnrollmentAction;
  onClose: Function;
  authorizedEvents: EnrollmentEvent[];
};

type EnrollmentAction =
  | EnrollmentEvent.instruct
  | EnrollmentEvent.notify
  | null;

const EnrollmentActionsDialog: FunctionComponent<
  EnrollmentActionsDialogProps
> = ({ currentAction, onClose, authorizedEvents }) => {
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
                      onClick={() => console.log('Hey')}
                      {...eventConfiguration.displayProps}
                    />
                  );
                })}
            </div>
          ),
        };

      case EnrollmentEvent.notify:
        return {
          title: 'Écrire au demandeur',
          body: null,
        };

      default:
        break;
    }
  };

  const content = getContent(currentAction);

  return (
    currentAction && (
      <div className="enrollment-actions-dialog">
        <div className="enrollment-actions-dialog-header">
          <div className="enrollment-actions-dialog-header-title">
            {content?.title}
          </div>
          <Button
            className="enrollment-actions-dialog-header-action"
            onClick={() => onClose()}
            tertiaryNoOutline
          >
            Réduire
          </Button>
        </div>
        <div className="enrollment-actions-dialog-body">{content?.body}</div>
      </div>
    )
  );
};

export const EnrollmentActions: FunctionComponent<EnrollmentActionsProps> = ({
  acl,
  disabled,
}) => {
  const [currentAction, setCurrentAction] = useState<EnrollmentAction>(null);
  const authorizedEvents = listAuthorizedEvents(acl);

  const toggleCurrentAction = (action: EnrollmentAction) =>
    setCurrentAction((prevAction) => (prevAction === action ? null : action));

  return (
    <div className="enrollment-actions">
      <EnrollmentActionsDialog
        currentAction={currentAction}
        onClose={() => setCurrentAction(null)}
        authorizedEvents={authorizedEvents}
      />
      <ButtonGroup alignRight>
        {authorizedEvents.length > 1 && (
          <EventButton
            disabled={disabled}
            onClick={() => toggleCurrentAction(EnrollmentEvent.instruct)}
            label="Instruction"
            icon="edit"
          />
        )}
        {authorizedEvents.includes(EnrollmentEvent.notify) && (
          <EventButton
            disabled={disabled}
            onClick={() => toggleCurrentAction(EnrollmentEvent.notify)}
            label="Messagerie"
            icon="mail"
          />
        )}
      </ButtonGroup>
    </div>
  );
};

export default EnrollmentActions;
