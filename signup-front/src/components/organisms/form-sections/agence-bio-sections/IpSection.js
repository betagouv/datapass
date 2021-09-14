import React, { useContext } from 'react';
import { FormContext } from '../../../templates/Form';
import { ScrollablePanel } from '../../Scrollable';
import Quote from '../../../atoms/inputs/Quote';
import TextInput from '../../../atoms/inputs/TextInput';

const SECTION_LABEL = 'Adresses IP';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

export const IpSection = () => {
  const {
    disabled,
    onChange,
    enrollment: {
      additional_content: { ips_de_production = '' },
    },
  } = useContext(FormContext);

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>Adresses IP</h2>
      <Quote>
        <p>
          Pour permettre la liaison technique entre votre SI et celui de
          l’agence Bio, vous devez fournir les adresses IP des serveurs qui vont
          communiquer avec l’API Agence Bio.
        </p>
      </Quote>
      <TextInput
        label="IPs de production"
        meta={
          <>
            Vous pouvez ajouter plusieurs adresses IP en les séparant par une
            virgule (ex: 111.111.11.11, 111.111.11.12)
          </>
        }
        name="additional_content.ips_de_production"
        value={ips_de_production}
        disabled={disabled}
        onChange={onChange}
      />
    </ScrollablePanel>
  );
};

IpSection.sectionLabel = SECTION_LABEL;

export default IpSection;
