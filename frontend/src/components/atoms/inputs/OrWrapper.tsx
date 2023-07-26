import { Fragment } from 'react';
import './OrWrapper.css';

type OrWrapperProps = {
  children: React.ReactNode[];
};

export const OrWrapper: React.FC<OrWrapperProps> = ({ children = [] }) => (
  <div className="or-input-form">
    {children.slice(0, 2).map((child, index) => (
      <Fragment key={index}>
        <div>{child}</div>
        {index < children.length - 1 && (
          <div className="separator">
            <span>ou</span>
          </div>
        )}
      </Fragment>
    ))}
  </div>
);

export default OrWrapper;
