import React from 'react';
import PropTypes from 'prop-types';

import Form from '../components/templates/Form';
import OrganisationSection from '../components/organisms/form-sections/OrganisationSection';
import DescriptionSection from '../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../components/organisms/form-sections/DonneesSection';
import CadreJuridiqueSection from '../components/organisms/form-sections/CadreJuridiqueSection';
import CguSection from '../components/organisms/form-sections/CguSection';
import ÉquipeSection from '../components/organisms/form-sections/ÉquipeSection';
import { DATA_PROVIDER_CONTACT_EMAILS } from '../config/data-provider-parameters';
import DemarcheSection from '../components/organisms/form-sections/DemarcheSection';

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
    mandatory: true,
  },
  {
    value: 'hails_management',
    label: 'API gestion des appels',
    mandatory: true,
  },
];

const editorList = [
  { name: 'Axygest', siret: '33244373800056' },
  { name: 'Tessa', siret: '48767850000017' },
  { name: 'Appsolu', siret: '75213617600019' },
];

const target_api = 'le_taxi';

const LeTaxi = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api={target_api}
    demarches={demarches}
    contactInformation={[
      {
        email: DATA_PROVIDER_CONTACT_EMAILS[target_api],
        label: 'Nous contacter',
        subject: 'Contact%20via%20datapass.api.gouv.fr',
      },
    ]}
  >
    <OrganisationSection editorList={editorList} />
    <DemarcheSection />
    <DescriptionSection />
    <DonneesSection availableScopes={availableScopes} />
    <CadreJuridiqueSection />
    <ÉquipeSection />
    <CguSection cguLink="https://le.taxi/assets/documents/CGU.pdf" />
  </Form>
);

LeTaxi.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

LeTaxi.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default LeTaxi;
