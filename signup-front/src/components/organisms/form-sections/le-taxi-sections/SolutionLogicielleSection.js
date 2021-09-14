import React, { useContext } from 'react';
import { FormContext } from '../../../templates/Form';
import { ScrollablePanel } from '../../Scrollable';
import Quote from '../../../atoms/inputs/Quote';
import RadioInput from '../../../atoms/inputs/RadioInput';

const SECTION_LABEL = 'Solution logicielle';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

export const SolutionLogicielleSection = () => {
  const {
    disabled,
    onChange,
    enrollment: {
      additional_content: { solution_logicielle = '' },
    },
  } = useContext(FormContext);

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>Quelle solution logicielle utilisez-vous ?</h2>
      <Quote>
        <p>
          Si vous utilisez une solution proposée par un éditeur, celui-ci sera
          informé de votre souhait de connecter votre flotte à l’API. Si vous
          utilisez une autre solution, vous devrez effectuer les développements
          pour vous connecter (vous pouvez consulter la documentation technique
          sur notre site)
        </p>
      </Quote>
      <RadioInput
        label={'Solution logicielle utilisée'}
        options={[
          { id: 'axygest', label: 'Axygest' },
          { id: 'tessa', label: 'Tessa' },
          { id: 'appsolu', label: 'Appsolu' },
          { id: 'solution_interne', label: 'Solution développée en interne' },
        ]}
        name={'additional_content.solution_logicielle'}
        value={solution_logicielle}
        disabled={disabled}
        onChange={onChange}
      />
    </ScrollablePanel>
  );
};

SolutionLogicielleSection.sectionLabel = SECTION_LABEL;

export default SolutionLogicielleSection;
