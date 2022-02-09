import React from 'react';
import Form from '../components/templates/Form';
import OrganisationSection from '../components/organisms/form-sections/OrganisationSection';
import CguSection from '../components/organisms/form-sections/CguSection';
import AidantsSection from '../components/organisms/form-sections/aidants-connect-sections/AidantsSection';
import StructureSection from '../components/organisms/form-sections/aidants-connect-sections/StructureSection';
import ÉquipeSection from '../components/organisms/form-sections/ÉquipeSection';
import { DATA_PROVIDER_PARAMETERS } from '../config/data-provider-parameters';

const initialContacts = {
  demandeur: {
    header: 'Demandeur',
    description: (
      <>
        <b>Le demandeur</b>, c'est vous, dépose la demande d’habilitation.
      </>
    ),
    forceDisable: true,
  },
  responsable_metier: {
    header: 'Responsable Aidants Connect',
    description: (
      <>
        <b>Le responsable Aidants Connect</b> est en charge de la mise en place
        et du suivi d’Aidants Connect au sein du lieu d’accueil. Il tient
        également à jour la liste des aidants habilités Aidants Connect sur son
        espace administrateur (à venir). <br />
        Pour des raisons de sécurité, nous n’acceptons que les adresses emails
        nominatives et individuelles . Étant un outil homologué par l’Agence
        Nationale de la Cohésion des Territoires, cela est un prérequis pour
        garantir la sécurité de l’outil et la fiabilité des traces de connexion.
        Seule une adresse email individuelle, professionnelle et nominative sera
        acceptée. Les adresses de type contact@, ccas.ville@, mairie@,
        direction@, franceservices@, etc. ne sont donc pas acceptées. Nous
        acceptons des adresses emails créées pour l'occasion, qu'importe le
        fournisseur de messagerie électronique choisi.
      </>
    ),
    displayIndividualEmailLabel: true,
  },
  responsable_traitement: null,
  delegue_protection_donnees: null,
  responsable_technique: null,
  aidant: {
    header: 'Aidant',
    description: (
      <>
        <b>Les aidants</b> professionnels vont réaliser des démarches
        administratives à la place des usagers de façon sécurisée avec
        AidantsConnect.
      </>
    ),
    multiple: true,
    displayIndividualEmailLabel: true,
    contactByEmailOnly: true,
  },
};

const additionalTermsOfUse = [
  {
    id: 'has_professional_contact_only',
    label: (
      <>
        Je confirme que la liste des aidants à habiliter contient exclusivement
        des aidants professionnels. Elle ne contient donc ni service civique, ni
        bénévole, ni apprenti, ni stagiaire.
      </>
    ),
  },
  {
    id: 'has_non_elected_contact_only',
    label: (
      <>
        Je confirme qu’aucun élu n’est impliqué dans l’habilitation Aidants
        Connect. Le responsable Aidants Connect ainsi que les aidants à
        habiliter ne sont pas des élus.
      </>
    ),
  },
];

const target_api = 'aidants_connect';

const AidantsConnect = () => (
  <Form
    target_api={target_api}
    contactEmail={DATA_PROVIDER_PARAMETERS[target_api]?.email}
    documentationUrl="https://aidantsconnect.beta.gouv.fr/"
  >
    <OrganisationSection />
    <StructureSection />
    <ÉquipeSection initialContacts={initialContacts} />
    <AidantsSection />
    <CguSection
      cguLink="https://aidantsconnect.beta.gouv.fr/cgu/"
      additionalTermsOfUse={additionalTermsOfUse}
    />
  </Form>
);

export default AidantsConnect;
