import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import DescriptionSection from '../../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../../components/organisms/form-sections/DonneesSection';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import PreviousEnrollmentSection from '../../components/organisms/form-sections/PreviousEnrollmentSection';
import ÉquipeSection from '../../components/organisms/form-sections/ÉquipeSection';
import Form from '../../components/templates/Form';
import { DATA_PROVIDER_PARAMETERS } from '../../config/data-provider-parameters';
import { editorList } from '../ApiParticulier';
import { additionalTermsOfUse, DataAreInTermsOfUseDescription } from './common';

const target_api = 'api_infinoe_sandbox';
const steps = [target_api, 'api_infinoe_production'];

const ApiInfinoeSandbox = () => (
  <Form
    target_api={target_api}
    contactEmail={DATA_PROVIDER_PARAMETERS[target_api]?.email}
    documentationUrl="https://api.gouv.fr/producteurs/dgfip"
  >
    <PreviousEnrollmentSection steps={steps} />
    <OrganisationSection editorList={editorList} />
    <DescriptionSection />
    <DonneesSection
      AvailableScopesDescription={DataAreInTermsOfUseDescription}
    />
    <CadreJuridiqueSection />
    <ÉquipeSection />
    <CguSection
      cguLink="/docs/cgu_api_infinoe_sandbox_v1.pdf"
      additionalTermsOfUse={additionalTermsOfUse}
    />
  </Form>
);

export default ApiInfinoeSandbox;
