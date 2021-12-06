import React, { useContext } from 'react';
import { FormContext } from '../../../templates/Form';
import { ScrollablePanel } from '../../Scrollable';
import CheckboxInput from '../../../atoms/inputs/CheckboxInput';

const SECTION_LABEL = 'Démarches en ligne';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

export const DemarcheEnLigneSection = () => {
  const {
    disabled,
    onChange,
    enrollment: { scopes: { cert_dc = false } = {} },
  } = useContext(FormContext);

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>
        Démarches en ligne auxquelles vous souhaitez abonner votre commune
      </h2>
      <CheckboxInput
        name="scopes.cert_dc"
        value={cert_dc}
        label="Certificat de décès (CertDc)"
        onChange={onChange}
        disabled={disabled}
      />
    </ScrollablePanel>
  );
};

DemarcheEnLigneSection.sectionLabel = SECTION_LABEL;

export default DemarcheEnLigneSection;
