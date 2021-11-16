import React from 'react';
import PropTypes from 'prop-types';

import Form from '../components/templates/Form';
import OrganisationSection from '../components/organisms/form-sections/OrganisationSection';
import DescriptionSection from '../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../components/organisms/form-sections/DonneesSection';
import CadreJuridiqueSection from '../components/organisms/form-sections/CadreJuridiqueSection';
import CguSection from '../components/organisms/form-sections/CguSection';
import ÉquipeSection from '../components/organisms/form-sections/ÉquipeSection';
import { DATA_PROVIDER_CONTACT_EMAILS } from '../config/data-provider-parameters';

const availableScopes = [
  {
    value: 'cnam_PaiementIndemnitesJournalieres',
    label: 'Période indemnisée et montants journaliers',
    mandatory: true,
  },
];

const steps = ['franceconnect', 'api_indemnites_journalieres_cnam'];

const target_api = 'api_indemnites_journalieres_cnam';

const ApiIndemnitesJournalieresCnam = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api={target_api}
    steps={steps}
    contactInformation={[
      {
        email: DATA_PROVIDER_CONTACT_EMAILS.cnam,
        label: 'Nous contacter',
        subject: 'Contact%20via%20datapass.api.gouv.fr',
      },
    ]}
  >
    <OrganisationSection />
    <DescriptionSection />
    <DonneesSection availableScopes={availableScopes} />
    <CadreJuridiqueSection />
    <ÉquipeSection />
    <CguSection cguLink="/docs/API_Droits_CNAM_CGU_20181210.pdf" />
  </Form>
);

ApiIndemnitesJournalieresCnam.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

ApiIndemnitesJournalieresCnam.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default ApiIndemnitesJournalieresCnam;
