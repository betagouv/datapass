import React, { MouseEventHandler } from 'react';
import Button from '../../atoms/hyperTexts/Button';
import { OpinionIcon } from '../../atoms/OpinionIcon';

import './index.css';

const AnswerButton = ({
  disabled = false,
  hidden = false,
  onClick,
  children,
}: {
  disabled?: boolean;
  hidden?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}) => {
  let classNames = 'answer-button';
  if (hidden) {
    classNames += ' hidden';
  }

  return (
    <Button
      className={classNames}
      quaternary
      disabled={disabled}
      onClick={onClick}
    >
      <OpinionIcon
        bullColor={disabled ? '#929292' : '#000091'}
        heartColor={disabled ? '#929292' : '#0063CB'}
      />
      {children}
    </Button>
  );
};

export default AnswerButton;
