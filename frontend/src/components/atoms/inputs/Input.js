import { useState } from 'react';
import { uniqueId } from 'lodash';
import Label from './Label';
import { FilterIcon } from '../icons/fr-fi-icons';

import './Input.css';

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
  icon = '',
  required = false,
  ...rest
}) => {
  // id will be set once when the component initially renders, but never again
  // we generate an unique id prefixed by the field name
  const [id] = useState(uniqueId(name));

  const getIcon = () => {
    switch (icon) {
      case 'filter':
        return <FilterIcon small color="var(--datapass-dark-grey)" />;

      default:
        return null;
    }
  };

  let className = 'fr-input';

  if (icon) {
    className += ' padding-right';
  }

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
        className={className}
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
      {!!icon.length && <div className="input-icon">{getIcon()}</div>}
    </div>
  );
};

export default Input;
