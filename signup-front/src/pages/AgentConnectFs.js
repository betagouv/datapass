import React from 'react';
import Form from '../components/templates/Form';
import OrganisationSection from '../components/organisms/form-sections/OrganisationSection';
import DescriptionSection from '../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../components/organisms/form-sections/DonneesSection';
import ÉquipeSection from '../components/organisms/form-sections/ÉquipeSection';
import CguSection from '../components/organisms/form-sections/CguSection';
import { DATA_PROVIDER_PARAMETERS } from '../config/data-provider-parameters';
import Link from '../components/atoms/hyperTexts/Link';
import AgentConnectNetworkSection from '../components/organisms/form-sections/AgentConnectNetworkSection';

const DonneesDescription = () => (
  <>
    <p>
      Les données nécessaire au fonctionnement d’AgentConnect se regroupent en
      deux catégories : les données obligatoires et les données facultatives. Il
      vous est possible de sélectionner les données facultatives, mais il n’est
      pas garanti que tous les fournisseurs d’identité les mettent à
      disposition.{' '}
    </p>
  </>
);

export const availableScopes = [
  {
    value: 'usual_name',
    label: 'Nom de l’agent',
    required: true,
  },
  {
    value: 'given_name',
    label: 'Prénom de l‘agent',
    required: true,
  },
  {
    value: 'mail',
    label: 'Adresse mail de l‘agent',
    required: true,
  },
  {
    value: 'uid',
    label: 'Identifiant technique',
    required: true,
    helper: 'Identifiant spécifique au fournisseur d‘identité',
  },
  {
    value: 'Siren',
    label: 'Numéro SIREN de l’organisation de rattachement',
    required: false,
  },
  {
    value: 'siret',
    label: 'Numéro SIRET de l’organisation de rattachement',
    required: false,
  },
  {
    value: 'Organizational_unit',
    label: 'Unité d’affectation',
    required: false,
    helper: 'Intitulé de la direction, du service ou du bureau de l‘agent',
  },
  {
    value: 'Belonging_population',
    label: 'Population d’appartenance',
    required: false,
    helper: 'Fonctionnaire, prestataire, contractuel, stagiaire...',
  },
  {
    value: 'phone',
    label: 'Numéro de téléphone de l‘agent',
    required: false,
  },
];

const target_api = 'agent_connect_fs';

const AgentConnectFs = () => (
  <Form
    target_api={target_api}
    contactEmail={DATA_PROVIDER_PARAMETERS[target_api]?.email}
    documentationUrl="https://api.gouv.fr/les-api/api-agentconnect"
  >
    <OrganisationSection />
    <DescriptionSection />
    <DonneesSection
      availableScopes={availableScopes}
      DonneesDescription={DonneesDescription}
    />
    <AgentConnectNetworkSection />
    <ÉquipeSection responsableTechniqueNeedsMobilePhone={true} />
    <CguSection
      cguLink="https://partenaires.agentconnect.gouv.fr/cgu"
      additionalTermsOfUse={[
        {
          id: 'has_alternative_authentication_methods',
          label: (
            <>
              J’atteste que mon service propose une alternative à la connexion
              avec AgentConnect, et que cette alternative permet l’accès, dans
              des conditions analogues, au même service.
            </>
          ),
        },
        {
          id: 'authorize_access_to_identity_providers',
          label: (
            <>
              J’autorise tous les fournisseurs d’identité à accéder à mon
              service après avoir pris connaissance de leur politique de
              sécurité figurant{' '}
              <a href="https://partenaires.agentconnect.gouv.fr/cgu">ici</a>.
            </>
          ),
        },
      ]}
    />
  </Form>
);

export default AgentConnectFs;
