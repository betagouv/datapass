import { useCallback, useEffect, useRef, useState } from 'react';
import { union, xor } from 'lodash';
import './style.css';
import CheckboxInput from '../../atoms/inputs/CheckboxInput';
import FieldsetWrapper from '../../atoms/inputs/FieldsetWrapper';
import Dropdown from '../Dropdown';

type Props = {
  options: { key: string; label: string }[];
  values: string[];
  disabled: boolean;
  onChange: (values: string[]) => void;
  alignOptionsLeft: boolean;
  defaultOverviewLabel: string;
  id: string;
};

export const MultiSelect: React.FC<Props> = ({
  options = [],
  values = [],
  disabled = false,
  onChange,
  alignOptionsLeft = false,
  defaultOverviewLabel = 'Tous',
  id = '',
}) => {
  const [isContentOpen, setIsContentOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleButtonClick = () => {
    setIsContentOpen(!isContentOpen);
  };

  const handleOutsideClick = () => {
    setIsContentOpen(false);
  };

  const escFunction = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isContentOpen) {
          buttonRef.current?.focus();
        }
        handleOutsideClick();
      }
    },
    [isContentOpen]
  );

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [escFunction]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    let newValues = checked ? union(values, [name]) : xor(values, [name]);
    onChange(newValues);
  };

  let overviewLabel;
  if (values.length === 0) {
    overviewLabel = defaultOverviewLabel;
  } else if (values.length === 1) {
    overviewLabel = options.find(({ key }) => key === values[0])?.label;
  } else {
    overviewLabel = `${values.length} sélections`;
  }

  return (
    <div
      className={`multi-select ${alignOptionsLeft ? 'align-options-left' : ''}`}
    >
      <button
        id={id}
        ref={buttonRef}
        type="button"
        className="multiselect-dropdown-button"
        onClick={handleButtonClick}
        aria-haspopup="listbox"
        aria-expanded={isContentOpen}
      >
        {overviewLabel}
      </button>
      {isContentOpen && (
        <Dropdown onOutsideClick={handleOutsideClick}>
          <FieldsetWrapper small>
            {options.map(({ key, label }) => (
              <div key={key} role="option" aria-selected={values.includes(key)}>
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
        </Dropdown>
      )}
    </div>
  );
};

export default MultiSelect;
