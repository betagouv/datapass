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
    <Alert type="warning">
      <p className="fr-h5 fr-mb-3w">{title}</p>
      {children}
    </Alert>
    <div className="datapass-notification-buttons">
      <div>
        <Button outline icon="edit" onClick={onClickAction1}>
          {labelAction1}
        </Button>
      </div>
      <div>
        <Button outline onClick={onClickAction2}>
          {labelAction2}
        </Button>
      </div>
    </div>
  </div>
);

export default AlertWithTwoButtons;
