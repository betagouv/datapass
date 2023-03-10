import './style.css';

export const TagContainer = ({ children, className = '' }) => (
  <div className={`tag-container fr-tags-group ${className}`}>{children}</div>
);

export default TagContainer;
