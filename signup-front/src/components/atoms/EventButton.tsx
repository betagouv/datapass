import Loader from './Loader';
import React, { MouseEvent } from 'react';
import { EventConfiguration } from '../../config/event-configuration';
import Button from '../molecules/hyperTexts/Button';

type Props = EventConfiguration['displayProps'] & {
  disabled: boolean;
  loading: boolean;
  onClick: (event: MouseEvent<HTMLElement>) => void;
};

const EventButton: React.FC<Props> = ({
  label,
  icon,
  type,
  disabled,
  loading,
  onClick,
}) => (
  // @ts-ignore
  <Button icon={icon} type={type} large onClick={onClick} disabled={disabled}>
    <div>
      {label}
      {loading && (
        <>
          {' '}
          <Loader small />
        </>
      )}
    </div>
  </Button>
);

export default EventButton;
