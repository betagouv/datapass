import React from 'react';
import PropTypes from 'prop-types';
import CheckboxInput from '../../../../atoms/inputs/CheckboxInput';

const FcHasAlternativeAuthenticationMethod = ({
  disabled,
  onChange,
  additional_content: { has_alternative_authentication_methods = false },
}) => (
  <CheckboxInput
    label={
      <>
        J’atteste que mon service propose une alternative à la connexion avec
        FranceConnect, et que cette alternative permet l’accès, dans des
        conditions analogues, à la même prestation de service public.
      </>
    }
    name="additional_content.has_alternative_authentication_methods"
    value={has_alternative_authentication_methods}
    disabled={disabled}
    onChange={onChange}
  />
);

FcHasAlternativeAuthenticationMethod.propTypes = {
  additional_content: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default FcHasAlternativeAuthenticationMethod;
