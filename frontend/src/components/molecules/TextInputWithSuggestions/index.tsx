import React, { useEffect, useState } from 'react';
import { chain, isEmpty, isNull, isNumber, max, min, uniqueId } from 'lodash';
// @ts-ignore
import * as levenshtein from 'damerau-levenshtein';
import Dropdown from '../Dropdown';
import './style.css';
import { InputProps } from '../../atoms/inputs/Input';

export interface TextInputWithSuggestionsProps extends InputProps {
  options: { id: string; label: string }[];
  onOptionChange?: Function;
}

export const TextInputWithSuggestions: React.FC<
  TextInputWithSuggestionsProps
> = ({
  label,
  name,
  options = [],
  value,
  disabled,
  onChange,
  required,
  onOptionChange = null,
  placeholder,
}) => {
  // id will be set once when the component initially renders, but never again
  // we generate a unique id prefixed by the field name
  const [id] = useState(uniqueId(name));

  const [suggestions, setSuggestions] = useState<
    { id: string; label: string }[]
  >([]);

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
        distance: levenshtein(normalize(value as string), normalize(label))
          .similarity,
      }))
      .sortBy(['distance'])
      .reverse()
      .filter(({ distance }) => distance > 0.25)
      .take(10)
      .value();

    setSuggestions(newSuggestions);
  }, [options, value]);

  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);
  const [activeSuggestion, setActiveSuggestion] = useState<number | null>(null);

  const closeDropDown = () => {
    setIsDropDownOpen(false);
    setActiveSuggestion(null);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Tab' && isDropDownOpen) {
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
      setActiveSuggestion(
        min([activeSuggestion + 1, suggestions.length - 1]) as number
      );
    }

    if (e.key === 'ArrowUp' && isDropDownOpen && isNumber(activeSuggestion)) {
      e.preventDefault();
      setActiveSuggestion(max([activeSuggestion - 1, 0]) as number);
    }

    if (e.key === 'Enter' && isDropDownOpen && isNumber(activeSuggestion)) {
      e.preventDefault();
      if (onChange) {
        onChange({
          // @ts-ignore
          target: {
            name: name as string,
            value: suggestions[activeSuggestion]?.label,
          },
        });
      }
      closeDropDown();
    }
  };

  const handleChange = (value: string) => {
    closeDropDown();
    if (onChange) {
      // @ts-ignore
      onChange({ target: { name: name as string, value } });
    }
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
        placeholder={placeholder}
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
              onClick={() => {
                if (onOptionChange) {
                  onOptionChange({ id, label });
                }
                handleChange(label);
              }}
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
