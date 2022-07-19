import Button from '../hyperTexts/Button';
import './style.css';

export const Highlight = ({ title, children, onClick }) => (
  <div
    className="fr-container--fluid
fr-mt-5w"
  >
    <div className="fr-highlight">
      <p className="fr-h5 fr-mb-3w">{title}</p>
      <p className="fr-text--md">{children}</p>
    </div>
    <div className="fr-container--fluid">
      <div className="fr-mt-5w">
        <Button outline icon="edit" onClick={onClick}>
          Régider un message
        </Button>
      </div>
    </div>
  </div>
);

export default Highlight;
