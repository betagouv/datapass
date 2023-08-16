import React from 'react';
import Alert, { AlertType } from '../atoms/Alert';

export const NotFound = () => (
  <div className="full-page">
    <Alert type={AlertType.error} title="Erreur 404">
      La page que vous recherchez est introuvable.
    </Alert>
  </div>
);

export default NotFound;
