import React from 'react';
import { FrFiIcon } from '../../atoms/icons/fr-fi-icons';
import './style.css';

type Props = {
  title: string;
  icon: string;
};

export const IconTitle: React.FC<Props> = ({ title, icon }) => {
  return (
    <div className="icon-title">
      <FrFiIcon type={icon} color="var(--text-action-high-blue-france)" />
      <h3>{title}</h3>
    </div>
  );
};

export default IconTitle;
