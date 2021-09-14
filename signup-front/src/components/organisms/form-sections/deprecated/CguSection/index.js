import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { ScrollablePanel } from '../../../Scrollable';
import { FormContext } from '../../../../templates/Form';
import CheckboxInput from '../../../../atoms/inputs/CheckboxInput';

const SECTION_LABEL = 'Modalités d’utilisation';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

export const CguSection = ({
  CguDescription = () => null,
  cguLink,
  AdditionalCguContent = () => null,
}) => {
  const {
    disabled,
    onChange,
    enrollment: { cgu_approved = false, additional_content = {} },
  } = useContext(FormContext);

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>Modalités d’utilisation</h2>
      <CguDescription />
      <CheckboxInput
        label={
          <>
            J’ai pris connaissance des{' '}
            <a href={cguLink} target="_blank" rel="noreferrer noopener">
              conditions générales d’utilisation
            </a>{' '}
            et je les valide. Je confirme que le délégué à la protection des
            données de mon organisation est informé de ma demande.
          </>
        }
        name="cgu_approved"
        value={cgu_approved}
        disabled={disabled}
        onChange={onChange}
      />
      <AdditionalCguContent
        additional_content={additional_content}
        onChange={onChange}
        disabled={disabled}
      />
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
