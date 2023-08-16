import { useState } from 'react';
import { uniqueId } from 'lodash';
import FieldsetWrapper from './FieldsetWrapper';
import Label from './Label';
import { InputProps } from './Input';

interface RadioInputProps extends InputProps {
  options?: { id: string | number; label: string }[];
}

export const RadioInput: React.FC<RadioInputProps> = ({
  label,
  name,
  options = [],
  value = null,
  disabled,
  onChange,
  required,
}) => {
  // id will be set once when the component initially renders, but never again
  // we generate a unique id prefixed by the field name
  const [id] = useState(uniqueId(name));

  return (
    <FieldsetWrapper title={label} required={required}>
      {options.map(({ id: optionId, label: optionLabel }) => (
        <div key={`${id}-${optionId}`} className="fr-radio-group">
          <input
            type="radio"
            name={name}
            id={`${id}-${optionId}`}
            value={optionId}
            checked={value === optionId}
            onChange={onChange}
            disabled={disabled}
            required={required}
          />
          <Label id={`${id}-${optionId}`} label={optionLabel} />
        </div>
      ))}
    </FieldsetWrapper>
  );
};

export default RadioInput;
