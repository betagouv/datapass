import React from 'react';
import './style.css';

const Loader = ({ message = null, small = false }) => {
  if (small) {
    return (
      <span className="loader-container small">
        <span className="loader" />
      </span>
    );
  }

  return (
    <div className="loader-container">
      {!!message && <div className="message">{message}</div>}
      <div className="loader" />
    </div>
  );
};

export default Loader;
