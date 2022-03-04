import React, { useEffect, useState } from 'react';
import { chain, isEmpty, isNull, isNumber, max, min, uniqueId } from 'lodash';
import * as levenshtein from 'damerau-levenshtein';
import Dropdown from '../Dropdown';
import './style.css';

export const TextInputWithSuggestions = ({
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

  const [suggestions, setSuggestions] = useState([]);

  // from https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
  const normalize = (string = '') =>
    string
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^\w\s]/gi, ' ');

  useEffect(() => {
    const newSuggestions = chain(options)
      .map(({ id, label }) => ({
        id,
        label,
        distance: levenshtein(normalize(value), normalize(label)).similarity,
      }))
      .sortBy(['distance'])
      .reverse()
      .filter(({ distance }) => distance > 0.25)
      .take(10)
      .value();

    setSuggestions(newSuggestions);
  }, [options, value]);

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(null);

  const closeDropDown = () => {
    setIsDropDownOpen(false);
    setActiveSuggestion(null);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Tab' && isDropDownOpen) {
      e.preventDefault();
      closeDropDown();
    }

    if (e.key === 'Enter' && !isDropDownOpen) {
      e.preventDefault();
      setIsDropDownOpen(true);
    }

    if (e.key === 'Escape' && isDropDownOpen) {
      e.preventDefault();
      closeDropDown();
    }

    if (e.key === 'ArrowDown' && !isDropDownOpen) {
      e.preventDefault();
      setIsDropDownOpen(true);
      setActiveSuggestion(0);
    }

    if (e.key === 'ArrowDown' && isDropDownOpen && isNull(activeSuggestion)) {
      e.preventDefault();
      setActiveSuggestion(0);
    }

    if (e.key === 'ArrowDown' && isDropDownOpen && isNumber(activeSuggestion)) {
      e.preventDefault();
      setActiveSuggestion(min([activeSuggestion + 1, suggestions.length - 1]));
    }

    if (e.key === 'ArrowUp' && isDropDownOpen) {
      e.preventDefault();
      setActiveSuggestion(max([activeSuggestion - 1, 0]));
    }

    if (e.key === 'Enter' && isDropDownOpen) {
      e.preventDefault();
      onChange({
        target: { name, value: suggestions[activeSuggestion]?.label },
      });
      closeDropDown();
    }
  };

  const handleChange = (value) => {
    closeDropDown();
    onChange({ target: { name, value } });
  };

  return (
    <div className="fr-input-group">
      <label htmlFor={id}>
        {label}
        {required && ' *'}
      </label>
      <input
        className="fr-input"
        type="text"
        onChange={onChange}
        name={name}
        id={id}
        readOnly={disabled}
        value={value}
        required={required}
        onKeyDown={onKeyDown}
        onClick={() => setIsDropDownOpen(true)}
        onInput={() => setIsDropDownOpen(true)}
      />
      {!disabled && isDropDownOpen && !isEmpty(suggestions) && (
        <Dropdown onOutsideClick={closeDropDown} fillWidth>
          {suggestions.map(({ id, label }, index) => (
            <div
              key={id}
              className={`datapass-text-input-suggestion ${
                activeSuggestion === index
                  ? 'datapass-text-input-active-suggestion'
                  : ''
              }`}
              onClick={() => handleChange(label)}
            >
              {label}
            </div>
          ))}
        </Dropdown>
      )}
    </div>
  );
};

export default TextInputWithSuggestions;
