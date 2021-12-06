import React, { useContext } from 'react';
import DemarcheSectionReadOnly from './DemarcheSectionReadOnly';
import DemarcheSectionSelect from './DemarcheSectionSelect';
import { FormContext } from '../../../../templates/Form';

const SECTION_LABEL = 'Modèles préremplis';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

export const DemarcheSection = ({ title, body }) => {
  const { disabled } = useContext(FormContext);

  return (
    <>
      {disabled ? (
        <DemarcheSectionReadOnly scrollableId={SECTION_ID} />
      ) : (
        <DemarcheSectionSelect scrollableId={SECTION_ID} />
      )}
    </>
  );
};

DemarcheSection.sectionLabel = SECTION_LABEL;

export default DemarcheSection;
