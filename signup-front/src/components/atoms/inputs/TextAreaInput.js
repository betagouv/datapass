import React, { useState } from 'react';
import { uniqueId } from 'lodash';
import Label from './Label';

export const TextAreaInput = ({
  label,
  helper,
  meta,
  name,
  placeholder = '',
  value = null,
  disabled,
  onChange,
  ariaLabel,
  required,
  rows = 10,
}) => {
  // id will be set once when the component initially renders, but never again
  // we generate an unique id prefixed by the field name
  const [id] = useState(uniqueId(name));

  return (
    <div className="fr-input-group">
      <Label
        id={id}
        label={label}
        required={required}
        helper={helper}
        meta={meta}
      />
      <textarea
        className="fr-input"
        rows={rows}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        id={id}
        readOnly={disabled}
        value={value}
        aria-label={ariaLabel}
        required={required}
      />
    </div>
  );
};

export default TextAreaInput;
