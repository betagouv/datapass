import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import DemarcheSection from '../../components/organisms/form-sections/DemarcheSection';
import DescriptionSection from '../../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../../components/organisms/form-sections/DonneesSection';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import ÉquipeSection from '../../components/organisms/form-sections/ÉquipeSection';
import HomologationSecuriteSection from '../../components/organisms/form-sections/dgfip-sections/HomologationSecuriteSection';
import VolumetrieSection from '../../components/organisms/form-sections/dgfip-sections/VolumetrieSection';
import Form from '../../components/templates/Form';
import { DATA_PROVIDER_CONFIGURATIONS } from '../../config/data-provider-configurations';
import {
  scopesConfiguration,
  groups,
  demarches,
  accessModes,
  DonneesDescription,
} from './api-impot-particulier-common';
import { CadreJuridiqueDescription } from './ApiImpotParticulierSandbox';

const target_api = 'api_impot_particulier_unique';

const ApiImpotParticulierUnique = () => (
  <Form
    target_api={target_api}
    demarches={demarches}
    contactEmail={DATA_PROVIDER_CONFIGURATIONS[target_api]?.email}
    documentationUrl="https://api.gouv.fr/les-api/impot-particulier"
  >
    <OrganisationSection />
    <DemarcheSection scopesConfiguration={scopesConfiguration} />
    <DescriptionSection />
    <DonneesSection
      DonneesDescription={DonneesDescription}
      scopesConfiguration={scopesConfiguration}
      groups={groups}
      accessModes={accessModes}
      enableFileSubmissionForScopeSelection={true}
    />
    <CadreJuridiqueSection
      CadreJuridiqueDescription={CadreJuridiqueDescription}
    />
    <ÉquipeSection />
    <HomologationSecuriteSection />
    <VolumetrieSection />
    <CguSection cguLink="/docs/cgu_api_impot_particulier_production_hors_connexion_fc_decembre2022_v4.0.pdf" />
  </Form>
);

export default ApiImpotParticulierUnique;
