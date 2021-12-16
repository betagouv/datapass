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
import { DATA_PROVIDER_CONTACT_EMAILS } from '../../config/data-provider-parameters';

const target_api = 'api_ensu_dad_sandbox';
const steps = [target_api, 'api_ensu_dad_production'];

const ApiEnsuDadSandbox = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api={target_api}
    steps={steps}
    contactEmail={DATA_PROVIDER_CONTACT_EMAILS.dgfip}
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
      cguLink="/docs/cgu_pcr_v1/CGU_API ENSU DAD_PCR_BAS_2021_v1.0.pdf"
      additionalTermsOfUse={additionalTermsOfUse}
    />
  </Form>
);

ApiEnsuDadSandbox.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

ApiEnsuDadSandbox.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default ApiEnsuDadSandbox;
