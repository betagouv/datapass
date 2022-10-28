import React from 'react';
import Form from '../components/templates/Form';
import OrganisationSection from '../components/organisms/form-sections/OrganisationSection';
import DemarcheEnLigneSection from '../components/organisms/form-sections/hubee-sections/DemarcheEnLigneSection';
import ÉquipeSection from '../components/organisms/form-sections/ÉquipeSection';
import CguSection from '../components/organisms/form-sections/CguSection';
import { DATA_PROVIDER_CONFIGURATIONS } from '../config/data-provider-configurations';
import IntituleInitializerSection from '../components/organisms/form-sections/hubee-sections/IntituleInitializerSection';

const initialContacts = {
  demandeur: {
    header: 'Demandeur',
    description: (
      <>
        <b>Le demandeur</b>, c’est vous, dépose la demande d’abonnement.
      </>
    ),
    forceDisable: true,
  },
  responsable_metier: {
    header: 'Administrateur métier',
    description: (
      <>
        <b>L’administrateur métier</b> disposera des droits d’administration
        portail HubEE : gestion des abonnements et gestion des utilisateurs.
      </>
    ),
    displayIndividualEmailLabel: true,
  },
  responsable_traitement: null,
  delegue_protection_donnees: null,
  responsable_technique: null,
};

const demarchesHubee = [
  {
    id: 'CERTDC',
    label: 'CertDc - Certificat de décès',
    description: (
      <>
        Ce service donne la possibilité de recevoir par voie électronique le
        volet administratif du certificat de décès lorsque le médecin rédige le
        certificat de décès au moyen de l’application « CertDc ».
      </>
    ),
  },
];

const target_api = 'hubee_portail';

const HubeePortail = () => (
  <Form
    target_api={target_api}
    contactEmail={DATA_PROVIDER_CONFIGURATIONS[target_api]?.email}
    documentationUrl="https://www.numerique.gouv.fr/dinum/"
  >
    <OrganisationSection />
    <IntituleInitializerSection value="Abonnement au portail HubEE" />
    <DemarcheEnLigneSection demarchesHubee={demarchesHubee} />
    <ÉquipeSection initialContacts={initialContacts} />
    <CguSection cguLink="/docs/20210212_dinum_hubee_cgu_v2_1_0_version_site.pdf" />
  </Form>
);

export default HubeePortail;
