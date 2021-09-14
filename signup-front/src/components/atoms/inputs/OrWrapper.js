import React from 'react';
import './OrWrapper.css';

export const OrWrapper = ({ children = [] }) => {
  return (
    <div id="or-input-form" className="form__group">
      {children.map((child, index) => (
        <React.Fragment key={index}>
          <div>{child}</div>
          {index < children.length - 1 && (
            <div className="separator">
              <span>ou</span>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default OrWrapper;
