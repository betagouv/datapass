import React, { useMemo, useState } from 'react';
import Helper from '../Helper';
import { uniqueId } from 'lodash';
import TextInput from './TextInput';
import SideBySideWrapper from './SideBySideWrapper';

export const SelectInput = ({
  label,
  name,
  helper,
  options = [],
  value,
  disabled,
  onChange,
  required,
  useOtherOption = false,
}) => {
  // id will be set once when the component initially renders, but never again
  // we generate an unique id prefixed by the field name
  const [id] = useState(uniqueId(name));

  const isOtherSelected = useMemo(
    () => useOtherOption && !options.map(({ id: i }) => i).includes(value),
    [useOtherOption, options, value]
  );

  return (
    <SideBySideWrapper>
      <div className="form__group">
        <label htmlFor={id}>
          {label}
          {required && ' *'}
          {helper && <Helper title={helper} />}
        </label>
        <select
          id={id}
          name={name}
          value={isOtherSelected ? '' : value}
          disabled={disabled}
          onChange={onChange}
          required={required}
        >
          {options.map(({ id, label: optionLabel }) => (
            <option key={id} value={id}>
              {optionLabel}
            </option>
          ))}
          {useOtherOption && (
            <option key="" value="">
              Autre
            </option>
          )}
        </select>
      </div>
      {isOtherSelected && (
        <TextInput
          label="Précisez :"
          name={name}
          value={value}
          disabled={disabled}
          onChange={onChange}
          required={required}
          ariaLabel={`Précisez le ${label}`}
        ></TextInput>
      )}
    </SideBySideWrapper>
  );
};

export default SelectInput;
