import React from 'react';
import './OrWrapper.css';

export const OrWrapper = ({ children = [] }) => (
  <div className="form__group or-input-form">
    {children.slice(0, 2).map((child, index) => (
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

export default OrWrapper;
