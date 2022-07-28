import './style.css';

export const Highlight = ({ children }) => (
  <div className="fr-highlight datapass-highlight">
    <p className="fr-text--md">{children}</p>
  </div>
);

export default Highlight;
