import React from 'react';
import Form from '../../components/templates/Form';
import DescriptionSection from '../../components/organisms/form-sections/DescriptionSection';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import ÉquipeSection from '../../components/organisms/form-sections/ÉquipeSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import { additionalTermsOfUse, DataAreInTermsOfUseDescription } from './common';
import DonneesSection from '../../components/organisms/form-sections/DonneesSection';
import { DATA_PROVIDER_CONTACT_EMAILS } from '../../config/data-provider-parameters';
import PreviousEnrollmentSection from '../../components/organisms/form-sections/PreviousEnrollmentSection';

const target_api = 'api_hermes_sandbox';
const steps = [target_api, 'api_hermes_production'];

const ApiHermesSandbox = () => (
  <Form
    target_api={target_api}
    contactEmail={DATA_PROVIDER_CONTACT_EMAILS.dgfip}
    documentationUrl="https://api.gouv.fr/producteurs/dgfip"
  >
    <PreviousEnrollmentSection steps={steps} />
    <OrganisationSection />
    <DescriptionSection />
    <DonneesSection
      AvailableScopesDescription={DataAreInTermsOfUseDescription}
    />
    <CadreJuridiqueSection />
    <ÉquipeSection />
    <CguSection
      cguLink="/docs/cgu_api_hermes_bac_a_sable_v1_4_05-05-2021_cdc.pdf"
      additionalTermsOfUse={additionalTermsOfUse}
    />
  </Form>
);

export default ApiHermesSandbox;
