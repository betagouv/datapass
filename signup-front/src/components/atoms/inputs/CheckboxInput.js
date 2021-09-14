import React, { useState } from 'react';
import { uniqueId } from 'lodash';
import Helper from '../Helper';

export const CheckboxInput = ({
  label,
  helper,
  name,
  value = null,
  disabled,
  onChange,
}) => {
  // id will be set once when the component initially renders, but never again
  // we generate an unique id prefixed by the field name
  const [id] = useState(uniqueId(name));

  return (
    <div className="form__group">
      <input
        onChange={onChange}
        disabled={disabled ? 'disabled' : false}
        checked={value}
        type="checkbox"
        name={name}
        id={id}
      />
      <label htmlFor={id} className="label-inline">
        {label}
        {helper && <Helper title={helper} />}
      </label>
    </div>
  );
};

export default CheckboxInput;
