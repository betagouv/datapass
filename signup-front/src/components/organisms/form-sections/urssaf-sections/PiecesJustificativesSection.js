import React, { useContext } from 'react';
import { FormContext } from '../../../templates/Form';
import { ScrollablePanel } from '../../Scrollable';
import FileInput from '../../../molecules/FileInput';
import ExpandableQuote from '../../../atoms/inputs/ExpandableQuote';

const SECTION_LABEL = 'Les pièces justificatives';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

export const PiecesJustificativesSection = ({
  showHabilitationServiceDomicile = false,
}) => {
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
          <a
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Document pdf précisant comment obtenir une attestation de régularité fiscale sur le site impots.gouv.fr"
            href="https://www.impots.gouv.fr/portail/professionnel/questions/comment-obtenir-une-attestation-de-regularite-fiscale"
          >
            Comment obtenir une attestation de régularité fiscale ?
          </a>
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
      {showHabilitationServiceDomicile && (
        <>
          <ExpandableQuote title="Pourquoi avons nous besoin de votre habilitation service à domicile ?">
            <p>
              Afin de vérifier que vous êtes habilité à fournir des prestations
              de services à domicile, merci de joindre un document justifiant
              que vous êtes agréé dans les conditions prévues à l’article L.
              7232-1 du code du travail, que vous procédez à la déclaration
              prévue à l’article L. 7232-1-1 du code du travail ou que vous
              disposez d’une autorisation en cours de validité pour exercer les
              activités relevant du I de l’article D. 312-6-2 du code de
              l’action sociale et des familles
            </p>
          </ExpandableQuote>
          <FileInput
            disabled={disabled}
            uploadedDocuments={documents}
            documentsToUpload={documents_attributes}
            documentType={'Document::HabilitationServiceDomicile'}
            onChange={onChange}
            label={'Habilitation service à domicile'}
          />
        </>
      )}
    </ScrollablePanel>
  );
};

PiecesJustificativesSection.sectionLabel = SECTION_LABEL;

export default PiecesJustificativesSection;
