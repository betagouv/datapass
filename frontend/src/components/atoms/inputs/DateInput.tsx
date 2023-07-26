import Input, { InputProps } from './Input';

export const DateInput: React.FC<InputProps> = (props) => {
  return <Input {...props} placeholder="AAAA-MM-JJ" type="date" />;
};

export default DateInput;
