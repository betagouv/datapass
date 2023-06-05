import React from 'react';

export const ButtonGroup = ({ align = '', children }) => {
  let className =
    'fr-btns-group fr-btns-group--inline-lg fr-btns-group--icon-left';

  if (align) {
    className += ` fr-btns-group--${align}`;
  }
  return <div className={className}>{children}</div>;
};

export default ButtonGroup;
