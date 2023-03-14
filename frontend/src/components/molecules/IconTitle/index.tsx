import React from 'react';
import { FrFiIcon } from '../../atoms/icons/fr-fi-icons';
import './style.css';

type Props = {
  title: string;
  icon: any;
};

export const IconTitle: React.FC<Props> = ({ title, icon }) => {
  return (
    <div className="icon-title">
      {typeof icon === 'string' || icon instanceof String ? (
        <FrFiIcon
          type={icon as string}
          color="var(--text-action-high-blue-france)"
        />
      ) : (
        icon
      )}
      <h3>{title}</h3>
    </div>
  );
};

export default IconTitle;
