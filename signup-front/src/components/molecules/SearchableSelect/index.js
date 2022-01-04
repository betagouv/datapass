import React, { useMemo, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { uniqueId } from 'lodash';
import './style.css';

export const SearchableSelect = ({
  label,
  name,
  options = [],
  value,
  disabled,
  onChange,
  required,
}) => {
  // id will be set once when the component initially renders, but never again
  // we generate an unique id prefixed by the field name
  const [id] = useState(uniqueId(name));
  const formattedOptions = useMemo(
    () => options.map(({ id, label }) => ({ value: id, label })),
    [options]
  );
  const valueObject = useMemo(() => {
    if (!value) {
      return undefined;
    }

    return (
      formattedOptions.find(({ value: v, label }) => v === value) || {
        value,
        label: value,
        __isNew__: true,
      }
    );
  }, [formattedOptions, value]);

  const handleChange = ({ value }) => {
    onChange({ target: { name, value: value } });
  };

  return (
    <div className="fr-input-group">
      <label htmlFor={id}>
        {label}
        {required && ' *'}
      </label>
      <CreatableSelect
        placeholder=""
        inputId={id}
        options={formattedOptions}
        isDisabled={disabled}
        formatCreateLabel={(inputValue) => inputValue}
        onChange={handleChange}
        value={valueObject}
      />
    </div>
  );
};

export default SearchableSelect;
