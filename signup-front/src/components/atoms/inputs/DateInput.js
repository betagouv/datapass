import React from 'react';
import Input from './Input';

export const DateInput = (props) => (
  // the placeholder is used only on Safari and IE11 where input[type="date"] is not implemented.
  <Input {...props} placeholder={'AAAA-MM-JJ'} type="date" />
);

export default DateInput;
