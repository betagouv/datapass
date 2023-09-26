import React from 'react';
import Form from '../components/templates/Form';
import OrganisationSection from '../components/organisms/form-sections/OrganisationSection';
import DescriptionSection from '../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../components/organisms/form-sections/DonneesSection';
import CadreJuridiqueSection from '../components/organisms/form-sections/CadreJuridiqueSection';
import CguSection from '../components/organisms/form-sections/CguSection';
import ÉquipeSection from '../components/organisms/form-sections/ÉquipeSection';
import { DATA_PROVIDER_CONFIGURATIONS } from '../config/data-provider-configurations';
import { getDefaultDocumentationUrl } from '../components/organisms/Nav';
import PreviousEnrollmentSection from '../components/organisms/form-sections/PreviousEnrollmentSection';

const scopesConfiguration = [
  {
    value: 'cnam_PaiementIndemnitesJournalieres',
    label: 'Paiements dʼindemnités journalières versées par lʼAssurance Maladie',
    required: true,
  },
];

const steps = ['franceconnect', 'api_indemnites_journalieres_cnam'];

const target_api = 'api_indemnites_journalieres_cnam';

const ApiIndemnitesJournalieresCnam = () => (
  <Form
    target_api={target_api}
    contactEmail={DATA_PROVIDER_CONFIGURATIONS[target_api]?.email}
    documentationUrl={getDefaultDocumentationUrl(target_api)}
  >
    <PreviousEnrollmentSection steps={steps} />
    <OrganisationSection />
    <DescriptionSection />
    <DonneesSection scopesConfiguration={scopesConfiguration} />
    <CadreJuridiqueSection />
    <ÉquipeSection />
    <CguSection cguLink="/docs/API_Droits_CNAM_CGU_20181210.pdf" />
  </Form>
);

export default ApiIndemnitesJournalieresCnam;
