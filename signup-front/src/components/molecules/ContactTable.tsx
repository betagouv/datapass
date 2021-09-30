import React from 'react';
import { API_CONTACTS } from '../../lib/api';

const ContactsTable = () => (
  <div className="fr-table">
    <table>
      <thead>
        <td>Nature de la demande</td>
        <td>Contact</td>
      </thead>
      <tbody>
        {API_CONTACTS.map((contact) => (
          <tr>
            <td>{contact.name}</td>
            <td>
              <a
                href={`${contact.address}?subject=Contact%20via%20la%20FAQ%20datapass.api.gouv.fr`}
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
