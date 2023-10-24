import React from 'react';

import './index.css';
import EmailInput from '../../atoms/inputs/EmailInput';
import Button from '../../atoms/hyperTexts/Button';
import TextAreaInput from '../../atoms/inputs/TextAreaInput';
import { Opinion } from '../../../config';

const OpinionForm: React.FC<{
  setActivated: Function;
}> = ({ setActivated }) => {
  return (
    <div className="opinion-form">
      <div className="opinion-form-fields">
        <EmailInput label="Vous souhaitez contacter" />
        <TextAreaInput rows={5} label="Votre message" />
      </div>
      <div className="opinion-form-buttons">
        <Button onClick={() => setActivated(false)} secondary>
          Annuler
        </Button>
        <Button icon="send-plane" iconFill>
          Envoyer
        </Button>
      </div>
    </div>
  );
};

const OpinionContainer: React.FC<{
  activated: boolean;
  setActivated: Function;
  opinions?: Opinion[];
}> = ({ activated, setActivated, opinions = [1, 2] }) => {
  return (
    <div className={`opinion-container ${activated ? 'expanded' : ''}`}>
      <div
        className={`opinion-wrapper ${!!opinions.length ? 'has-opinions' : ''}`}
      >
        <div className="opinion-title">
          <img src="/images/opinion.svg" alt="Demande d'avis" />
          <h5>Demande d'avis</h5>
        </div>
        <OpinionForm setActivated={setActivated} />
      </div>
    </div>
  );
};

export default OpinionContainer;
