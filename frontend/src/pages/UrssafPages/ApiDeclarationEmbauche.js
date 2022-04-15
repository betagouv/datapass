import React from 'react';
import Form from '../../components/templates/Form';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import { DATA_PROVIDER_PARAMETERS } from '../../config/data-provider-parameters';
import { getDefaultDocumentationUrl } from '../../components/organisms/Nav';
import ÉquipeInitializerSection from '../../components/organisms/form-sections/ÉquipeSection/ÉquipeInitializerSection';

const target_api = 'api_declaration_embauche';

const ApiDeclarationEmbauche = () => (
  <Form
    target_api={target_api}
    contactEmail={DATA_PROVIDER_PARAMETERS[target_api]?.email}
    documentationUrl={getDefaultDocumentationUrl(target_api)}
  >
    <OrganisationSection />
    <ÉquipeInitializerSection />
  </Form>
);

export default ApiDeclarationEmbauche;
