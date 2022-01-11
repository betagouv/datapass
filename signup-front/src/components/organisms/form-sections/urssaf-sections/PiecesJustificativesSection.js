import React, { useContext } from 'react';
import { FormContext } from '../../../templates/Form';
import { ScrollablePanel } from '../../Scrollable';
import FileInput from '../../../molecules/FileInput';
import ExpandableQuote from '../../../atoms/inputs/ExpandableQuote';
import Link from '../../../atoms/hyperTexts/Link';

const SECTION_LABEL = 'Les pièces justificatives';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

export const PiecesJustificativesSection = () => {
  const {
    disabled,
    onChange,
    enrollment: { documents = [], documents_attributes = [] },
  } = useContext(FormContext);

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>{SECTION_LABEL}</h2>
      <ExpandableQuote title="Pourquoi avons nous besoin de votre attestation de régularité fiscale ?">
        <p>
          Afin de vérifier que vous êtes en pleine connaissance de vos
          obligations fiscales (paiement de la TVA et de l’impôt sur le revenu
          ou sur les sociétés selon votre situation), merci de joindre une
          attestation fiscale justifiant de la régularité de votre situation
          fiscale.
        </p>
        <p>
          <Link
            inline
            newTab
            aria-label="Document pdf précisant comment obtenir une attestation de régularité fiscale sur le site impots.gouv.fr"
            href="https://www.impots.gouv.fr/portail/professionnel/questions/comment-obtenir-une-attestation-de-regularite-fiscale"
          >
            Comment obtenir une attestation de régularité fiscale ?
          </Link>
        </p>
      </ExpandableQuote>
      <FileInput
        disabled={disabled}
        uploadedDocuments={documents}
        documentsToUpload={documents_attributes}
        documentType={'Document::AttestationFiscale'}
        onChange={onChange}
        label={'Attestation de régularité fiscale'}
      />
    </ScrollablePanel>
  );
};

PiecesJustificativesSection.sectionLabel = SECTION_LABEL;

export default PiecesJustificativesSection;
