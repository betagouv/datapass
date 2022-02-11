import React, { ChangeEventHandler, FunctionComponent } from 'react';
import Input from './Input';

type Props = {
  label: string;
  helper?: string;
  meta?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  ariaLabel?: string;
  required?: boolean;
};

export const TextInput: FunctionComponent<Props> = ({
  label,
  helper,
  meta,
  name,
  placeholder = '',
  value,
  disabled,
  onChange,
  ariaLabel,
  required,
  ...rest
}) => (
  <Input
    label={label}
    helper={helper}
    meta={meta}
    name={name}
    placeholder={placeholder}
    value={value}
    disabled={disabled}
    onChange={onChange}
    ariaLabel={ariaLabel}
    required={required}
    {...rest}
    type="text"
  />
);

export default TextInput;
