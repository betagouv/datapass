import React, { useState } from 'react';
import { uniqueId } from 'lodash';
import Helper from '../Helper';

export const NumberInput = ({
  label,
  helper,
  name,
  meta,
  value = null,
  disabled,
  onChange,
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
        type="number"
        min="0"
        max="2147483647"
        onChange={onChange}
        name={name}
        id={id}
        disabled={disabled}
        value={value}
        required={required}
      />
      {meta && (
        <small className="card__meta">
          <i>{meta}</i>
        </small>
      )}
    </div>
  );
};

export default NumberInput;
