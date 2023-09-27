import React, { useContext } from 'react';
import FileInput from '../../../molecules/FileInput';
import { ScrollablePanel } from '../../Scrollable';
import { FormContext } from '../../../templates/Form';
import ExpandableQuote from '../../../molecules/ExpandableQuote';
import Link from '../../../atoms/hyperTexts/Link';
import TextInput from '../../../atoms/inputs/TextInput';
import DateInput from '../../../atoms/inputs/DateInput';

const SECTION_LABEL = 'L’homologation de sécurité';
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
  } = useContext(FormContext)!;

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>L’homologation de sécurité</h2>
      <ExpandableQuote title="Pourquoi effectuer une homologation de sécurité ?">
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
        <p>
          Toutefois, si votre organisme n’est pas soumis au RGS, vous pouvez
          remplir un questionnaire de sécurité à récupérer auprès de la DTNum à
          l’adresse mail suivante :{' '}
          <Link
            inline
            href="mailto:dtnum.donnees.demande-acces@dgfip.finances.gouv.fr"
          >
            dtnum.donnees.demande-acces@dgfip.finances.gouv.fr
          </Link>
          , et à joindre dans le formulaire ci-dessous.
        </p>
      </ExpandableQuote>
      <TextInput
        label="Nom de l’autorité d’homologation ou du signataire du questionnaire de sécurité"
        name="additional_content.autorite_homologation_nom"
        value={autorite_homologation_nom}
        disabled={disabled}
        onChange={onChange}
        required
      />
      <TextInput
        label="Fonction de l’autorité d’homologation ou du signataire du questionnaire de sécurité"
        name="additional_content.autorite_homologation_fonction"
        value={autorite_homologation_fonction}
        disabled={disabled}
        onChange={onChange}
        required
      />
      <DateInput
        label="Date de début de l’homologation ou de signature du questionnaire de sécurité"
        name="additional_content.date_homologation"
        value={date_homologation}
        disabled={disabled}
        onChange={onChange}
        required
      />
      <DateInput
        label="Date de fin de l’homologation"
        name="additional_content.date_fin_homologation"
        value={date_fin_homologation}
        disabled={disabled}
        onChange={onChange}
        required
      />
      <FileInput
        label="Joindre la décision d’homologation ou le questionnaire de sécurité"
        disabled={disabled}
        uploadedDocuments={documents}
        documentsToUpload={documents_attributes}
        documentType={'Document::DecisionHomologation'}
        onChange={onChange}
        required
      />
    </ScrollablePanel>
  );
};

HomologationSecuriteSection.sectionLabel = SECTION_LABEL;

export default HomologationSecuriteSection;
