import React from 'react';
import Alert from '../atoms/Alert';

export const NotFound = () => (
  <div className="full-page">
    <Alert type="error" title="Erreur 404">
      La page que vous recherchez est introuvable.
    </Alert>
  </div>
);

export default NotFound;
