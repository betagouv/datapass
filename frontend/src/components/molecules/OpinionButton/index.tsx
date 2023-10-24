import React from 'react';
import Button from '../../atoms/hyperTexts/Button';

import './index.css';
import { OpinionIcon } from '../../atoms/OpinionIcon';

const OpinionButton: React.FC<{
  activated: boolean;
  setActivated: Function;
  disabled?: boolean;
}> = ({ activated, setActivated, disabled = false }) => {
  let classNames = 'opinion-button';
  if (activated) {
    classNames += ' activated';
  }

  return (
    <Button
      className={classNames}
      quaternary
      disabled={disabled}
      onClick={() => setActivated(true)}
    >
      <OpinionIcon
        bullColor={disabled ? '#929292' : '#000091'}
        heartColor={disabled ? '#929292' : '#0063CB'}
      />
      Demander un avis
    </Button>
  );
};

export default OpinionButton;
