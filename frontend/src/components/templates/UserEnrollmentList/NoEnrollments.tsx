import React from 'react';
import { NewEnrollmentButton } from '../../molecules/NewEnrollmentButton';

import './NoEnrollments.css';

const NoEnrollments: React.FC = () => {
  return (
    <div className="full-page">
      <div className="no-enrollments-container">
        <img src="/images/empty-box.svg" alt="Boîte vide" />
        <p>Vous n’avez pas encore de demande d’habilitation.</p>
        <NewEnrollmentButton />
      </div>
    </div>
  );
};

export default NoEnrollments;
