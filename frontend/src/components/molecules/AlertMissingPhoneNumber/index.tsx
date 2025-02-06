import React from 'react';
import SoftAlert from '../SoftAlert';

export const AlertMissingPhoneNumber: React.FC = () => (
  <SoftAlert>
    Un numéro de téléphone est nécessaire : compléter sur{' '}
    <a
      href="https://identite.proconnect.gouv.fr/personal-information"
      target="_blank"
      rel="noreferrer"
    >
      Pro Connect
    </a>
  </SoftAlert>
);

export default AlertMissingPhoneNumber;
