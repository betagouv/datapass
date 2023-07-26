import './style.css';

type TagContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export const TagContainer: React.FC<TagContainerProps> = ({
  children,
  className = '',
}) => (
  <div className={`tag-container fr-tags-group ${className}`}>{children}</div>
);

export default TagContainer;
