import React, { useContext } from 'react';
import { ScrollablePanel } from '../../Scrollable';
import { FormContext } from '../../../templates/Form';
import PropTypes from 'prop-types';
import TextInput from '../../../atoms/inputs/TextInput';
import TextAreaInput from '../../../atoms/inputs/TextAreaInput';

const SECTION_LABEL = 'Description';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

const DescriptionSection = ({
  title,
  intituleLabel,
  intitulePlaceholder = '',
  descriptionPlaceholder = '',
  descriptionHelper = null,
}) => {
  const {
    disabled,
    onChange,
    enrollment: { intitule = '', description = '' },
  } = useContext(FormContext);

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>{title || 'Description de votre service'}</h2>
      <TextInput
        label={intituleLabel || 'Nom du service'}
        helper={
          'Il doit permettre de faciliter l’identification de votre service. Cette information pouvant être rendue ' +
          'publique, il convient d’être synthétique et précis.'
        }
        meta="Cette information peut être rendue publique."
        name="intitule"
        placeholder={intitulePlaceholder}
        value={intitule}
        disabled={disabled}
        onChange={onChange}
      />
      <TextAreaInput
        label="Description détaillée"
        helper={
          descriptionHelper
            ? descriptionHelper
            : 'À quoi sert le service numérique qui consommera la donnée ?'
        }
        name="description"
        placeholder={descriptionPlaceholder}
        value={description}
        disabled={disabled}
        onChange={onChange}
      />
    </ScrollablePanel>
  );
};

DescriptionSection.sectionLabel = SECTION_LABEL;

DescriptionSection.propTypes = {
  intitulePlaceholder: PropTypes.string,
  descriptionPlaceholder: PropTypes.string,
  descriptionHelper: PropTypes.string,
};

export default DescriptionSection;
