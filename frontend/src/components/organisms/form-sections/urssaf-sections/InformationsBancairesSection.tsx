import React, { useContext } from 'react';
import TextInput from '../../../atoms/inputs/TextInput';
import { FormContext } from '../../../templates/Form';
import { ScrollablePanel } from '../../Scrollable';

const SECTION_LABEL = 'Informations bancaires';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

export const InformationsBancairesSection = () => {
  const {
    disabled,
    onChange,
    enrollment: {
      additional_content: { nom_beneficiaire = '', iban = '', bic = '' },
    },
  } = useContext(FormContext);

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>Informations bancaires</h2>
      <TextInput
        label="Nom du bénéficiaire à créditer"
        name="additional_content.nom_beneficiaire"
        value={nom_beneficiaire}
        disabled={disabled}
        onChange={onChange}
      />
      <TextInput
        label="Numéro IBAN"
        meta="L’IBAN (International Bank Account Number) est l’identifiant du compte bancaire."
        name="additional_content.iban"
        placeholder="FR** **** **** **** **** *******"
        value={iban}
        disabled={disabled}
        onChange={onChange}
      />
      <TextInput
        label="Code BIC"
        meta="Le code BIC (Bank Identifier Code) est l'identifiant international de la banque."
        name="additional_content.bic"
        value={bic}
        disabled={disabled}
        onChange={onChange}
      />
    </ScrollablePanel>
  );
};

InformationsBancairesSection.sectionLabel = SECTION_LABEL;

export default InformationsBancairesSection;
