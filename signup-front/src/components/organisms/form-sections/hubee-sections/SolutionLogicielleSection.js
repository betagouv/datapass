import React, { useContext } from 'react';
import { FormContext } from '../../../templates/Form';
import { ScrollablePanel } from '../../Scrollable';
import TextInput from '../../../atoms/inputs/TextInput';

const SECTION_LABEL = 'Solution logicielle';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

export const SolutionLogicielleSection = () => {
  const {
    disabled,
    onChange,
    enrollment: {
      additional_content: {
        nom_application_metier = '',
        nom_editeur = '',
        numero_version = '',
      },
    },
  } = useContext(FormContext);

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>Informations sur votre application métier</h2>
      <TextInput
        label="Nom de l’application métier"
        name="additional_content.nom_application_metier"
        value={nom_application_metier}
        disabled={disabled}
        onChange={onChange}
      />
      <TextInput
        label="Nom de l’éditeur"
        name="additional_content.nom_editeur"
        value={nom_editeur}
        disabled={disabled}
        onChange={onChange}
      />
      <TextInput
        label="Numéro de version"
        name="additional_content.numero_version"
        value={numero_version}
        disabled={disabled}
        onChange={onChange}
      />
    </ScrollablePanel>
  );
};

SolutionLogicielleSection.sectionLabel = SECTION_LABEL;

export default SolutionLogicielleSection;
