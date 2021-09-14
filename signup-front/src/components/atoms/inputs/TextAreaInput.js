import React, { useState } from 'react';
import Helper from '../Helper';
import { uniqueId } from 'lodash';

export const TextAreaInput = ({
  label,
  helper,
  name,
  placeholder = '',
  value = null,
  disabled,
  onChange,
  rows = 10,
}) => {
  // id will be set once when the component initially renders, but never again
  // we generate an unique id prefixed by the field name
  const [id] = useState(uniqueId(name));

  return (
    <div className="form__group">
      <label htmlFor={id}>
        {label}
        {helper && <Helper title={helper} />}
      </label>
      <textarea
        rows={rows}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        id={id}
        readOnly={disabled}
        value={value}
      />
    </div>
  );
};

export default TextAreaInput;
