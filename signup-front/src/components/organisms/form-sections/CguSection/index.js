import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { ScrollablePanel } from '../../Scrollable';
import { FormContext } from '../../../templates/Form';
import CheckboxInput from '../../../atoms/inputs/CheckboxInput';
import Link from '../../../molecules/hyperTexts/Link';

const SECTION_LABEL = 'Les modalités d’utilisation';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

export const CguSection = ({ cguLink, additionalTermsOfUse = [] }) => {
  const {
    disabled,
    onChange,
    enrollment: {
      cgu_approved = false,
      dpo_is_informed = false,
      additional_content,
    },
  } = useContext(FormContext);

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>Les modalités d’utilisation</h2>
      <CheckboxInput
        label={
          <>
            J’ai pris connaissance des{' '}
            <Link inline newTab href={cguLink}>
              conditions générales d’utilisation
            </Link>{' '}
            et je les valide.
          </>
        }
        name="cgu_approved"
        value={cgu_approved}
        disabled={disabled}
        onChange={onChange}
      />
      <CheckboxInput
        label="Je confirme que le délégué à la protection des données de mon organisation est informé de ma demande."
        name="dpo_is_informed"
        value={dpo_is_informed}
        disabled={disabled}
        onChange={onChange}
      />
      {!isEmpty(additionalTermsOfUse) &&
        additionalTermsOfUse.map(({ id, label }) => (
          <CheckboxInput
            key={id}
            label={label}
            name={`additional_content.${id}`}
            value={additional_content[id] || false}
            disabled={disabled}
            onChange={onChange}
          />
        ))}
    </ScrollablePanel>
  );
};

CguSection.sectionLabel = SECTION_LABEL;

CguSection.propTypes = {
  CguDescription: PropTypes.func,
  cguLink: PropTypes.string.isRequired,
  AdditionalCguContent: PropTypes.func,
};

export default CguSection;
