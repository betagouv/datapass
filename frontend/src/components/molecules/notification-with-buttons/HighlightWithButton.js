import Highlight from '../../atoms/Highlight';
import Button from '../../atoms/hyperTexts/Button';
import './style.css';

export const HighlightWithButton = ({ title, children, onClick, label }) => (
  <div className="datapass-notification-with-buttons">
    <Highlight>
      <span className="fr-h5">{title}</span>
      <br />
      {children}
    </Highlight>
    <div className="datapass-notification-buttons">
      <Button secondary icon="edit" onClick={onClick}>
        {label}
      </Button>
    </div>
  </div>
);

export default HighlightWithButton;
