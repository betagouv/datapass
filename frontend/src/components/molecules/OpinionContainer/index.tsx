import React from 'react';

import './index.css';
import EmailInput from '../../atoms/inputs/EmailInput';
import Button from '../../atoms/hyperTexts/Button';
import TextAreaInput from '../../atoms/inputs/TextAreaInput';

const OpinionContainer: React.FC<{
  activated: boolean;
  setActivated: Function;
}> = ({ activated, setActivated }) => {
  return (
    <div className={`opinion-container ${activated ? 'expanded' : ''}`}>
      <div className="opinion-wrapper">
        <div className="opinion-title">
          <img src="/images/opinion.svg" alt="Demande d'avis" />
          <h5>Demande d'avis</h5>
        </div>
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
      </div>
    </div>
  );
};

export default OpinionContainer;
