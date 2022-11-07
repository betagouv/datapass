import React, {
  ChangeEventHandler,
  FunctionComponent,
  ReactNode,
  useState,
} from 'react';
import { uniqueId } from 'lodash';
import Label from './Label';

type Props = {
  label: string | ReactNode;
  helper?: string;
  meta?: string;
  name?: string;
  placeholder?: string;
  value?: boolean;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  ariaLabel?: string;
  required?: boolean;
};

export const CheckboxInput: FunctionComponent<Props> = ({
  label,
  helper,
  meta,
  name,
  value = false,
  disabled,
  onChange,
  required,
  ...rest
}) => {
  // id will be set once when the component initially renders, but never again
  // we generate an unique id prefixed by the field name
  const [id] = useState(uniqueId(name));

  return (
    <div className="fr-checkbox-group">
      <input
        onChange={onChange}
        disabled={disabled}
        checked={value}
        type="checkbox"
        name={name}
        id={id}
        required={required}
        {...rest}
      />
      <Label
        id={id}
        label={label}
        required={required}
        helper={helper}
        meta={meta}
      />
    </div>
  );
};

export default CheckboxInput;
