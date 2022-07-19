import React, { useCallback, useEffect, useState } from 'react';
import './style.css';

const Loader = ({
  message = '',
  small = false,
  enableBePatientMessage = false,
}) => {
  const [bePatientMessage, setBePatientMessage] = useState('');

  const bePatientEffect = useCallback(
    (message, timeInSecond) => {
      if (enableBePatientMessage) {
        const timer = setTimeout(
          () => setBePatientMessage(message),
          timeInSecond * 1000
        );

        return () => clearTimeout(timer);
      }
    },
    [enableBePatientMessage]
  );

  useEffect(
    () =>
      bePatientEffect(
        'Le traitement prend plus longtemps que prévu, merci de patienter...',
        5
      ),
    [bePatientEffect]
  );

  useEffect(
    () =>
      bePatientEffect(
        'Nous interrogeons des systèmes tiers ce qui peut prendre jusqu’à une minute...',
        20
      ),
    [bePatientEffect]
  );

  useEffect(
    () =>
      bePatientEffect(
        'Le traitement est anormalement long. Vous pouvez signaler ce problème à contact@api.gouv.fr.',
        60
      ),
    [bePatientEffect]
  );

  if (small) {
    return (
      <span className="loader-container small">
        <span className="loader" />
      </span>
    );
  }

  return (
    <div className="loader-container">
      {!bePatientMessage && !!message && (
        <div className="message">{message}</div>
      )}
      {bePatientMessage && <div className="message">{bePatientMessage}</div>}
      <div className="loader" />
    </div>
  );
};

export default Loader;
