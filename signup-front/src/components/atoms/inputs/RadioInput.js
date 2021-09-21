import React, { useMemo, useState } from 'react';
import { uniqueId } from 'lodash';

export const RadioInput = ({
  label,
  name,
  options = [],
  value = null,
  disabled,
  onChange,
  required,
  useOtherOption = true,
}) => {
  // id will be set once when the component initially renders, but never again
  // we generate an unique id prefixed by the field name
  const [id] = useState(uniqueId(name));

  const isOtherSelected = useMemo(
    () => useOtherOption && !options.map(({ id: i }) => i).includes(value),
    [useOtherOption, options, value]
  );

  return (
    <>
      <div className="form__group">
        <fieldset>
          <legend style={{ marginBottom: 'var(--space-s)' }}>
            {label}
            {required && ' *'}
          </legend>
          {options.map(({ id: optionId, label: optionLabel }) => (
            <div
              key={`${id}-${optionId}`}
              style={{ marginBottom: 'var(--space-s)' }}
            >
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
              <label htmlFor={`${id}-${optionId}`} className="label-inline">
                {optionLabel}
              </label>
            </div>
          ))}
          {useOtherOption && (
            <div key={`${id}-other`} style={{ marginBottom: 'var(--space-s)' }}>
              <input
                type="radio"
                name={name}
                id={`${id}-other`}
                value={''}
                checked={isOtherSelected}
                onChange={onChange}
                disabled={disabled ? 'disabled' : false}
              />
              <label htmlFor={`${id}-other`} className="label-inline">
                Autre
              </label>
              {isOtherSelected && (
                <span>
                  <label
                    style={{ display: 'inherit' }}
                    htmlFor={`${id}-other-text-input`}
                  >
                    {'. '}
                    Précisez :{' '}
                  </label>
                  <input
                    style={{ height: 'inherit', width: 'inherit', padding: 0 }}
                    id={`${id}-other-text-input`}
                    type="text"
                    onChange={onChange}
                    name={name}
                    readOnly={disabled}
                    value={value}
                    aria-label={`Nom de votre ${label}`}
                  />
                </span>
              )}
            </div>
          )}
        </fieldset>
      </div>
    </>
  );
};

export default RadioInput;
