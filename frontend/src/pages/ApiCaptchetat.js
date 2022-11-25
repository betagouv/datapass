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

const DonneesDescription = () => (
  <>
    <p>
      Pour fonctionner, cette API utilise un ensemble de données (structure
      HTML, images, sons, chaînes de caractères). Il est ici sélectionné par
      défaut.
    </p>
  </>
);

const CadreJuridiqueDescription = () => (
  <>
    <p>
      Pour pouvoir bénéficier du raccordement à l’API CaptchEtat, vous devez
      être une administration publique.
    </p>
  </>
);

const scopesConfiguration = [
  {
    value: 'ensemble_donnees_captchetat',
    label: 'Ensemble des données CaptchEtat',
    required: true,
  },
];

const target_api = 'api_captchetat';

const ApiCaptchetat = () => (
  <Form
    target_api={target_api}
    contactEmail={DATA_PROVIDER_CONFIGURATIONS[target_api]?.email}
    documentationUrl={getDefaultDocumentationUrl(target_api)}
  >
    <OrganisationSection />
    <DescriptionSection />
    <DonneesSection
      scopesConfiguration={scopesConfiguration}
      DonneesDescription={DonneesDescription}
    />
    <CadreJuridiqueSection
      CadreJuridiqueDescription={CadreJuridiqueDescription}
    />
    <ÉquipeSection />
    <CguSection cguLink="/docs/cgu_api_captchetat.pdf" />
  </Form>
);

export default ApiCaptchetat;
