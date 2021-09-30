import React from 'react';

const contacts = [
  { name: 'AidantConnect', address: 'contact@aidantsconnect.beta.gouv.fr' },
  { name: 'Hubee', address: '' },
  {
    name: 'FranceConnect',
    address: 'support.partenaires@franceconnect.gouv.fr',
  },
  {
    name: 'Pro Santé Connect',
    address: 'prosanteconnect.editeurs@esante.gouv.fr',
  },
  { name: 'API Particulier', address: 'contact@particulier.api.gouv.fr' },
  { name: 'API Entreprise', address: 'support@entreprise.api.gouv.fr' },
  {
    name: 'API Impôt particulier, API Recherche des personnes physiques (R2P) ou API Fichier des Comptes Bancaires et Assimilés (FICOBA)',
    address: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
  },
  {
    name: 'API Tierce Déclaration auto-entrepreneur',
    address: 'contact.tiercedeclaration@urssaf.fr',
  },
  {
    name: 'API Indemnités Journalières ou API de droits à l’Assurance Maladie CNAM',
    address: 'partenaires-api-ameli.cnam@assurance-maladie.fr',
  },
  { name: 'CartoBio - Territoires', address: 'cartobio@beta.gouv.fr' },
  {
    name: 'le.Taxi',
    address: 'equipe@le.taxi',
  },
];

const ContactsTable = () => (
  <div className="fr-table">
    <table>
      <thead>
        <td>Nature de la demande</td>
        <td>Contact</td>
      </thead>
      <tbody>
        {contacts.map((contact) => (
          <tr>
            <td>{contact.name}</td>
            <td>
              <a
                href={`${contact.address}?subject=Contact%20via%20la%20FAQ%20datapass.api.gouv.fr`}
              >
                Leur écrire
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ContactsTable;
