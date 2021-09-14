import React, { useContext } from 'react';
import FileInput from '../../../molecules/FileInput';
import { ScrollablePanel } from '../../Scrollable';
import { FormContext } from '../../../templates/Form';
import Quote from '../../../atoms/inputs/Quote';
import TextInput from '../../../atoms/inputs/TextInput';
import DateInput from '../../../atoms/inputs/DateInput';

const SECTION_LABEL = 'Homologation de sécurité';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

const HomologationSecuriteSection = () => {
  const {
    disabled,
    onChange,
    enrollment: {
      documents = [],
      documents_attributes = [],
      additional_content: {
        autorite_homologation_nom = '',
        autorite_homologation_fonction = '',
        date_homologation = '',
        date_fin_homologation = '',
      },
    },
  } = useContext(FormContext);

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>Homologation de sécurité</h2>
      <Quote>
        <p>
          Le Référentiel Général de Sécurité (RGS 2.0) rend la démarche
          d’homologation obligatoire pour les SI relatifs aux échanges entre une
          autorité administrative et les usagers ou entre autorités
          administratives.
        </p>
        <p>
          Complétez les informations relatives à l’homologation et déposez la
          décision formelle d’homologation (également appelée attestation
          formelle).
        </p>
      </Quote>
      <TextInput
        label="Nom de l’autorité d’homologation"
        name="additional_content.autorite_homologation_nom"
        value={autorite_homologation_nom}
        disabled={disabled}
        onChange={onChange}
      />
      <TextInput
        label="Fonction de l’autorité d’homologation"
        name="additional_content.autorite_homologation_fonction"
        value={autorite_homologation_fonction}
        disabled={disabled}
        onChange={onChange}
      />
      <DateInput
        label="Date de début de l’homologation"
        name="additional_content.date_homologation"
        value={date_homologation}
        disabled={disabled}
        onChange={onChange}
      />
      <DateInput
        label="Date de fin de l’homologation"
        name="additional_content.date_fin_homologation"
        value={date_fin_homologation}
        disabled={disabled}
        onChange={onChange}
      />
      <FileInput
        disabled={disabled}
        uploadedDocuments={documents}
        documentsToUpload={documents_attributes}
        documentType={'Document::DecisionHomologation'}
        onChange={onChange}
        label={'Décision d’homologation'}
      />
    </ScrollablePanel>
  );
};

HomologationSecuriteSection.sectionLabel = SECTION_LABEL;

export default HomologationSecuriteSection;
