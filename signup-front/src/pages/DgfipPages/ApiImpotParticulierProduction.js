import React from 'react';
import PropTypes from 'prop-types';

import Form from '../../components/templates/Form';
import HomologationSecuriteSection from '../../components/organisms/form-sections/dgfip-sections/HomologationSecuriteSection';
import RecetteFonctionnelleSection from '../../components/organisms/form-sections/dgfip-sections/RecetteFonctionnelleSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/deprecated/CadreJuridiqueSection';
import DonneesPersonnellesSection from '../../components/organisms/form-sections/deprecated/DonneesPersonnellesSection';
import VolumetrieSection from '../../components/organisms/form-sections/dgfip-sections/VolumetrieSection';
import CguSection from '../../components/organisms/form-sections/deprecated/CguSection';
import { CguDescription } from './api-impot-particulier-common';
import {
  DemarcheDescriptionProduction as DemarcheDescription,
  PreviousEnrollmentDescription,
} from './common';
import { CadreJuridiqueDescription } from './ApiImpotParticulierSandbox';

const target_api = 'api_impot_particulier_production';
const steps = ['api_impot_particulier_sandbox', target_api];

const ApiImpotParticulierProduction = ({
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
    documentationUrl="https://api.gouv.fr/les-api/impot-particulier"
  >
    <RecetteFonctionnelleSection />
    <DonneesPersonnellesSection doInitializeDemandeur={true} />
    <CadreJuridiqueSection
      CadreJuridiqueDescription={CadreJuridiqueDescription}
    />
    <HomologationSecuriteSection />
    <VolumetrieSection />
    <CguSection
      cguLink="/docs/cgu_api_impot_particulier_production_hors_connexion_fc_septembre2020_v3.5.pdf"
      CguDescription={CguDescription}
    />
  </Form>
);

ApiImpotParticulierProduction.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

ApiImpotParticulierProduction.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default ApiImpotParticulierProduction;
