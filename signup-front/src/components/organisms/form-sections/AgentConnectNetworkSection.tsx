import React, { useContext } from 'react';
import { FormContext } from '../../templates/Form';
import { ScrollablePanel } from '../Scrollable';
import ExpandableQuote from '../../molecules/ExpandableQuote';
import CheckboxInput from '../../atoms/inputs/CheckboxInput';

const SECTION_LABEL = 'Plateforme accessible depuis :';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

export const AgentConnectNetworkSection: React.FC = () => {
  const {
    disabled,
    onChange,
    enrollment: {
      additional_content: { access_rie = false, access_internet = false },
    },
  } = useContext(FormContext);

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>Plateforme accessible depuis :</h2>
      <ExpandableQuote title="Comment choisir le mode d'accès">
        <p>
          Votre projet sera t-il accessible depuis le Réseau Interministériel de
          l’Etat (RIE) ? Depuis Internet ? ou à la fois depuis le RIE et
          Internet ?{' '}
        </p>
      </ExpandableQuote>
      {/*@ts-ignore*/}
      <CheckboxInput
        label="RIE (Réseau Interministériel de l'Etat)"
        disabled={disabled}
        onChange={onChange}
        name="additional_content.access_rie"
        value={access_rie}
      />
      {/*@ts-ignore*/}
      <CheckboxInput
        label="Internet"
        disabled={disabled}
        onChange={onChange}
        name="additional_content.access_internet"
        value={access_internet}
      />
    </ScrollablePanel>
  );
};

export default AgentConnectNetworkSection;
