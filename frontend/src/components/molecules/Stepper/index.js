import React from 'react';
import './style.css';
import { useDataProviderConfigurations } from '../../templates/hooks/use-data-provider-configurations';

const Stepper = ({
  steps,
  currentStep = null,
  previousStepNotCompleted = false,
}) => {
  const currentStepIndex = steps.findIndex((e) => e === currentStep);

  const { dataProviderConfigurations } = useDataProviderConfigurations();

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
          <div>{dataProviderConfigurations?.[e].label}</div>
        </li>
      ))}
      <li className="check-mark">
        <div>Vous pouvez ouvrir votre service !</div>
      </li>
    </ul>
  );
};

export default Stepper;
