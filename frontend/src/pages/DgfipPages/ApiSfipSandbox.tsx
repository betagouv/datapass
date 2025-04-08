import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import DemarcheSection from '../../components/organisms/form-sections/DemarcheSection';
import DescriptionSection from '../../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../../components/organisms/form-sections/DonneesSection';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import PreviousEnrollmentSection from '../../components/organisms/form-sections/PreviousEnrollmentSection';
import ÉquipeSection from '../../components/organisms/form-sections/ÉquipeSection';
import Form from '../../components/templates/Form';
import { DATA_PROVIDER_CONFIGURATIONS } from '../../config/data-provider-configurations';
import {
  scopesConfiguration,
  groups,
  demarches,
  DonneesDescription,
} from './api-impot-particulier-common';
import { CadreJuridiqueDescription } from './ApiImpotParticulierSandbox';
import { additionalTermsOfUse } from './common';
import ImpotPartDocumentationAlert from '../../components/molecules/ImpotPartDocumentationAlert';

const target_api = 'api_sfip_sandbox';
const steps = [target_api, 'api_sfip_production'];

const ApiSfipSandbox = () => (
  <Form
    target_api={target_api}
    demarches={demarches}
    contactEmail={DATA_PROVIDER_CONFIGURATIONS[target_api]?.email}
    documentationUrl="https://api.gouv.fr/les-api/api-sfip"
  >
    <PreviousEnrollmentSection steps={steps} />
    <OrganisationSection />
    <DemarcheSection scopesConfiguration={scopesConfiguration} />
    <DescriptionSection />
    <DonneesSection
      DonneesDescription={DonneesDescription}
      scopesConfiguration={scopesConfiguration}
      groups={groups}
      enableFileSubmissionForScopeSelection={true}
      DonneesDocumentation={ImpotPartDocumentationAlert}
    />
    <CadreJuridiqueSection
      CadreJuridiqueDescription={CadreJuridiqueDescription}
    />
    <ÉquipeSection />
    <CguSection
      cguLink="/docs/cgu_api_impot_particulier_bac_a_sable_connexion_hors_fc_septembre2020_v2.6.pdf"
      additionalTermsOfUse={additionalTermsOfUse}
    />
  </Form>
);

export default ApiSfipSandbox;
