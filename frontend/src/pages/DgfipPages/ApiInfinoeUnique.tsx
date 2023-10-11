import React from 'react';
import Form from '../../components/templates/Form';
import DescriptionSection from '../../components/organisms/form-sections/DescriptionSection';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import ÉquipeSection from '../../components/organisms/form-sections/ÉquipeSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import { DataAreInTermsOfUseDescription } from './common';
import DonneesSection from '../../components/organisms/form-sections/DonneesSection';
import { DATA_PROVIDER_CONFIGURATIONS } from '../../config/data-provider-configurations';
import HomologationSecuriteSection from '../../components/organisms/form-sections/dgfip-sections/HomologationSecuriteSection';
import VolumetrieSection from '../../components/organisms/form-sections/dgfip-sections/VolumetrieSection';

const target_api = 'api_infinoe_unique';

const ApiInfinoeUnique = () => (
  <Form
    target_api={target_api}
    contactEmail={DATA_PROVIDER_CONFIGURATIONS[target_api]?.email}
    documentationUrl="https://api.gouv.fr/producteurs/dgfip"
  >
    <OrganisationSection />
    <DescriptionSection />
    <DonneesSection ScopesDescription={DataAreInTermsOfUseDescription} />
    <CadreJuridiqueSection />
    <ÉquipeSection />
    <HomologationSecuriteSection />
    <VolumetrieSection />
    <CguSection cguLink="/docs/cgu_infinoe_production_v_2023_10.pdf" />
  </Form>
);

export default ApiInfinoeUnique;
