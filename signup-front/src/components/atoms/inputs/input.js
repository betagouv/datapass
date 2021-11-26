import React, { useState } from 'react';
import Helper from '../Helper';
import { uniqueId } from 'lodash';

export const Input = ({
  type = 'text',
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
  ...rest
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
        type={type}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        id={id}
        readOnly={disabled}
        value={value}
        aria-label={ariaLabel}
        required={required}
        {...rest}
      />
      {meta && (
        <small className="card__meta">
          <i>{meta}</i>
        </small>
      )}
    </div>
  );
};

export default Input;
