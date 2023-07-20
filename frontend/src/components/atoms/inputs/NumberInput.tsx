import Input, { InputProps } from './Input';

export const NumberInput: React.FC<InputProps> = ({ ...props }) => (
  <Input {...props} type="number" min="0" max="2147483647" />
);

export default NumberInput;
