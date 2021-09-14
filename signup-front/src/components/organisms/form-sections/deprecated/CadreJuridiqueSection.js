import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { ScrollablePanel } from '../../Scrollable';
import { FormContext } from '../../../templates/Form';
import OrWrapper from '../../../atoms/inputs/OrWrapper';
import FileInput from '../../../molecules/FileInput';
import TextAreaInput from '../../../atoms/inputs/TextAreaInput';
import TextInput from '../../../atoms/inputs/TextInput';

const SECTION_LABEL = 'Cadre juridique';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

const Label = ({ fondement_juridique_url }) => (
  <>
    Si possible, joindre l’URL du texte relatif au traitement{' '}
    {fondement_juridique_url && (
      <span>
        (
        <a
          href={fondement_juridique_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          accéder à cette URL
        </a>
        )
      </span>
    )}
  </>
);

const CadreJuridiqueSection = ({
  CadreJuridiqueDescription = () => null,
  fondementJuridiqueTitlePlaceholder,
}) => {
  const {
    disabled,
    onChange,
    enrollment: {
      fondement_juridique_title = '',
      fondement_juridique_url = '',
      documents = [],
      documents_attributes = [],
    },
  } = useContext(FormContext);

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>Le cadre juridique vous autorisant à traiter les données</h2>
      <CadreJuridiqueDescription />
      <TextAreaInput
        label={
          <>
            Précisez la nature et les références du texte vous autorisant à
            traiter les données
          </>
        }
        name="fondement_juridique_title"
        placeholder={
          fondementJuridiqueTitlePlaceholder ||
          '« loi », « décret », « délibération », etc.'
        }
        value={fondement_juridique_title}
        disabled={disabled}
        onChange={onChange}
        rows={1}
      />
      <OrWrapper>
        <TextInput
          label={<Label fondement_juridique_url={fondement_juridique_url} />}
          name="fondement_juridique_url"
          value={fondement_juridique_url}
          disabled={disabled}
          onChange={onChange}
        />
        <FileInput
          label="Joindre le document lui même"
          disabled={disabled}
          uploadedDocuments={documents}
          documentsToUpload={documents_attributes}
          documentType={'Document::LegalBasis'}
          onChange={onChange}
        />
      </OrWrapper>
    </ScrollablePanel>
  );
};

CadreJuridiqueSection.sectionLabel = SECTION_LABEL;

CadreJuridiqueSection.propTypes = {
  CadreJuridiqueDescription: PropTypes.func,
};

export default CadreJuridiqueSection;
