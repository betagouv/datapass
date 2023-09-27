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

export const scopesConfiguration = [
  {
    value: 'uid',
    label: 'Identifiant technique',
    required: true,
    helper: '« sub » de l’utilisateur au format OpenIDConnect',
  },
  {
    value: 'usual_name',
    label: 'Nom de l’agent',
    required: true,
  },
  {
    value: 'given_name',
    label: 'Prénom de l’agent',
    required: true,
  },
  {
    value: 'email',
    label: 'Adresse électronique professionnelle de l’agent',
    required: true,
  },
  {
    value: 'phone',
    label: 'Numéro de téléphone professionnel de l’agent',
    required: false,
  },
  {
    value: 'siret',
    label: 'Numéro SIRET de l’organisation de rattachement',
    required: false,
  },
];

const target_api = 'agent_connect_fi';

const AgentConnectFi = () => (
  <Form
    target_api={target_api}
    contactEmail={DATA_PROVIDER_CONFIGURATIONS[target_api]?.email}
    documentationUrl="https://api.gouv.fr/api-agent-connect"
  >
    <OrganisationSection />
    <DescriptionSection />
    <DonneesSection
      donneesTitle="Quelles données souhaitez vous mettre à disposition ?"
      scopesConfiguration={scopesConfiguration}
    />
    <AgentConnectNetworkSection />
    <CadreJuridiqueSection
      defaultFondementJuridiqueTitle="La décision n°DINUM-202106-01 du 1er juin 2021"
      defaultFondementJuridiqueUrl="https://www.gouvernement.fr/sites/default/files/contenu/piece-jointe/2021/05/20210601-dinum-ac-creation_agentconnect-vf.pdf"
    />
    <ÉquipeSection responsableTechniqueNeedsMobilePhone={true} />
    <CguSection
      cguLink="/docs/cgu_agentconnect_fi.pdf"
      additionalTermsOfUse={[
        {
          id: 'authorize_access_to_service_providers',
          label: (
            <>
              J’autorise tous les fournisseurs de services de la fonction
              publique à utiliser les données transmises par AgentConnect pour
              procéder à l’authentification de leurs agents utilisateurs.
            </>
          ),
        },
      ]}
    />
  </Form>
);

export default AgentConnectFi;
