import Loader from './Loader';
import { FunctionComponent, MouseEvent } from 'react';
import { ActionConfiguration } from '../../lib/enrollment-actions-configuration';
import Button from './Button';

type Props = ActionConfiguration['displayProps'] & {
  loading: boolean;
  isPendingAction: boolean;
  onClick: (event: MouseEvent<HTMLElement>) => void;
};

const FormActionButton: FunctionComponent<Props> = ({
  label,
  icon,
  type,
  loading,
  isPendingAction,
  onClick,
}) => (
  <Button
    href={null}
    icon={icon}
    type={type}
    large
    onClick={onClick}
    disabled={loading}
  >
    <div>
      {label}
      {isPendingAction && (
        <>
          {' '}
          <Loader small />
        </>
      )}
    </div>
  </Button>
);

export default FormActionButton;
