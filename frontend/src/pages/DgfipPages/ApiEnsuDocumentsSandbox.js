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

const target_api = 'api_ensu_documents_sandbox';
const steps = [target_api, 'api_ensu_documents_production'];

const ApiEnsuDocumentsSandbox = () => (
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
      cguLink="/docs/cgu_pcr_v1/cgu_api_ensu_documents_bas.pdf"
      additionalTermsOfUse={additionalTermsOfUse}
    />
  </Form>
);

export default ApiEnsuDocumentsSandbox;
