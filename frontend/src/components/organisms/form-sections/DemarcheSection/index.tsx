import React, { useContext } from 'react';
import DemarcheSectionReadOnly from './DemarcheSectionReadOnly';
import DemarcheSectionSelect from './DemarcheSectionSelect';
import { FormContext } from '../../../templates/Form';
import { ScopeConfiguration } from '../DonneesSection/Scopes';

const SECTION_LABEL = 'Les modèles pré-remplis';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

type DemarcheSectionProps = {
  body?: React.ReactNode;
  scopesConfiguration?: ScopeConfiguration[];
};

interface DemarcheSectionType extends React.FC<DemarcheSectionProps> {
  sectionLabel: string;
}

export const DemarcheSection: DemarcheSectionType = ({
  body,
  scopesConfiguration,
}) => {
  const { disabled } = useContext(FormContext)!;

  if (!body) {
    return null;
  }

  return (
    <>
      {disabled ? (
        <DemarcheSectionReadOnly
          scopesConfiguration={scopesConfiguration}
          scrollableId={SECTION_ID}
        />
      ) : (
        <DemarcheSectionSelect body={body} scrollableId={SECTION_ID} />
      )}
    </>
  );
};

DemarcheSection.sectionLabel = SECTION_LABEL;

export default DemarcheSection;
