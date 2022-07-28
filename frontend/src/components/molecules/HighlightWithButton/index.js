import Highlight from '../../atoms/Highlight';
import Button from '../../atoms/hyperTexts/Button';
import './style.css';

export const HighlightWithButton = ({ title, children, onClick }) => (
  <div className="fr-container--fluid fr-mt-5w datapass-container">
    <Highlight className="datapass-highlight">
      <p className="fr-h5 fr-mb-3w">{title}</p>
      {children}
    </Highlight>
    <div className="fr-container--fluid datapass-container">
      <div>
        <Button outline icon="edit" onClick={onClick}>
          Régider un message
        </Button>
      </div>
    </div>
  </div>
);

export default HighlightWithButton;
