import React from 'react';
import Form from '../../components/templates/Form';
import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import RecetteFonctionnelleSection from '../../components/organisms/form-sections/dgfip-sections/RecetteFonctionnelleSection';
import VolumetrieSection from '../../components/organisms/form-sections/dgfip-sections/VolumetrieSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import ÉquipeInitializerSection from '../../components/organisms/form-sections/ÉquipeSection/ÉquipeInitializerSection';
import { DATA_PROVIDER_CONFIGURATIONS } from '../../config/data-provider-configurations';
import PreviousEnrollmentSection from '../../components/organisms/form-sections/PreviousEnrollmentSection';

const target_api = 'api_infinoe_production';
const steps = ['api_infinoe_sandbox', target_api];

const cadre_juridique = {
  default: {
    fondement_juridique_title:
      'Décret n°2012-1246 du 7 novembre 2012 relatif à la gestion budgétaire et comptable publique',
    fondement_juridique_url:
      'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000026597003/',
  },
};

const ApiInfinoeProduction = () => (
  <Form
    target_api={target_api}
    contactEmail={DATA_PROVIDER_CONFIGURATIONS[target_api]?.email}
    documentationUrl="https://api.gouv.fr/producteurs/dgfip"
  >
    <ÉquipeInitializerSection />
    <PreviousEnrollmentSection steps={steps} />
    <RecetteFonctionnelleSection />
    <CadreJuridiqueSection
      defaultFondementJuridiqueTitle={
        cadre_juridique.default.fondement_juridique_title
      }
      defaultFondementJuridiqueUrl={
        cadre_juridique.default.fondement_juridique_url
      }
    />
    <VolumetrieSection options={[200, 500, 1000]} />
    <CguSection cguLink="/docs/cgu_infinoe_production_v_2023_10.pdf" />
  </Form>
);

export default ApiInfinoeProduction;
