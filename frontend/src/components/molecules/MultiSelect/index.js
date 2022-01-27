import React, { useState } from 'react';
import { union, xor } from 'lodash';
import './style.css';
import CheckboxInput from '../../atoms/inputs/CheckboxInput';
import FieldsetWrapper from '../../atoms/inputs/FieldsetWrapper';

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
    overviewLabel = options.find(({ key }) => key === values[0])?.label;
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
          <FieldsetWrapper small className="multiselect-dropdown-content">
            {options.map(({ key, label }) => (
              <div key={key} className="multiselect-dropdown-item">
                <CheckboxInput
                  name={key}
                  label={label}
                  onChange={handleChange}
                  value={values.includes(key)}
                  disabled={disabled}
                />
              </div>
            ))}
          </FieldsetWrapper>

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
