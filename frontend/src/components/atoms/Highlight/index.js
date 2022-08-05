import './style.css';

export const Highlight = ({ children }) => (
  <div className="fr-highlight datapass-highlight">
    <span className="fr-text--md">{children}</span>
  </div>
);

export default Highlight;
