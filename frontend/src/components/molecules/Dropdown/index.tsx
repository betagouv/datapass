import React, { FunctionComponent, MouseEvent } from 'react';
import './style.css';

type Props = {
  onOutsideClick: (event: MouseEvent<HTMLElement>) => void;
  fillWidth?: boolean;
};

export const Dropdown: FunctionComponent<Props> = ({
  onOutsideClick,
  fillWidth = false,
  children,
}) => {
  return (
    <div style={{ position: 'relative' }}>
      <div
        className="datapass-dropdown-content"
        style={fillWidth ? { width: '100%' } : {}}
      >
        {children}
      </div>
      <div className="datapass-dropdown-backdrop" onClick={onOutsideClick} />
    </div>
  );
};

export default Dropdown;
