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
import { DATA_PROVIDER_CONTACT_EMAILS } from '../../config/data-provider-emails';

const target_api = 'api_r2p_production';
const steps = ['api_r2p_sandbox', target_api];

const ApiR2PProduction = ({
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
    documentationUrl="https://api.gouv.fr/les-api/api_r2p"
    contactInformation={[
      {
        email: DATA_PROVIDER_CONTACT_EMAILS.dgfip,
        label: 'Nous contacter',
        subject: 'Contact%20via%20datapass.api.gouv.fr',
      },
    ]}
  >
    <RecetteFonctionnelleSection />
    <DonneesPersonnellesSection doInitializeDemandeur={true} />
    <CadreJuridiqueSection />
    <HomologationSecuriteSection />
    <VolumetrieSection options={[50, 200, 1000]} />
    <CguSection cguLink="/docs/cgu_api_r2p_production_septembre2020_v2.5.pdf" />
  </Form>
);

ApiR2PProduction.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

ApiR2PProduction.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default ApiR2PProduction;
