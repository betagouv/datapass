import { TextareaHTMLAttributes, useState } from 'react';
import { uniqueId } from 'lodash';
import Label from './Label';

interface TextAreaInputProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string | React.ReactNode;
  helper?: string;
  meta?: string;
  ariaLabel?: string;
  highlighted?: boolean;
}

export const TextAreaInput: React.FC<TextAreaInputProps> = ({
  label,
  helper,
  meta,
  name,
  placeholder = '',
  value = undefined,
  highlighted = false,
  disabled,
  onChange,
  ariaLabel,
  required,
  rows = 10,
}) => {
  // id will be set once when the component initially renders, but never again
  // we generate a unique id prefixed by the field name
  const [id] = useState(uniqueId(name));

  let classNames = 'fr-input-group';

  if (highlighted) {
    classNames += ' highlighted';
  }

  return (
    <div className={classNames}>
      <Label
        id={id}
        label={label}
        required={required}
        helper={helper}
        meta={meta}
      />
      <textarea
        className="fr-input"
        rows={rows}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        id={id}
        readOnly={disabled}
        value={value}
        aria-label={ariaLabel}
        required={required}
      />
    </div>
  );
};

export default TextAreaInput;
