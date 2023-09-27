import React, { useContext } from 'react';
import { FormContext } from '../../templates/Form';
import { ScrollablePanel } from '../Scrollable';
import ExpandableQuote from '../../molecules/ExpandableQuote';
import CheckboxInput from '../../atoms/inputs/CheckboxInput';
import { FunctionSectionComponent } from '../../../types/fonction-section-component';
import Link from '../../atoms/hyperTexts/Link';

const SECTION_LABEL = 'Le mode d’accès';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

export const AgentConnectNetworkSection: FunctionSectionComponent = () => {
  const {
    disabled,
    onChange,
    enrollment: {
      additional_content: { acces_rie = false, acces_internet = false },
    },
  } = useContext(FormContext)!;

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>La plateforme sera accessible depuis</h2>
      <ExpandableQuote title="Comment choisir le mode d’accès ?">
        <p>
          Précisez si votre projet sera accessible depuis le Réseau
          Interministériel de l’État (RIE), depuis Internet, ou à la fois depuis
          le RIE et Internet.
        </p>
        <p>
          Vous trouverez plus d’information sur
          <Link
            inline
            newTab
            href="https://github.com/france-connect/Documentation-AgentConnect/blob/main/doc_fi/pilotage_fca/plateformes_fi.md"
          >
            notre documentation en ligne
          </Link>
          .
        </p>
      </ExpandableQuote>
      {/*@ts-ignore*/}
      <CheckboxInput
        label="RIE (Réseau Interministériel de l’État)"
        disabled={disabled}
        onChange={onChange}
        name="additional_content.acces_rie"
        value={acces_rie}
      />
      {/*@ts-ignore*/}
      <CheckboxInput
        label="Internet"
        disabled={disabled}
        onChange={onChange}
        name="additional_content.acces_internet"
        value={acces_internet}
      />
    </ScrollablePanel>
  );
};

AgentConnectNetworkSection.sectionLabel = SECTION_LABEL;

export default AgentConnectNetworkSection;
