import React, { MouseEvent } from 'react';
import { EventConfiguration } from '../../config/event-configuration';
import Button from './hyperTexts/Button';

type Props = EventConfiguration['displayProps'] & {
  disabled?: boolean;
  quaternary?: boolean;
  iconFill?: boolean;
  onClick: (event: MouseEvent<HTMLElement>) => void;
};

const EventButton: React.FC<Props> = ({
  label,
  icon,
  disabled,
  onClick,
  secondary = false,
  quaternary = false,
  iconFill = false,
}) => (
  // @ts-ignore
  <Button
    icon={icon}
    iconFill={iconFill}
    secondary={secondary}
    quaternary={quaternary}
    onClick={onClick}
    disabled={disabled}
  >
    {label}
  </Button>
);

export default EventButton;
