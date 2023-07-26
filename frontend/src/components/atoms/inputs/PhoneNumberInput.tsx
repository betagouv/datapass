import Input, { InputProps } from './Input';

export const PhoneNumberInput: React.FC<InputProps> = ({ ...props }) => (
  <Input {...props} type="tel" pattern="\+?(?:[0-9][ -]?){6,14}[0-9]" />
);

export default PhoneNumberInput;
