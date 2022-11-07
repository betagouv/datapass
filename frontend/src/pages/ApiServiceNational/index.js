import React from 'react';
import Form from '../../components/templates/Form';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import DemarcheSection from '../../components/organisms/form-sections/DemarcheSection';
import DescriptionSection from '../../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../../components/organisms/form-sections/DonneesSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import demarches from './demarches.json';
import ÉquipeSection from '../../components/organisms/form-sections/ÉquipeSection';
import { DATA_PROVIDER_CONFIGURATIONS } from '../../config/data-provider-configurations';
import { getDefaultDocumentationUrl } from '../../components/organisms/Nav';

const availableScopes = [
  {
    value: 'en_regle',
    label: 'État de régularité vis-à-vis des obligations de Service National',
    required: true,
  },
];

const target_api = 'api_service_national';

const ApiServiceNational = () => (
  <Form
    target_api={target_api}
    demarches={demarches}
    contactEmail={DATA_PROVIDER_CONFIGURATIONS[target_api]?.email}
    documentationUrl={getDefaultDocumentationUrl(target_api)}
  >
    <OrganisationSection />
    <DemarcheSection availableScopes={availableScopes} />
    <DescriptionSection />
    <DonneesSection availableScopes={availableScopes} />
    <CadreJuridiqueSection />
    <ÉquipeSection />
    <CguSection cguLink="https://presaje.sga.defense.gouv.fr/cgu-dln1f" />
  </Form>
);

export default ApiServiceNational;
