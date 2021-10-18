import React from 'react';
import PropTypes from 'prop-types';

import Form from '../../components/templates/Form';
import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import HomologationSecuriteSection from '../../components/organisms/form-sections/dgfip-sections/HomologationSecuriteSection';
import RecetteFonctionnelleSection from '../../components/organisms/form-sections/dgfip-sections/RecetteFonctionnelleSection';
import VolumetrieSection from '../../components/organisms/form-sections/dgfip-sections/VolumetrieSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import ÉquipeInitializerSection from '../../components/organisms/form-sections/ÉquipeSection/ÉquipeInitializerSection';

const target_api = 'api_e_pro_production';
const steps = ['api_e_pro_sandbox', target_api];

const ApiEProProduction = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api={target_api}
    steps={steps}
    PreviousEnrollmentDescription={() => null}
    documentationUrl="https://api.gouv.fr/producteurs/dgfip"
  >
    <ÉquipeInitializerSection />
    <RecetteFonctionnelleSection />
    <CadreJuridiqueSection />
    <HomologationSecuriteSection />
    <VolumetrieSection options={[200, 1000]} />
    <CguSection cguLink="/docs/cgu_api_e_pro_pcr_prod_2021_v1.0.pdf" />
  </Form>
);

ApiEProProduction.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

ApiEProProduction.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default ApiEProProduction;
