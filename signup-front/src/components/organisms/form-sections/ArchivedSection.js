import React, { useContext } from 'react';
import { ScrollablePanel } from '../Scrollable';
import { FormContext } from '../../templates/Form';
import TextAreaInput from '../../atoms/inputs/TextAreaInput';

const SECTION_LABEL = 'Données JSON';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

const ArchivedSection = () => {
  const { enrollment } = useContext(FormContext);

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>🗄️ Cette habilitation a été archivée</h2>
      <TextAreaInput
        label="Données de l’habilitation au format JSON"
        value={JSON.stringify(enrollment, null, 2)}
        disabled={true}
        rows={100}
      />
    </ScrollablePanel>
  );
};

ArchivedSection.sectionLabel = SECTION_LABEL;

export default ArchivedSection;
