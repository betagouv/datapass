import React, { MouseEventHandler, useContext } from 'react';
import { EventConfiguration } from '../../config/event-configuration';
import Button from './hyperTexts/Button';
import { FormContext } from '../templates/Form';

type Props = EventConfiguration['displayProps'] & {
  disabled?: boolean;
  quaternary?: boolean;
  iconFill?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

const EventButton: React.FC<Props> = ({
  label,
  getLabel = undefined,
  icon,
  disabled,
  onClick,
  secondary = false,
  quaternary = false,
  iconFill = false,
}) => {
  const { enrollment } = useContext(FormContext)!;

  return (
    // @ts-ignore
    <Button
      icon={icon}
      iconFill={iconFill}
      secondary={secondary}
      quaternary={quaternary}
      onClick={onClick}
      disabled={disabled}
    >
      {getLabel !== undefined && enrollment !== undefined
        ? getLabel(enrollment)
        : label}
    </Button>
  );
};

export default EventButton;
