import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { ScrollablePanel } from '../Scrollable';
import { FormContext } from '../../templates/Form';
import OrWrapper from '../../atoms/inputs/OrWrapper';
import FileInput from '../../molecules/FileInput';
import TextAreaInput from '../../atoms/inputs/TextAreaInput';
import TextInput from '../../atoms/inputs/TextInput';
import ExpandableQuote from '../../atoms/inputs/ExpandableQuote';

const SECTION_LABEL = 'Le cadre juridique';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

const CadreJuridiqueSection = ({ CadreJuridiqueDescription = () => null }) => {
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
      <ExpandableQuote title="Comment trouver le cadre juridique ?">
        <CadreJuridiqueDescription />
      </ExpandableQuote>
      <h3>
        Vous souhaitez accéder, traiter et conserver des données personnelles.
        Quel est le cadre juridique qui autorise votre organisation à accéder à
        ces données ?
      </h3>
      <TextAreaInput
        label={
          <>
            Précisez la nature et les références du texte vous autorisant à
            traiter les données *
          </>
        }
        name="fondement_juridique_title"
        placeholder="« loi », « décret », « délibération », etc."
        value={fondement_juridique_title}
        disabled={disabled}
        onChange={onChange}
        rows={1}
        required
      />
      <OrWrapper>
        <TextInput
          label="URL du texte relatif au traitement"
          name="fondement_juridique_url"
          value={fondement_juridique_url}
          disabled={disabled}
          onChange={onChange}
          meta={
            fondement_juridique_url && (
              <a
                href={fondement_juridique_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Accéder au texts relatif au traitement"
              >
                accéder à cette URL
              </a>
            )
          }
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
