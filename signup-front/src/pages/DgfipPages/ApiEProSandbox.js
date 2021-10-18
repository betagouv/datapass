import React from 'react';
import PropTypes from 'prop-types';

import Form from '../../components/templates/Form';
import DescriptionSection from '../../components/organisms/form-sections/DescriptionSection';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import ÉquipeSection from '../../components/organisms/form-sections/ÉquipeSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import HasNextEnrollmentsNotification from '../../components/templates/Form/HasNextEnrollmentsNotification';
import { additionalTermsOfUse, DataAreInTermsOfUseDescription } from './common';
import DonneesSection from '../../components/organisms/form-sections/DonneesSection';

const target_api = 'api_e_pro_sandbox';
const steps = [target_api, 'api_e_pro_production'];

const ApiEProSandbox = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api={target_api}
    steps={steps}
    documentationUrl="https://api.gouv.fr/producteurs/dgfip"
  >
    <HasNextEnrollmentsNotification enrollmentId={enrollmentId} />
    <OrganisationSection />
    <DescriptionSection />
    <DonneesSection
      AvailableScopesDescription={DataAreInTermsOfUseDescription}
    />
    <CadreJuridiqueSection />
    <ÉquipeSection />
    <CguSection
      cguLink="/docs/cgu_api_e_pro_pcr_bas_2021_v1.0.pdf"
      additionalTermsOfUse={additionalTermsOfUse}
    />
  </Form>
);

ApiEProSandbox.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

ApiEProSandbox.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default ApiEProSandbox;
