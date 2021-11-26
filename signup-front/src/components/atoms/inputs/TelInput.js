import React, { useState } from 'react';
import { uniqueId } from 'lodash';
import Helper from '../Helper';

export const TelInput = ({
  label,
  helper,
  name,
  value = null,
  disabled,
  onChange,
  ariaLabel,
  required,
}) => {
  // id will be set once when the component initially renders, but never again
  // we generate an unique id prefixed by the field name
  const [id] = useState(uniqueId(name));

  return (
    <div className="form__group">
      <label htmlFor={id}>
        {label}
        {required && ' *'}
        {helper && <Helper title={helper} />}
      </label>
      <input
        type="tel"
        onChange={onChange}
        name={name}
        id={id}
        readOnly={disabled}
        value={value}
        pattern="\+?(?:[0-9][ -]?){6,14}[0-9]"
        aria-label={ariaLabel}
        required={required}
      />
    </div>
  );
};

export default TelInput;
