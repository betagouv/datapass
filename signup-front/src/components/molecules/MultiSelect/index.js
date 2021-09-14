import React, { useState } from 'react';
import { union, xor } from 'lodash';
import './index.css';

export const MultiSelect = ({
  options = [],
  values = [],
  disabled = false,
  onChange,
}) => {
  const [isContentOpen, setIsContentOpen] = useState(false);

  const handleButtonClick = () => {
    setIsContentOpen(!isContentOpen);
  };

  const handleOutsideClick = () => {
    setIsContentOpen(false);
  };

  const handleChange = (event) => {
    const {
      target: { name, checked },
    } = event;
    let newValues = checked ? union(values, [name]) : xor(values, [name]);
    onChange(newValues);
  };

  let overviewLabel;
  if (values.length === 0) {
    overviewLabel = 'Tous';
  } else if (values.length === 1) {
    overviewLabel = options.find(({ key }) => key === values[0]).label;
  } else {
    overviewLabel = `${values.length} sélections`;
  }

  return (
    <div>
      <div className="multiselect-dropdown-button" onClick={handleButtonClick}>
        {overviewLabel}
      </div>
      {isContentOpen && (
        <>
          <div className="multiselect-dropdown-content">
            {options.map(({ key, label }) => (
              <div key={key} className="multiselect-dropdown-item">
                <input
                  type="checkbox"
                  name={key}
                  id={`multiselect-option-${key}`}
                  disabled={disabled}
                  onChange={handleChange}
                  checked={values.includes(key)}
                />
                <label
                  htmlFor={`multiselect-option-${key}`}
                  className="label-inline"
                  aria-label="Périmètre de données « CNAF - Quotient familial »"
                >
                  {label}
                </label>
              </div>
            ))}
          </div>

          <div
            className="multiselect-dropdown-backdrop"
            onClick={handleOutsideClick}
          />
        </>
      )}
    </div>
  );
};

export default MultiSelect;
