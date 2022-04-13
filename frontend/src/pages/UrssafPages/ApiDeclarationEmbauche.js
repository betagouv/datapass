import React from 'react';
import Form from '../../components/templates/Form';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';

const target_api = 'api_declaration_embauche';

const ApiDeclarationEmbauche = () => (
  <Form
    target_api={target_api}
    contactEmail={DATA_PROVIDER_PARAMETERS[target_api]?.email}
    documentationUrl={getDefaultDocumentationUrl(target_api)}
  >
    <OrganisationSection />
  </Form>
);

export default ApiDeclarationEmbauche;
