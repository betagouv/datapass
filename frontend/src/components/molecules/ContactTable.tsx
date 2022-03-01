import { FunctionComponent } from 'react';
import { DATA_PROVIDER_PARAMETERS } from '../../config/data-provider-parameters';
import { dataProviderParametersToContactInfo } from '../../lib';
import Link from '../atoms/hyperTexts/Link';

const ContactsTable: FunctionComponent = () => {
  type dataProviderInfoType = {
    label: string;
    email: string;
  };

  const dataProviderInfo: Array<dataProviderInfoType> =
    dataProviderParametersToContactInfo(DATA_PROVIDER_PARAMETERS);

  return (
    <div className="fr-table fr-table--layout-fixed">
      <table>
        <thead>
          <td>Nature de l’habilitation</td>
          <td>Contact</td>
        </thead>
        <tbody>
          {dataProviderInfo.map(({ label, email }) => (
            <tr>
              <td>{label}</td>
              <td>
                <Link
                  inline
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
