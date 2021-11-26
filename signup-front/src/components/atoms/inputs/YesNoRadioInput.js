import React, { useState } from 'react';
import { uniqueId } from 'lodash';

export const YesNoRadioInput = ({
  label,
  name,
  value = null,
  disabled,
  onChange,
  required,
}) => {
  // id will be set once when the component initially renders, but never again
  // we generate an unique id prefixed by the field name
  const [id] = useState(uniqueId(name));

  const onYesNoChange = (onChangeEvent) => {
    const {
      target: { type = null, checked = null, value: inputValue, name },
    } = onChangeEvent;

    const booleanInputValue = inputValue === 'true';
    onChange({ target: { type, checked, value: booleanInputValue, name } });
  };

  return (
    <div className="form__group">
      <fieldset>
        <legend>
          {label}
          {required && ' *'}
        </legend>
        <>
          <input
            type="radio"
            name={name}
            id={`${id}_true`}
            value
            checked={value === true}
            onChange={onYesNoChange}
            disabled={disabled ? 'disabled' : false}
            required={required}
          />
          <label htmlFor={`${id}_true`} className="label-inline">
            oui
          </label>
        </>
        <>
          <input
            type="radio"
            name={name}
            id={`${id}_false`}
            value={false}
            checked={value === false}
            onChange={onYesNoChange}
            disabled={disabled ? 'disabled' : false}
          />
          <label htmlFor={`${id}_false`} className="label-inline">
            non
          </label>
        </>
      </fieldset>
    </div>
  );
};

export default YesNoRadioInput;
