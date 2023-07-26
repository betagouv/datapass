interface Props {
  children: React.ReactNode;
}

export const Highlight: React.FC<Props> = ({ children }) => (
  <div className="fr-highlight">
    <p className="fr-text--md">{children}</p>
  </div>
);

export default Highlight;
