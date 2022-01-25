import React from 'react';

export const ButtonGroup = ({ alignRight = false, children }) => {
  let className =
    'fr-btns-group fr-btns-group--inline-lg fr-btns-group--icon-left';

  if (alignRight) {
    className += ' fr-btns-group--right';
  }
  return <div className={className}>{children}</div>;
};

export default ButtonGroup;
