import React, { MouseEvent } from 'react';
import { EventConfiguration } from '../../config/event-configuration';
import Button from './hyperTexts/Button';

type Props = EventConfiguration['displayProps'] & {
  disabled: boolean;
  onClick: (event: MouseEvent<HTMLElement>) => void;
};

const EventButton: React.FC<Props> = ({
  label,
  icon,
  type,
  disabled,
  onClick,
}) => (
  // @ts-ignore
  <Button icon={icon} type={type} large onClick={onClick} disabled={disabled}>
    {label}
  </Button>
);

export default EventButton;
