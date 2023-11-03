import React from 'react';
import AgentConnectNetworkSection from '../components/organisms/form-sections/AgentConnectNetworkSection';
import CadreJuridiqueSection from '../components/organisms/form-sections/CadreJuridiqueSection';
import CguSection from '../components/organisms/form-sections/CguSection';
import DescriptionSection from '../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../components/organisms/form-sections/DonneesSection';
import OrganisationSection from '../components/organisms/form-sections/OrganisationSection';
import ÉquipeSection from '../components/organisms/form-sections/ÉquipeSection';
import Form from '../components/templates/Form';
import { DATA_PROVIDER_CONFIGURATIONS } from '../config/data-provider-configurations';

const target_api = 'agent_connect_fs';

export const scopesConfiguration = [
  {
    value: 'openid',
    label: 'OpenID',
    required: true,
  },
  {
    value: 'usual_name',
    label: 'Nom de l’agent',
    required: false,
  },
  {
    value: 'given_name',
    label: 'Prénom de l’agent',
    required: false,
  },
  {
    value: 'email',
    label: 'Adresse électronique professionnelle de l’agent',
    required: false,
  },
  {
    value: 'siret',
    label: 'Numéro SIRET de l’organisation de rattachement',
    required: false,
  },
];

const AgentConnectFs = () => (
  <Form
    target_api={target_api}
    contactEmail={DATA_PROVIDER_CONFIGURATIONS[target_api]?.email}
    documentationUrl="https://api.gouv.fr/api-agent-connect"
  >
    <OrganisationSection />
    <DescriptionSection />
    <DonneesSection scopesConfiguration={scopesConfiguration} />
    <AgentConnectNetworkSection />
    <CadreJuridiqueSection
      defaultFondementJuridiqueTitle="La décision n°DINUM-202106-01 du 1er juin 2021"
      defaultFondementJuridiqueUrl="https://www.gouvernement.fr/sites/default/files/contenu/piece-jointe/2021/05/20210601-dinum-ac-creation_agentconnect-vf.pdf"
    />
    <ÉquipeSection />
    <CguSection cguLink="/docs/cgu_agentconnect_fs.pdf" />
  </Form>
);

export default AgentConnectFs;
