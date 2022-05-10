import React from 'react';
import Form from '../components/templates/Form';
import OrganisationSection from '../components/organisms/form-sections/OrganisationSection';
import DescriptionSection from '../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../components/organisms/form-sections/DonneesSection';
import CadreJuridiqueSection from '../components/organisms/form-sections/CadreJuridiqueSection';
import CguSection from '../components/organisms/form-sections/CguSection';
import ÉquipeSection from '../components/organisms/form-sections/ÉquipeSection';
import { DATA_PROVIDER_PARAMETERS } from '../config/data-provider-parameters';
import { getDefaultDocumentationUrl } from '../components/organisms/Nav';
import AgentConnectNetworkSection from '../components/organisms/form-sections/AgentConnectNetworkSection';

const availableScopes = [
  {
    value: 'usual_name',
    label: 'Nom de l‘agent',
    required: true,
  },
  {
    value: 'given_name',
    label: 'Prénom',
    required: true,
  },
  {
    value: 'email',
    label: 'Adresse électronique professionnelle de l’agent',
    required: true,
  },
  {
    value: 'uid',
    label: 'Identifiant technique',
    required: true,
    helper: '« sub » de l’utilisateur au format OpenIDConnect',
  },
  {
    value: 'phone',
    label: 'Numéro de téléphone professionnel de l’agent',
    required: false,
  },
  {
    value: 'Siren',
    label: 'Numéro SIREN de l’organisation de rattachement',
    required: false,
  },
  {
    value: 'Siret',
    label: 'Numéro SIRET de l’organisation de rattachement',
    required: false,
  },
  {
    value: 'Organizational_unit',
    label: 'Unité d’affectation de l’agent',
    required: false,
  },
  {
    value: 'Belonging_population',
    label: 'Population d’appartenance de l’agent',
    required: false,
    helper: 'Agent fonctionnaire, agent contractuel, prestataire, stagiaire, …',
  },
  {
    value: 'chorus_uid',
    label: 'Identifiant unique créé par l’application ChorusDT',
    required: false,
  },
];

const target_api = 'agent-connect-fi';

const AgentConnectFi = () => (
  <Form
    target_api={target_api}
    contactEmail={DATA_PROVIDER_PARAMETERS[target_api]?.email}
    documentationUrl={getDefaultDocumentationUrl(target_api)}
  >
    <OrganisationSection />
    <DescriptionSection />
    <DonneesSection availableScopes={availableScopes} />
    <AgentConnectNetworkSection />
    <CadreJuridiqueSection
      defaultFondementJuridiqueTitle="Arrêté du 24 mars 2021"
      defaultFondementJuridiqueUrl="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000043290292"
    />
    <ÉquipeSection />
    <CguSection
      cguLink="/docs/cgu_agentconnect_fi.pdf"
      additionalTermsOfUse={[
        {
          id: 'authorize_access_to_service_providers',
          label: (
            <>
              J’autorise tous les fournisseurs de services de la fonction
              publique d’État (administrations centrales et services
              déconcentrés) et tous les fournisseurs de services des opérateurs
              de l’État à utiliser les données transmises par AgentConnect pour
              procéder à l’authentification de leurs agents utilisateurs.
            </>
          ),
        },
      ]}
    />
  </Form>
);

export default AgentConnectFi;
