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
import { CadreJuridiqueDescription } from './ApiFicobaSandbox';

const target_api = 'api_ficoba_production';
const steps = ['api_ficoba_sandbox', target_api];

const ApiFicobaProduction = ({
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
    documentationUrl="https://api.gouv.fr/les-api/api_comptes_bancaires_ficoba"
  >
    <RecetteFonctionnelleSection />
    <DonneesPersonnellesSection doInitializeDemandeur={true} />
    <CadreJuridiqueSection
      CadreJuridiqueDescription={CadreJuridiqueDescription}
    />
    <HomologationSecuriteSection />
    <VolumetrieSection options={[200]} />
    <CguSection cguLink="/docs/cgu_api_ficoba_production_decembre2020_v1.1.pdf" />
  </Form>
);

ApiFicobaProduction.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

ApiFicobaProduction.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default ApiFicobaProduction;
