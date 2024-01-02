interface Props {
  children: React.ReactNode;
  title?: string;
}

export const Highlight: React.FC<Props> = ({ children, title }) => (
  <div className="fr-highlight" style={{ backgroundColor: '#EEEEEE' }}>
    <div style={{ padding: '20px 10px' }}>
      {title && <h6>{title}</h6>}
      <div>{children}</div>
    </div>
  </div>
);

export default Highlight;
