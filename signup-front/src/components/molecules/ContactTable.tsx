import React from 'react';
import { DATA_PROVIDER_LABELLED_CONTACT_EMAILS } from '../../config/data-provider-emails';

const ContactsTable = () => (
  <div className="fr-table">
    <table>
      <thead>
        <td>Nature de la demande</td>
        <td>Contact</td>
      </thead>
      <tbody>
        {DATA_PROVIDER_LABELLED_CONTACT_EMAILS.map((contact) => (
          <tr>
            <td>{contact.label}</td>
            <td>
              <a
                href={`mailto:${contact.email}?subject=Contact%20via%20la%20FAQ%20datapass.api.gouv.fr`}
              >
                Écrire à l’équipe
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ContactsTable;
