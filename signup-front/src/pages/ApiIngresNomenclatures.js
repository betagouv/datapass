import React from 'react';
import Form from '../components/templates/Form';
import OrganisationSection from '../components/organisms/form-sections/OrganisationSection';
import DescriptionSection from '../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../components/organisms/form-sections/DonneesSection';
import CadreJuridiqueSection from '../components/organisms/form-sections/CadreJuridiqueSection';
import CguSection from '../components/organisms/form-sections/CguSection';
import ÉquipeSection from '../components/organisms/form-sections/ÉquipeSection';
import { DATA_PROVIDER_CONTACT_EMAILS } from '../config/data-provider-parameters';
import { getDefaultDocumentationUrl } from '../components/organisms/Nav';

const DonneesDescription = () => (
  <>
    <p>
      La loi informatique et libertés définit les principes à respecter lors de
      la collecte, du traitement et de la conservation de données personnelles.
    </p>
    <p>L’article 6 précise :</p>
    <ul>
      <li>
        3° [les données] sont adéquates, pertinentes et non excessives au regard
        des finalités pour lesquelles elles sont collectées et de leurs
        traitements ultérieurs ;
      </li>
      <li>
        4° Elles sont exactes, complètes et, si nécessaire, mises à jour ; les
        mesures appropriées doivent être prises pour que les données inexactes
        ou incomplètes au regard des finalités pour lesquelles elles sont
        collectées ou traitées soient effacées ou rectifiées ;
      </li>
    </ul>
    <p>
      Nous vous remercions de sélectionner uniquement les données strictement
      nécessaires à votre téléservice. Le non-respect du principe de
      proportionnalité vous expose vis-à-vis de la CNIL.
    </p>
  </>
);

const CadreJuridiqueDescription = () => (
  <>
    <p>
      Pour pouvoir bénéficier du raccordement à l’API INGRES Nomenclatures, le
      cadre légal et réglementaire des fournisseurs de service doit permettre au
      CISIRH de transmettre des données personnelles à votre entité
      administrative.
    </p>
  </>
);

const availableScopes = [
  {
    value: 'donnees_ingres_nomenclatures',
    label: 'Ensemble des données INGRES Nomenclatures',
    required: true,
  },
];

const target_api = 'api_ingres_nomenclatures';

const ApiIngresNomenclatures = () => (
  <Form
    target_api={target_api}
    contactEmail={DATA_PROVIDER_CONTACT_EMAILS.cisirh}
    documentationUrl={getDefaultDocumentationUrl(target_api)}
  >
    <OrganisationSection />
    <DescriptionSection />
    <DonneesSection
      availableScopes={availableScopes}
      DonneesDescription={DonneesDescription}
    />
    <CadreJuridiqueSection
      CadreJuridiqueDescription={CadreJuridiqueDescription}
    />
    <ÉquipeSection />
    <CguSection cguLink="/docs/cgu_api_ingres_nomenclatures_v0.3.pdf" />
  </Form>
);

export default ApiIngresNomenclatures;
