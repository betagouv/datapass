import React from 'react';
import Helper from '../Helper';

export const Select = ({
  label,
  name,
  helper,
  options = [],
  value,
  disabled,
  onChange,
}) => (
  <div className="form__group">
    <label htmlFor={name}>
      {label}
      {helper && <Helper title={helper} />}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      disabled={disabled}
      onChange={onChange}
    >
      {options.map(({ id, label: optionLabel }) => (
        <option key={id} value={id}>
          {optionLabel}
        </option>
      ))}
    </select>
  </div>
);

export default Select;
