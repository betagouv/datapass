import React, { ReactNode } from 'react';
import './style.css';

type Props = {
  title: string;
  icon: ReactNode;
};

export const IconTitle: React.FC<Props> = ({ title, icon }) => {
  return (
    <div className="icon-title">
      {icon}
      <h3>{title}</h3>
    </div>
  );
};

export default IconTitle;
