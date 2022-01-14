import React from 'react';
import Form from '../components/templates/Form';
import OrganisationSection from '../components/organisms/form-sections/OrganisationSection';
import DescriptionSection from '../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../components/organisms/form-sections/DonneesSection';
import CadreJuridiqueSection from '../components/organisms/form-sections/CadreJuridiqueSection';
import ÉquipeSection from '../components/organisms/form-sections/ÉquipeSection';
import CguSection from '../components/organisms/form-sections/CguSection';
import { DATA_PROVIDER_PARAMETERS } from '../config/data-provider-parameters';
import Link from '../components/atoms/hyperTexts/Link';
import AgentConnectNetworkSection from '../components/organisms/form-sections/AgentConnectNetworkSection';

const DonneesDescription = () => (
  <>
    <p>À COMPLETER</p>
    <p>
      Nous vous remercions de sélectionner uniquement les données strictement
      nécessaires à votre téléservice. Le non-respect du principe de
      proportionnalité vous expose vis-à-vis de la CNIL.
    </p>
    <p>
      Le nom d‘usage n’existant pas toujours, vous devez obligatoirement
      sélectionner le nom de naissance si vous sélectionnez le nom d’usage.
    </p>
  </>
);

const CadreJuridiqueDescription = () => (
  <>
    <p>À COMPLETER</p>
    <p>
      Pour pouvoir bénéficier du raccordement à FranceConnect, le cadre légal et
      réglementaire qui s’applique à votre entité (administration ou entreprise)
      doit permettre à la DINUM de lui transmettre des données d’identité.
    </p>
    <ul>
      <li>
        Si vous êtes une <b>administration</b>, vous pouvez citer ici{' '}
        <Link
          inline
          newTab
          href="https://www.gouvernement.fr/sites/default/files/contenu/piece-jointe/2021/06/20210618_decision_dinum.pdf"
        >
          la décision du 18 juin 2021
        </Link>
        . N’oubliez pas de justifier la nécessité d’identification de la
        personne dans le champs de description de votre cas d’usage.{' '}
      </li>
      <li>
        Si vous êtes une <b>entreprise</b>, vous devez citer le cadre légal et
        réglementaire qui s’applique à votre entité. Vous trouverez plus
        d’information sur{' '}
        <Link inline newTab href="https://franceconnect.gouv.fr/partenaires">
          notre page dédiée
        </Link>
        .
      </li>
    </ul>
  </>
);

export const availableScopes = [
  {
    value: 'family_name',
    label: 'Nom de l’agent',
    required: true,
  },
  {
    value: 'family_name',
    label: 'À COMPLETER',
    required: true,
  },
  {
    value: 'siret',
    label: 'Numéro SIRET de l’organisation de rattachement',
  },
];

const target_api = 'agent_connect_fs';

const AgentConnectFs = () => (
  <Form
    target_api={target_api}
    contactEmail={DATA_PROVIDER_PARAMETERS[target_api]?.email}
    documentationUrl="À COMPLETER"
  >
    <OrganisationSection />
    <DescriptionSection />
    <DonneesSection
      availableScopes={availableScopes}
      DonneesDescription={DonneesDescription}
      accessModes={[
        {
          id: 'access_rie',
          label: 'RIE',
        },
        {
          id: 'access_internet',
          label: 'Internet',
        },
      ]}
    />
    <AgentConnectNetworkSection />
    <CadreJuridiqueSection
      CadreJuridiqueDescription={CadreJuridiqueDescription}
    />
    <ÉquipeSection responsableTechniqueNeedsMobilePhone={true} />
    <CguSection
      cguLink="À COMPLETER"
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
              sécurité figurant <a href="À COMPLETER">ici</a>.
            </>
          ),
        },
      ]}
    />
  </Form>
);

export default AgentConnectFs;
