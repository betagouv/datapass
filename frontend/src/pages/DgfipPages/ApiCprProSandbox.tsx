import React from 'react';
import Form from '../../components/templates/Form';
import DescriptionSection from '../../components/organisms/form-sections/DescriptionSection';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import ÉquipeSection from '../../components/organisms/form-sections/ÉquipeSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import { additionalTermsOfUse, DataAreInTermsOfUseDescription } from './common';
import DonneesSection from '../../components/organisms/form-sections/DonneesSection';
import { DATA_PROVIDER_CONFIGURATIONS } from '../../config/data-provider-configurations';
import PreviousEnrollmentSection from '../../components/organisms/form-sections/PreviousEnrollmentSection';

const target_api = 'api_cpr_pro_sandbox';
const steps = [target_api, 'api_cpr_pro_production'];

const ApiCprProSandbox = () => (
  <Form
    target_api={target_api}
    contactEmail={DATA_PROVIDER_CONFIGURATIONS[target_api]?.email}
    documentationUrl="https://api.gouv.fr/producteurs/dgfip"
  >
    <PreviousEnrollmentSection steps={steps} />
    <OrganisationSection />
    <DescriptionSection />
    <DonneesSection ScopesDescription={DataAreInTermsOfUseDescription} />
    <CadreJuridiqueSection />
    <ÉquipeSection />
    <CguSection
      cguLink="/docs/cgu_pcr_v1/cgu_bas_cpr_pro_v.2023_11.pdf"
      additionalTermsOfUse={additionalTermsOfUse}
    />
  </Form>
);

export default ApiCprProSandbox;
