import Alert from '../../atoms/Alert';
import Button from '../../atoms/hyperTexts/Button';
import './style.css';

export const AlertWithTwoButtons = ({
  title,
  children,
  labelAction1,
  labelAction2,
  onClickAction1,
  onClickAction2,
}) => (
  <div className="datapass-notification-with-buttons">
    <Alert type="warning" title={title}>
      {children}
    </Alert>
    <div className="datapass-notification-buttons">
      <Button outline icon="edit" onClick={onClickAction1}>
        {labelAction1}
      </Button>
      <Button outline onClick={onClickAction2}>
        {labelAction2}
      </Button>
    </div>
  </div>
);

export default AlertWithTwoButtons;
