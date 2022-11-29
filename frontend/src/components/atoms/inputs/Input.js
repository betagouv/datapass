import { useState } from 'react';
import { uniqueId } from 'lodash';
import Label from './Label';

export const Input = ({
  type = 'text',
  label = '',
  helper = '',
  meta = '',
  name = '',
  placeholder = '',
  value = '',
  disabled = false,
  onChange,
  ariaLabel = '',
  required = false,
  ...rest
}) => {
  // id will be set once when the component initially renders, but never again
  // we generate a unique id prefixed by the field name
  const [id] = useState(uniqueId(name));

  return (
    <div className="fr-input-group">
      <Label
        id={id}
        label={label}
        required={required}
        helper={helper}
        meta={meta}
      />
      <input
        className="fr-input"
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
    </div>
  );
};

export default Input;
