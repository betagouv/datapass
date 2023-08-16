import React from 'react';
import Form from '../components/templates/Form';
import OrganisationSection from '../components/organisms/form-sections/OrganisationSection';
import DescriptionSection from '../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../components/organisms/form-sections/DonneesSection';
import CadreJuridiqueSection from '../components/organisms/form-sections/CadreJuridiqueSection';
import CguSection from '../components/organisms/form-sections/CguSection';
import ÉquipeSection from '../components/organisms/form-sections/ÉquipeSection';
import { DATA_PROVIDER_CONFIGURATIONS } from '../config/data-provider-configurations';
import { getDefaultDocumentationUrl } from '../components/organisms/Nav';

const scopesConfiguration = [
  {
    value: 'idnat',
    label: 'Identifiant national',
    helper: 'RPPS (ou ADELI)',
  },
  {
    value: 'donnees_sectorielles',
    label: 'Données sectorielles',
    helper: 'type d’activité (salarié ou libéral) et lieu d’activité',
  },
];

const target_api = 'api_pro_sante_connect';

const ApiProSanteConnect = () => (
  <Form
    target_api={target_api}
    contactEmail={DATA_PROVIDER_CONFIGURATIONS[target_api]?.email}
    documentationUrl={getDefaultDocumentationUrl(target_api)}
  >
    <OrganisationSection />
    <DescriptionSection />
    <DonneesSection scopesConfiguration={scopesConfiguration} />
    <CadreJuridiqueSection
      defaultFondementJuridiqueTitle="Arrêté du 24 mars 2021"
      defaultFondementJuridiqueUrl="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000043290292"
    />
    <ÉquipeSection />
    <CguSection cguLink="https://industriels.esante.gouv.fr/produits-et-services/pro-sante-connect/conditions-generale-d-utilisation-pro-sante-connect" />
  </Form>
);

export default ApiProSanteConnect;
