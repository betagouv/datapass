import React from 'react';
import Form from '../../components/templates/Form';
import DescriptionSection from '../../components/organisms/form-sections/DescriptionSection';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import ÉquipeSection from '../../components/organisms/form-sections/ÉquipeSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import DonneesSection from '../../components/organisms/form-sections/DonneesSection';
import HomologationSecuriteSection from '../../components/organisms/form-sections/dgfip-sections/HomologationSecuriteSection';
import VolumetrieSection from '../../components/organisms/form-sections/dgfip-sections/VolumetrieSection';
import { DATA_PROVIDER_CONFIGURATIONS } from '../../config/data-provider-configurations';
import {
  accessModes,
  CadreJuridiqueDescription,
  DonneesDescription,
  scopesConfiguration,
} from './ApiFicobaSandbox';

const target_api = 'api_ficoba_unique';

const ApiFicobaUnique = () => (
  <Form
    target_api={target_api}
    contactEmail={DATA_PROVIDER_CONFIGURATIONS[target_api]?.email}
    documentationUrl="https://api.gouv.fr/les-api/api_comptes_bancaires_ficoba"
  >
    <OrganisationSection />
    <DescriptionSection />
    <DonneesSection
      DonneesDescription={DonneesDescription}
      scopesConfiguration={scopesConfiguration}
      accessModes={accessModes}
    />
    <CadreJuridiqueSection
      CadreJuridiqueDescription={CadreJuridiqueDescription}
    />
    <ÉquipeSection />
    <HomologationSecuriteSection />
    <VolumetrieSection options={[50, 100, 200]} />
    <CguSection cguLink="/docs/cgu_api_ficoba_production.pdf" />
  </Form>
);

export default ApiFicobaUnique;
