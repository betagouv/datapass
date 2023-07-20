import Input, { InputProps } from './Input';

export const TextInput: React.FC<InputProps> = (props) => (
  <Input {...props} type="text" />
);

export default TextInput;
