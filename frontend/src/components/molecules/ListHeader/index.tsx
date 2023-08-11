import React from 'react';
import './style.css';

type Props = {
  title: string;
  children?: React.ReactNode;
};

export const ListHeader: React.FC<Props> = ({ title, children = null }) => {
  return (
    <div className="list-header-container">
      <div className="list-header fr-my-3w fr-mx-auto">
        <h1 className="fr-m-0">{title}</h1>
        {children}
      </div>
    </div>
  );
};

export default ListHeader;
