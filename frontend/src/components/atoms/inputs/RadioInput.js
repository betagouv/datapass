import React, { useState } from 'react';
import { uniqueId } from 'lodash';
import FieldsetWrapper from './FieldsetWrapper';
import Label from './Label';

export const RadioInput = ({
  label,
  name,
  options = [],
  value = null,
  disabled,
  onChange,
  required,
}) => {
  // id will be set once when the component initially renders, but never again
  // we generate an unique id prefixed by the field name
  const [id] = useState(uniqueId(name));

  return (
    <FieldsetWrapper title={label} required={required}>
      {options.map(({ id: optionId, label: optionLabel }) => (
        <div key={`${id}-${optionId}`} className="fr-radio-group">
          <input
            type="radio"
            name={name}
            id={`${id}-${optionId}`}
            value={optionId}
            checked={value === optionId}
            onChange={onChange}
            disabled={disabled ? 'disabled' : false}
            required={required}
          />
          <Label id={`${id}-${optionId}`} label={optionLabel} />
        </div>
      ))}
    </FieldsetWrapper>
  );
};

export default RadioInput;
