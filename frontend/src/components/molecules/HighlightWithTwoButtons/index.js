import Highlight from '../../atoms/Highlight';
import Button from '../../atoms/hyperTexts/Button';
import './style.css';

export const HighlightWithTwoButtons = ({
  title,
  children,
  onClick,
  handleClick,
}) => (
  <div className="datapass-container-two-btn">
    <Highlight className="datapass-highlight">
      <p className="fr-h5 fr-mb-3w">{title}</p>
      {children}
    </Highlight>
    <div className="datapass-two-btn">
      <div>
        <Button outline icon="edit" onClick={onClick}>
          Régider un message
        </Button>
      </div>
      <div>
        <Button outline handleClick={handleClick}>
          Marquer comme traité
        </Button>
      </div>
    </div>
  </div>
);

export default HighlightWithTwoButtons;
