import React from 'react';
import Input from './Input';

export const NumberInput = ({ ...props }) => (
  <Input {...props} type="number" min="0" max="2147483647" />
);

export default NumberInput;
