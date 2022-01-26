import React, { useContext } from 'react';
import { FormContext } from '../../../templates/Form';
import { ScrollablePanel } from '../../Scrollable';
import CheckboxInput from '../../../atoms/inputs/CheckboxInput';
import ExpandableQuote from '../../../molecules/ExpandableQuote';
import { isEmpty } from 'lodash';

const SECTION_LABEL = 'Démarches en ligne';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

export const DemarcheEnLigneSection = ({ demarchesHubee = [] }) => {
  const {
    disabled,
    onChange,
    enrollment: { scopes = {} },
  } = useContext(FormContext);

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>
        Démarches en ligne auxquelles vous souhaitez abonner votre commune
      </h2>
      <ExpandableQuote
        title={`En quoi ${
          demarchesHubee.length === 1 ? 'consiste cette démarche' : 'consistent ces démarches'
        } ?`}
      >
        <>
          {!isEmpty(demarchesHubee) &&
            demarchesHubee.map(({ id, label, description }) => (
              <p key={id}>
                <b>{label} :</b> {description}
              </p>
            ))}
        </>
      </ExpandableQuote>
      {!isEmpty(demarchesHubee) &&
        demarchesHubee.map(({ id, label }) => (
          <CheckboxInput
            name={`scopes.${id}`}
            key={id}
            value={scopes[id]}
            label={label}
            onChange={onChange}
            disabled={disabled}
          />
        ))}
    </ScrollablePanel>
  );
};

DemarcheEnLigneSection.sectionLabel = SECTION_LABEL;

export default DemarcheEnLigneSection;
