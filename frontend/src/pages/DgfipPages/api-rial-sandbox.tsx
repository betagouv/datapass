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
import ApiRialDocumentationAlert from '../../components/molecules/ApiRialDocumentationAlert';

const target_api = 'api_rial_sandbox';
const steps = [target_api, 'api_rial_production'];

const ApiRialSandbox = () => (
  <Form
    target_api={target_api}
    contactEmail={DATA_PROVIDER_CONFIGURATIONS[target_api]?.email}
    documentationUrl="https://api.gouv.fr/producteurs/dgfip"
  >
    <PreviousEnrollmentSection steps={steps} />
    <OrganisationSection />
    <DescriptionSection />
    <DonneesSection
      // A retirer ou modifier selon les besoins
      ScopesDescription={DataAreInTermsOfUseDescription}
      // Texte dans le composant ApiRialDocumentationAlert à modifier selon les besoins
      DonneesDocumentation={ApiRialDocumentationAlert}
    />
    <CadreJuridiqueSection />
    <ÉquipeSection />
    <CguSection
      // A completer et corriger une fois que le lien sera disponible"
      cguLink="/docs/cgu_bas_api_rial_v2024_11.pdf"
      additionalTermsOfUse={additionalTermsOfUse}
    />
  </Form>
);

export default ApiRialSandbox;
