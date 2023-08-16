import React from 'react';
import Form from '../../components/templates/Form';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import DescriptionSection from '../../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../../components/organisms/form-sections/DonneesSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import ÉquipeSection from '../../components/organisms/form-sections/ÉquipeSection';
import PiecesJustificativesSection from '../../components/organisms/form-sections/urssaf-sections/PiecesJustificativesSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import { CadreJuridiqueDescription } from './common';
import { DATA_PROVIDER_CONFIGURATIONS } from '../../config/data-provider-configurations';
import { getDefaultDocumentationUrl } from '../../components/organisms/Nav';

const target_api = 'api_declaration_cesu';

const scopesConfiguration = [
  {
    value: 'api_cesu050',
    label: 'Télédéclaration du salaire',
    required: true,
  },
  {
    value: 'api_cesu040',
    label: 'Obtention du montant estimé des cotisations sociales',
    required: true,
  },
  {
    value: 'api_cesu030',
    label: 'Enregistrement de mandat',
    required: true,
  },
  {
    value: 'api_cesu031',
    label: 'Annulation de mandat',
    required: true,
  },
  {
    value: 'api_cesu020',
    label: 'Vérification compte CESU PE',
    required: true,
  },
  {
    value: 'api_cesu021',
    label: 'Vérification compte CESU SP',
    required: true,
  },
  {
    value: 'api_cesu010',
    label: 'Inscription PE au régime CESU',
    required: true,
  },
];

const ApiDeclarationCesu = () => (
  <Form
    target_api={target_api}
    contactEmail={DATA_PROVIDER_CONFIGURATIONS[target_api]?.email}
    documentationUrl={getDefaultDocumentationUrl(target_api)}
  >
    <OrganisationSection />
    <DescriptionSection />
    <DonneesSection scopesConfiguration={scopesConfiguration} />
    <CadreJuridiqueSection
      CadreJuridiqueDescription={CadreJuridiqueDescription}
      defaultFondementJuridiqueTitle="articles L.133-11, R133-43 et R133-44 du Code de Sécurité sociale"
      defaultFondementJuridiqueUrl="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033686041/"
    />
    <ÉquipeSection responsableTechniqueNeedsMobilePhone={true} />
    <PiecesJustificativesSection />
    <CguSection cguLink="/docs/cgu_api_declaration_cesu_v1.pdf" />
  </Form>
);

export default ApiDeclarationCesu;
