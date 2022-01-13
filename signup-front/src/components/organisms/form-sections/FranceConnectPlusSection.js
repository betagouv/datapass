import React, { useContext, useEffect } from 'react';

import { ScrollablePanel } from '../Scrollable';
import { FormContext } from '../../templates/Form';
import RadioInput from '../../atoms/inputs/RadioInput';
import ExpandableQuote from '../../molecules/ExpandableQuote';
import Link from '../../atoms/hyperTexts/Link';

const SECTION_LABEL = 'Le niveau de garantie';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

export const FranceConnectPlusSection = () => {
  const {
    isUserEnrollmentLoading,
    disabled,
    onChange,
    enrollment: {
      additional_content: { eidas_level = '' },
    },
  } = useContext(FormContext);

  useEffect(() => {
    if (!isUserEnrollmentLoading && !disabled && eidas_level === '') {
      onChange({
        target: {
          name: 'additional_content.eidas_level',
          value: '1',
        },
      });
    }
  }, [isUserEnrollmentLoading, disabled, onChange, eidas_level]);

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>Le niveau de garantie attendu par votre service</h2>
      <ExpandableQuote title="Comment choisir mon niveau de garantie ?">
        <p>
          <b>eIDAS 1</b> est le niveau recommandé si vous n’avez pas d’exigence
          particulière sur le niveau eIDAS.
        </p>
        <p>
          <b>eIDAS 2</b> est un niveau de garantie plus élevé. Vous trouverez
          plus d’information sur{' '}
          <Link
            inline
            newTab
            aria-label="Aller vers le règlement eIDAS"
            href="https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32015R1502&from=FR"
          >
            le site de la réglementation eIDAS
          </Link>
          . Si vous êtes un acteur du secteur privé, une facturation pourra être
          appliquée par certains fournisseurs d’identité.
        </p>
      </ExpandableQuote>
      <RadioInput
        label="Niveau de garantie"
        options={[
          {
            id: '1',
            label: 'FranceConnect : niveau de garantie eIDAS 1',
          },
          {
            id: '2',
            label: 'FranceConnect+ : niveau de garantie eIDAS 2',
          },
        ]}
        name="additional_content.eidas_level"
        value={eidas_level}
        disabled={disabled}
        onChange={onChange}
        required
      />
    </ScrollablePanel>
  );
};

FranceConnectPlusSection.sectionLabel = SECTION_LABEL;

export default FranceConnectPlusSection;
