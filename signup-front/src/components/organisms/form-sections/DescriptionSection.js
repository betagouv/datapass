import React, { useContext } from 'react';
import { ScrollablePanel } from '../Scrollable';
import { FormContext } from '../../templates/Form';
import PropTypes from 'prop-types';
import TextInput from '../../atoms/inputs/TextInput';
import TextAreaInput from '../../atoms/inputs/TextAreaInput';
import FileInput from '../../molecules/FileInput';
import Input from '../../atoms/inputs/input';

const SECTION_LABEL = 'Le projet';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

const DescriptionSection = ({ descriptionPlaceholder = '' }) => {
  const {
    disabled,
    onChange,
    enrollment: {
      intitule = '',
      description = '',
      date_mise_en_production = '',
      volumetrie_approximative = '',
      documents = [],
      documents_attributes = [],
    },
  } = useContext(FormContext);

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>Le projet</h2>
      <h3>Quel projet êtes vous en train de réaliser ?</h3>
      <TextInput
        label="Nom du projet *"
        meta="Cette information peut être rendue publique"
        name="intitule"
        value={intitule}
        disabled={disabled}
        onChange={onChange}
        required
      />
      <TextAreaInput
        label="Description du projet (à quoi va-t-il servir ? qui l’utilisera ?) *"
        name="description"
        placeholder={descriptionPlaceholder}
        value={description}
        disabled={disabled}
        onChange={onChange}
        required
      />
      <FileInput
        label="Maquette du projet"
        mimeTypes="*"
        uploadedDocuments={documents}
        documentsToUpload={documents_attributes}
        documentType={'Document::MaquetteProjet'}
        disabled={disabled}
        onChange={onChange}
      />
      <Input
        label="Date de mise en production prévue"
        name="date_mise_en_production"
        value={date_mise_en_production}
        disabled={disabled}
        onChange={onChange}
      />
      <Input
        label="Volumétrie approximative"
        name="volumetrie_approximative"
        meta="ex: nombre de démarches ou dossiers traités dans l’année"
        value={volumetrie_approximative}
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
