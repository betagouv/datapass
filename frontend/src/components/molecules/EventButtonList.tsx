import { FunctionComponent, MouseEvent } from 'react';
import {
  EnrollmentEvent,
  eventConfigurations,
} from '../../config/event-configuration';
import EventButton from '../atoms/EventButton';
import ButtonGroup from './ButtonGroup';

export const listAuthorizedEvents = (acl: Record<string, boolean>) =>
  (Object.keys(eventConfigurations) as EnrollmentEvent[]).filter(
    (key) => acl[key]
  );

type Props = {
  acl: Record<string, boolean>;
  disabled: boolean;
  onEventButtonClick: Function;
};

export const EventButtonList: FunctionComponent<Props> = ({
  acl,
  disabled,
  onEventButtonClick,
}) => {
  const authorizedEvents = listAuthorizedEvents(acl);

  return (
    <ButtonGroup alignRight>
      {authorizedEvents.map((event) => {
        const eventConfiguration = eventConfigurations[event];
        const onClick = (e: MouseEvent<HTMLElement>) => {
          e.preventDefault();
          onEventButtonClick(event);
        };
        return (
          <EventButton
            key={event}
            disabled={disabled}
            onClick={onClick}
            {...eventConfiguration.displayProps}
          />
        );
      })}
    </ButtonGroup>
  );
};

export default EventButtonList;
