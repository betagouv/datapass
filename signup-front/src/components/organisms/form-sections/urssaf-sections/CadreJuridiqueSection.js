import React from 'react';
import TextSection from '../TextSection';
import Quote from '../../../atoms/inputs/Quote';

const SECTION_LABEL = 'Cadre juridique';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

export const CadreJuridiqueSection = () => (
  <TextSection
    id={SECTION_ID}
    title="Le cadre juridique vous autorisant à utiliser le service"
  >
    <Quote>
      <p>
        L’Urssaf concède à titre gratuit au demandeur et sur condition d’octroi
        de l’habilitation, une licence d’utilisation non exclusive du présent
        service. En ayant recours à ce service, le demandeur est considéré comme
        tiers-déclarant au sens des articles L.133-11, R133-43 et R133-44 du
        Code de Sécurité sociale, et a obtenu mandat de la part des utilisateurs
        pour ce faire.
      </p>
    </Quote>
  </TextSection>
);

CadreJuridiqueSection.sectionLabel = SECTION_LABEL;

export default CadreJuridiqueSection;
