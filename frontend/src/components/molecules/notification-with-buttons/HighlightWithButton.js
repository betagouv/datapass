import Highlight from '../../atoms/Highlight';
import Button from '../../atoms/hyperTexts/Button';
import './style.css';

export const HighlightWithButton = ({ title, children, onClick, label }) => (
  <div className="datapass-notification-with-buttons">
    <Highlight>
      <span className="fr-h5 fr-mb-3w">{title}</span>
      <p>{children}</p>
    </Highlight>
    <div className="datapass-notification-buttons">
      <div>
        <Button outline icon="edit" onClick={onClick}>
          {label}
        </Button>
      </div>
    </div>
  </div>
);

export default HighlightWithButton;
