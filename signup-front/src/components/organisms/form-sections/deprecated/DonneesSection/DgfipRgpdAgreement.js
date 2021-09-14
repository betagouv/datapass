import React from 'react';
import PropTypes from 'prop-types';
import CheckboxInput from '../../../../atoms/inputs/CheckboxInput';

const DgfipRgpdAgreement = ({
  disabled,
  onChange,
  additional_content: { rgpd_general_agreement = false },
}) => (
  <CheckboxInput
    label={
      <b>
        J’atteste que mon organisation devra déclarer à la DGFiP
        l’accomplissement des formalités en matière de protection des données à
        caractère personnel et qu’elle veillera à procéder à l’homologation de
        sécurité de son service.
      </b>
    }
    name="additional_content.rgpd_general_agreement"
    value={rgpd_general_agreement}
    disabled={disabled}
    onChange={onChange}
  />
);

DgfipRgpdAgreement.propTypes = {
  additional_content: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default DgfipRgpdAgreement;
