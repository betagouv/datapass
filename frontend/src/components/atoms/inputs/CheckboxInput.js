import React, { useState } from 'react';
import { uniqueId } from 'lodash';
import Label from './Label';

export const CheckboxInput = ({
  label,
  helper,
  meta = null,
  name,
  value = null,
  disabled,
  onChange,
  required,
  ...rest
}) => {
  // id will be set once when the component initially renders, but never again
  // we generate an unique id prefixed by the field name
  const [id] = useState(uniqueId(name));

  return (
    <div className="fr-checkbox-group">
      <input
        onChange={onChange}
        disabled={disabled ? 'disabled' : false}
        checked={value}
        type="checkbox"
        name={name}
        id={id}
        required={required}
        {...rest}
      />
      <Label
        id={id}
        label={label}
        required={required}
        helper={helper}
        meta={meta}
      />
    </div>
  );
};

export default CheckboxInput;
