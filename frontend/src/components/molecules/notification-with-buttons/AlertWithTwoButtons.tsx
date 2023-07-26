import Alert, { AlertType } from '../../atoms/Alert';
import Button from '../../atoms/hyperTexts/Button';
import './style.css';

type AlertWithTwoButtonsProps = {
  children: React.ReactNode;
  title: string;
  labelAction1: string;
  labelAction2: string;
  onClickAction1: React.MouseEventHandler<HTMLElement>;
  onClickAction2: React.MouseEventHandler<HTMLElement>;
};

export const AlertWithTwoButtons: React.FC<AlertWithTwoButtonsProps> = ({
  title,
  children,
  labelAction1,
  labelAction2,
  onClickAction1,
  onClickAction2,
}) => (
  <div className="datapass-notification-with-buttons">
    <Alert type={AlertType.warning} title={title}>
      {children}
    </Alert>
    <div className="datapass-notification-buttons fr-btns-group--equisized">
      <Button secondary icon="edit" onClick={onClickAction1}>
        {labelAction1}
      </Button>
      <Button secondary onClick={onClickAction2}>
        {labelAction2}
      </Button>
    </div>
  </div>
);

export default AlertWithTwoButtons;
