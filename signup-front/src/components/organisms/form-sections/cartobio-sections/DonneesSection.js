import React, { useContext } from 'react';
import { ScrollablePanel } from '../../Scrollable';
import { FormContext } from '../../../templates/Form';
import FileInput from '../../../molecules/FileInput';
import OrWrapper from '../../../atoms/inputs/OrWrapper';
import TextAreaInput from '../../../atoms/inputs/TextAreaInput';

const SECTION_LABEL = 'Données';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

export const DonneesSection = () => {
  const {
    disabled,
    onChange,
    enrollment: {
      additional_content: { location_scopes = '' },
      documents = [],
      documents_attributes = [],
    },
  } = useContext(FormContext);

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>Les périmètres de données dont vous avez besoin</h2>
      <OrWrapper>
        <TextAreaInput
          label={
            <>
              Indiquez l’entité administrative concernée : commune(s) (nom ou
              code INSEE), EPCI (nom et/ou code INSEE), numéro de département ou
              région :
            </>
          }
          placeholder="« 93032,93077 », « 200054781,200054781 », « 93 », etc."
          name="additional_content.location_scopes"
          value={location_scopes}
          disabled={disabled}
          onChange={onChange}
          rows={5}
        />
        <FileInput
          label={
            <>
              Joindre les contours géographiques au format Shapefile ou GeoJSON,
              tel quel ou zippé :
            </>
          }
          mimeTypes="*"
          disabled={disabled}
          uploadedDocuments={documents}
          documentsToUpload={documents_attributes}
          documentType={'Document::GeoShape'}
          onChange={onChange}
        />
      </OrWrapper>
    </ScrollablePanel>
  );
};

DonneesSection.sectionLabel = SECTION_LABEL;

export default DonneesSection;
