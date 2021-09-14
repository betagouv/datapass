import React from 'react';
import PropTypes from 'prop-types';

import Form from '../../components/templates/Form';
import HomologationSecuriteSection from '../../components/organisms/form-sections/dgfip-sections/HomologationSecuriteSection';
import RecetteFonctionnelleSection from '../../components/organisms/form-sections/dgfip-sections/RecetteFonctionnelleSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/deprecated/CadreJuridiqueSection';
import DonneesPersonnellesSection from '../../components/organisms/form-sections/deprecated/DonneesPersonnellesSection';
import VolumetrieSection from '../../components/organisms/form-sections/dgfip-sections/VolumetrieSection';
import CguSection from '../../components/organisms/form-sections/deprecated/CguSection';
import {
  DemarcheDescriptionProduction as DemarcheDescription,
  PreviousEnrollmentDescription,
} from './common';

const target_api = 'api_opale_production';
const steps = ['api_opale_sandbox', target_api];

const ApiOpaleProduction = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api={target_api}
    steps={steps}
    PreviousEnrollmentDescription={PreviousEnrollmentDescription}
    DemarcheDescription={DemarcheDescription}
    documentationUrl="https://api.gouv.fr/producteurs/dgfip"
  >
    <RecetteFonctionnelleSection />
    <DonneesPersonnellesSection doInitializeDemandeur={true} />
    <CadreJuridiqueSection />
    <HomologationSecuriteSection />
    <VolumetrieSection options={[200, 1000]} />
    <CguSection cguLink="/docs/cgu_api_hermes_production_v1_3_05-05-2021_cdc.pdf" />
  </Form>
);

ApiOpaleProduction.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

ApiOpaleProduction.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default ApiOpaleProduction;
