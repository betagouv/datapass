import Loader from './Loader';
import { FunctionComponent, MouseEvent } from 'react';
import { EventConfiguration } from '../../config/event-configuration';
import Button from './Button';

type Props = EventConfiguration['displayProps'] & {
  disabled: boolean;
  loading: boolean;
  onClick: (event: MouseEvent<HTMLElement>) => void;
};

const EventButton: FunctionComponent<Props> = ({
  label,
  icon,
  type,
  disabled,
  loading,
  onClick,
}) => (
  <Button
    href={null}
    icon={icon}
    type={type}
    large
    onClick={onClick}
    disabled={disabled}
  >
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
