import React from 'react';
import Input from './Input';

export const TelInput = ({ ...props }) => {
  return <Input {...props} type="tel" pattern="\+?(?:[0-9][ -]?){6,14}[0-9]" />;
};

export default TelInput;
