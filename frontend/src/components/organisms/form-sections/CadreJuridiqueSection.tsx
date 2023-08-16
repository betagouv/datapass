import React, { useContext, useEffect } from 'react';
import { ScrollablePanel } from '../Scrollable';
import { FormContext } from '../../templates/Form';
import OrWrapper from '../../atoms/inputs/OrWrapper';
import FileInput from '../../molecules/FileInput';
import TextAreaInput from '../../atoms/inputs/TextAreaInput';
import TextInput from '../../atoms/inputs/TextInput';
import ExpandableQuote from '../../molecules/ExpandableQuote';
import { isEmpty } from 'lodash';
import Link from '../../atoms/hyperTexts/Link';

const SECTION_LABEL = 'Le cadre juridique';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

type CadreJuridiqueSectionProps = {
  CadreJuridiqueDescription?: React.ComponentType;
  defaultFondementJuridiqueTitle?: string;
  defaultFondementJuridiqueUrl?: string;
};

interface CadreJuridiqueSectionType
  extends React.FC<CadreJuridiqueSectionProps> {
  sectionLabel: string;
}
const CadreJuridiqueSection: CadreJuridiqueSectionType = ({
  CadreJuridiqueDescription,
  defaultFondementJuridiqueTitle,
  defaultFondementJuridiqueUrl,
}) => {
  const {
    isUserEnrollmentLoading,
    disabled,
    onChange,
    enrollment: {
      fondement_juridique_title = '',
      fondement_juridique_url = '',
      documents = [],
      documents_attributes = [],
    },
  } = useContext(FormContext);

  useEffect(() => {
    if (
      defaultFondementJuridiqueTitle &&
      !isUserEnrollmentLoading &&
      !disabled &&
      isEmpty(fondement_juridique_title)
    ) {
      onChange({
        target: {
          name: 'fondement_juridique_title',
          value: defaultFondementJuridiqueTitle,
        },
      });
    }
    if (
      defaultFondementJuridiqueUrl &&
      !isUserEnrollmentLoading &&
      !disabled &&
      isEmpty(fondement_juridique_url)
    ) {
      onChange({
        target: {
          name: 'fondement_juridique_url',
          value: defaultFondementJuridiqueUrl,
        },
      });
    }
  }, [
    defaultFondementJuridiqueTitle,
    defaultFondementJuridiqueUrl,
    isUserEnrollmentLoading,
    disabled,
    onChange,
    fondement_juridique_title,
    fondement_juridique_url,
  ]);

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>Le cadre juridique vous autorisant à traiter les données</h2>
      {CadreJuridiqueDescription && (
        <ExpandableQuote title="Comment trouver le cadre juridique ?">
          <CadreJuridiqueDescription />
        </ExpandableQuote>
      )}
      <h3>
        Vous souhaitez accéder, traiter et conserver des données personnelles.
        Quel est le cadre juridique qui autorise votre organisation à accéder à
        ces données ?
      </h3>
      <TextAreaInput
        label={
          <>
            Précisez la nature et les références du texte vous autorisant à
            traiter les données
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
              <Link
                inline
                newTab
                href={fondement_juridique_url}
                aria-label="Accéder au texte relatif au traitement"
              >
                accéder à cette URL
              </Link>
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

export default CadreJuridiqueSection;
