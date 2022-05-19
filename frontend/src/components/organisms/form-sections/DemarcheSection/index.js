import React, { useContext } from 'react';
import DemarcheSectionReadOnly from './DemarcheSectionReadOnly';
import DemarcheSectionSelect from './DemarcheSectionSelect';
import { FormContext } from '../../../templates/Form';

const SECTION_LABEL = 'Les modèles pré-remplis';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

export const DemarcheSection = ({ body, availableScopes }) => {
  const { disabled } = useContext(FormContext);

  return (
    <>
      {disabled ? (
        <DemarcheSectionReadOnly
          availableScopes={availableScopes}
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
