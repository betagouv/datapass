import React from 'react';
import Form from '../components/templates/Form';
import OrganisationSection from '../components/organisms/form-sections/OrganisationSection';
import DescriptionSection from '../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../components/organisms/form-sections/DonneesSection';
import CadreJuridiqueSection from '../components/organisms/form-sections/CadreJuridiqueSection';
import CguSection from '../components/organisms/form-sections/CguSection';
import ÉquipeSection from '../components/organisms/form-sections/ÉquipeSection';
import { DATA_PROVIDER_CONTACT_EMAILS } from '../config/data-provider-parameters';
import DemarcheSection from '../components/organisms/form-sections/DemarcheSection';
import { getDefaultDocumentationUrl } from '../components/organisms/Nav';

const demarches = {
  default: {
    label: 'Demande Libre',
    state: {
      fondement_juridique_title:
        'articles L. 3121-11-1 et R3121-24 à R3121-33 du Code des transports',
      fondement_juridique_url:
        'https://www.legifrance.gouv.fr/affichCodeArticle.do?idArticle=LEGIARTI000029528684&cidTexte=LEGITEXT000023086525;https://www.legifrance.gouv.fr/affichCode.do?idSectionTA=LEGISCTA000032278146&cidTexte=LEGITEXT000023086525',
    },
  },
  applicatif_chauffeur: {
    label:
      'Applicatif chauffeur (groupement, centrale, application pour indépendants, …)',
    state: {},
  },
  applicatif_client: {
    label:
      'Applicatif client (moteur de recherche de taxis, application multimodale, …)',
    state: {},
  },
  les_deux: {
    label: 'Applicatif chauffeur et applicatif client (groupement, …)',
    state: {},
  },
};

const availableScopes = [
  {
    value: 'taxis_management',
    label: 'API gestion des taxis',
    required: true,
  },
  {
    value: 'hails_management',
    label: 'API gestion des appels',
    required: true,
  },
];

const editorList = [
  { name: 'Axygest', siret: '33244373800056' },
  { name: 'Tessa', siret: '48767850000017' },
  { name: 'Appsolu', siret: '75213617600019' },
];

const target_api = 'le_taxi';

const LeTaxi = () => (
  <Form
    target_api={target_api}
    demarches={demarches}
    contactEmail={DATA_PROVIDER_CONTACT_EMAILS[target_api]}
    documentationUrl={getDefaultDocumentationUrl(target_api)}
  >
    <OrganisationSection editorList={editorList} />
    <DemarcheSection availableScopes={availableScopes} />
    <DescriptionSection />
    <DonneesSection availableScopes={availableScopes} />
    <CadreJuridiqueSection />
    <ÉquipeSection />
    <CguSection cguLink="https://le.taxi/assets/documents/CGU.pdf" />
  </Form>
);

export default LeTaxi;
