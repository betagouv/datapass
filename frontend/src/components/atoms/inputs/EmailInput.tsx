import Input, { InputProps } from './Input';

export const EmailInput: React.FC<InputProps> = (props) => {
  return <Input {...props} type="email" />;
};

export default EmailInput;
