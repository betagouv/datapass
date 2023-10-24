import React from 'react';
import Button from '../../atoms/hyperTexts/Button';

import './index.css';

const OpinionButton: React.FC<{
  activated: boolean;
  setActivated: Function;
}> = ({ activated, setActivated }) => {
  let classNames = 'opinion-button';
  if (activated) {
    classNames += ' activated';
  }

  return (
    <Button
      className={classNames}
      quaternary
      onClick={() => setActivated(true)}
    >
      <img src="/images/opinion.svg" alt="Demande d'avis" />
      Demander un avis
    </Button>
  );
};

export default OpinionButton;
