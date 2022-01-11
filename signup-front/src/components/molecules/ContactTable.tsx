import React from 'react';
import { DATA_PROVIDER_PARAMETERS } from '../../config/data-provider-parameters';
import { dataProviderParametersToContactInfo } from '../../lib';
import Link from '../atoms/Link';

const ContactsTable = () => {
  type dataProviderInfoType = {
    label: string;
    email: string;
  };

  const dataProviderInfo: Array<dataProviderInfoType> =
    dataProviderParametersToContactInfo(DATA_PROVIDER_PARAMETERS);

  return (
    <div className="fr-table">
      <table>
        <thead>
          <td>Nature de la demande</td>
          <td>Contact</td>
        </thead>
        <tbody>
          {dataProviderInfo.map(({ label, email }) => (
            <tr>
              <td>{label}</td>
              <td>
                <Link
                  href={`mailto:${email}?subject=Contact%20via%20la%20FAQ%20datapass.api.gouv.fr`}
                >
                  Écrire à l’équipe
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactsTable;
