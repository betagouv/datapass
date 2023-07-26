import './SideBySideWrapper.css';

type SideBySideWrapperProps = {
  children: React.ReactNode[];
};

export const SideBySideWrapper: React.FC<SideBySideWrapperProps> = ({
  children = [],
}) => (
  <div className="form-row">
    {children.slice(0, 2).map((child, index) =>
      child ? (
        <div key={index} className="form-col">
          {child}
        </div>
      ) : null
    )}
  </div>
);

export default SideBySideWrapper;
