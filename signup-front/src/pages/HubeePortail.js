import React from 'react';
import PropTypes from 'prop-types';

import Form from '../components/templates/Form';
import OrganisationSection from '../components/organisms/form-sections/OrganisationSection';
import DemarcheEnLigneSection from '../components/organisms/form-sections/hubee-sections/DemarcheEnLigneSection';
import ÉquipeSection from '../components/organisms/form-sections/ÉquipeSection';
import CguSection from '../components/organisms/form-sections/CguSection';
import { DATA_PROVIDER_CONTACT_EMAILS } from '../config/data-provider-parameters';
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
    header: 'Responsable d’abonnement',
    description: (
      <>
        <b>Le responsable d’abonnement</b> disposera des droits d’administration
        sur le portail HubEE : gestion des abonnements, gestion des utilisateurs
        et accès aux statistiques d’usage.
      </>
    ),
  },
  responsable_traitement: null,
  delegue_protection_donnees: null,
  responsable_technique: null,
};

const target_api = 'hubee_portail';

const HubeePortail = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api={target_api}
    contactInformation={[
      {
        email: DATA_PROVIDER_CONTACT_EMAILS.hubee,
        label: 'Nous contacter',
        subject: 'Contact%20via%20datapass.api.gouv.fr',
      },
    ]}
    documentationUrl="https://www.numerique.gouv.fr/dinum/"
  >
    <OrganisationSection />
    <IntituleInitializerSection value="Abonnement portail HubEE" />
    <DemarcheEnLigneSection />
    <ÉquipeSection initialContacts={initialContacts} />
    <CguSection cguLink="/docs/20210212_dinum_hubee_cgu_v2_1_0_version_site.pdf" />
  </Form>
);

HubeePortail.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

HubeePortail.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default HubeePortail;
