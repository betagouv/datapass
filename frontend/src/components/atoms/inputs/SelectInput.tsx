import React, {
  ChangeEventHandler,
  SelectHTMLAttributes,
  useMemo,
  useState,
} from 'react';
import { uniqueId } from 'lodash';
import TextInput from './TextInput';
import SideBySideWrapper from './SideBySideWrapper';
import Label from './Label';

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: { id: string; label: string }[];
  useOtherOption?: boolean;
  label: string;
  helper: string;
  meta: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  name,
  helper,
  meta,
  options = [],
  value,
  disabled,
  onChange,
  required,
  useOtherOption = false,
}) => {
  // id will be set once when the component initially renders, but never again
  // we generate a unique id prefixed by the field name
  const [id] = useState(uniqueId(name));

  const isOtherSelected = useMemo(
    () =>
      useOtherOption &&
      !options.map(({ id: i }) => i).includes(value as string),
    [useOtherOption, options, value]
  );

  return (
    <SideBySideWrapper>
      <div className="fr-select-group">
        <Label
          id={id}
          label={label}
          required={required}
          helper={helper}
          meta={meta}
        />
        <select
          id={id}
          className="fr-select"
          name={name}
          value={isOtherSelected ? '' : value}
          disabled={disabled}
          onChange={onChange as ChangeEventHandler<HTMLSelectElement>}
          required={required}
        >
          {options.map(({ id, label: optionLabel }) => (
            <option key={id} value={id}>
              {optionLabel}
            </option>
          ))}
          {useOtherOption && (
            <option key="" value="">
              Autre
            </option>
          )}
        </select>
      </div>
      {isOtherSelected && (
        <TextInput
          label="Précisez :"
          name={name}
          value={value}
          disabled={disabled}
          required={required}
          ariaLabel={`Précisez le ${label}`}
        />
      )}
    </SideBySideWrapper>
  );
};

export default SelectInput;
