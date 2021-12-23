import React from 'react';
import './style.css';
import { DATA_PROVIDER_LABELS } from '../../../config/data-provider-parameters';

const Stepper = ({
  steps,
  currentStep = null,
  previousStepNotCompleted = false,
}) => {
  const currentStepIndex = steps.findIndex((e) => e === currentStep);

  const getStepCssClass = (index) => {
    if (!currentStep) {
      return '';
    }
    if (previousStepNotCompleted) {
      if (index < currentStepIndex - 1) {
        return 'warning';
      }
      if (index === currentStepIndex - 1) {
        return 'warning active';
      }
      return '';
    }
    if (index < currentStepIndex) {
      return 'done';
    }
    if (index === currentStepIndex) {
      return 'active';
    }
    return '';
  };

  return (
    <ul className="steps-form">
      {steps.map((e, i) => (
        <li key={e} className={getStepCssClass(i)}>
          <div>{DATA_PROVIDER_LABELS[e]}</div>
        </li>
      ))}
      <li className="check-mark">
        <div>Vous pouvez ouvrir votre service !</div>
      </li>
    </ul>
  );
};

export default Stepper;
