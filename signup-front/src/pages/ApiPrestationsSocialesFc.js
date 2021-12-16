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
import {
  availableScopes,
  CadreJuridiqueDescription,
  DonneesDescription,
} from './ApiPrestationsSociales';

const target_api = 'api_prestations_sociales_fc';
const steps = ['franceconnect', target_api];

const ApiPrestationsSociales = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api={target_api}
    steps={steps}
    contactEmail={DATA_PROVIDER_CONTACT_EMAILS.api_prestations_sociales}
    documentationUrl="https://api.gouv.fr/les-api/api-prestations-sociales"
  >
    <OrganisationSection />
    <DescriptionSection />
    <DonneesSection
      availableScopes={availableScopes}
      DonneesDescription={DonneesDescription}
    />
    <CadreJuridiqueSection
      CadreJuridiqueDescription={CadreJuridiqueDescription}
    />
    <ÉquipeSection />
    <CguSection cguLink="https://api.gouv.fr/resources/CGU%20API%20Particulier.pdf" />
  </Form>
);

ApiPrestationsSociales.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

ApiPrestationsSociales.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default ApiPrestationsSociales;
