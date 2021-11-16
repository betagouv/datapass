import React from 'react';
import PropTypes from 'prop-types';

import Form from '../../components/templates/Form';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import DemarcheSection from '../../components/organisms/form-sections/DemarcheSection';
import DescriptionSection from '../../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../../components/organisms/form-sections/DonneesSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import demarches from './demarches.json';
import ÉquipeSection from '../../components/organisms/form-sections/ÉquipeSection';
import { DATA_PROVIDER_CONTACT_EMAILS } from '../../config/data-provider-parameters';

const availableScopes = [
  {
    value: 'en_regle',
    label: 'État de régularité vis-à-vis des obligations de Service National',
    mandatory: true,
  },
];

const target_api = 'api_service_national';

const ApiServiceNational = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api={target_api}
    demarches={demarches}
    contactInformation={[
      {
        email: DATA_PROVIDER_CONTACT_EMAILS[target_api],
        label: 'Nous contacter',
        subject: 'Contact%20via%20datapass.api.gouv.fr',
      },
    ]}
  >
    <OrganisationSection />
    <DemarcheSection />
    <DescriptionSection />
    <DonneesSection availableScopes={availableScopes} />
    <CadreJuridiqueSection />
    <ÉquipeSection />
    <CguSection cguLink="https://presaje.sga.defense.gouv.fr/cgu-dln1f" />
  </Form>
);

ApiServiceNational.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

ApiServiceNational.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default ApiServiceNational;
