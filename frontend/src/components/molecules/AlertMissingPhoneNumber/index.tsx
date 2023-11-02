import React from 'react';
import Alert, { AlertType } from '../../atoms/Alert';

export const AlertMissingPhoneNumber: React.FC = () => (
  <Alert type={AlertType.warning}>
    Un numéro de téléphone est nécessaire : compléter sur{' '}
    <a
      href="https://moncomptepro.beta.gouv.fr/"
      target="_blank"
      rel="noreferrer"
    >
      Mon Compte Pro
    </a>
  </Alert>
);

export default AlertMissingPhoneNumber;
