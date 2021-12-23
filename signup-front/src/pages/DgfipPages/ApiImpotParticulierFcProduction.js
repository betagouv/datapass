import React from 'react';
import Form from '../../components/templates/Form';
import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import HomologationSecuriteSection from '../../components/organisms/form-sections/dgfip-sections/HomologationSecuriteSection';
import RecetteFonctionnelleSection from '../../components/organisms/form-sections/dgfip-sections/RecetteFonctionnelleSection';
import VolumetrieSection from '../../components/organisms/form-sections/dgfip-sections/VolumetrieSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import ÉquipeInitializerSection from '../../components/organisms/form-sections/ÉquipeSection/ÉquipeInitializerSection';
import { DATA_PROVIDER_CONTACT_EMAILS } from '../../config/data-provider-parameters';
import { CadreJuridiqueDescription } from './ApiImpotParticulierFcSandbox';
import PreviousEnrollmentSection from '../../components/organisms/form-sections/PreviousEnrollmentSection';

const target_api = 'api_impot_particulier_fc_production';
const steps = ['franceconnect', 'api_impot_particulier_fc_sandbox', target_api];

const ApiImpotParticulierProduction = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api={target_api}
    contactEmail={DATA_PROVIDER_CONTACT_EMAILS.dgfip}
    documentationUrl="https://api.gouv.fr/les-api/impot-particulier"
  >
    <ÉquipeInitializerSection />
    <PreviousEnrollmentSection steps={steps} />
    <RecetteFonctionnelleSection />
    <CadreJuridiqueSection
      CadreJuridiqueDescription={CadreJuridiqueDescription}
    />
    <HomologationSecuriteSection />
    <VolumetrieSection />
    <CguSection cguLink="/docs/cgu_api_impot_particulier_production_connexion_fc_septembre2020_v5.5.pdf" />
  </Form>
);

export default ApiImpotParticulierProduction;
