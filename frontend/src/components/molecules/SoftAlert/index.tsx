import React from 'react';
import './index.css';
import { WarningIcon } from '../../atoms/icons/fr-fi-icons';

type Props = {
  children: React.ReactNode;
};

export const SoftAlert: React.FC<Props> = ({ children }) => (
  <div className="soft-alert">
    <WarningIcon />
    {children}
  </div>
);

export default SoftAlert;
