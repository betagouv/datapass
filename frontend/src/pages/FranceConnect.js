import React from 'react';
import Form from '../components/templates/Form';
import OrganisationSection from '../components/organisms/form-sections/OrganisationSection';
import DescriptionSection from '../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../components/organisms/form-sections/DonneesSection';
import FranceConnectPlusSection from '../components/organisms/form-sections/FranceConnectPlusSection';
import CadreJuridiqueSection from '../components/organisms/form-sections/CadreJuridiqueSection';
import ÉquipeSection from '../components/organisms/form-sections/ÉquipeSection';
import CguSection from '../components/organisms/form-sections/CguSection';
import { DATA_PROVIDER_CONFIGURATIONS } from '../config/data-provider-configurations';
import Link from '../components/atoms/hyperTexts/Link';

const DonneesDescription = () => (
  <>
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
          href="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037611479/"
        >
          l’arrêté du 8 novembre 2018
        </Link>
        . N’oubliez pas de justifier la nécessité d’identification de la
        personne dans le champ de description de votre cas d’usage.{' '}
      </li>
      <li>
        Si vous êtes une <b>entreprise</b>, vous devez citer ici le cadre légal
        et réglementaire qui s’applique à votre entité.
      </li>
      <li>
        Si votre projet concerne un <b>service numérique en santé</b>, vous
        devez citer ici{' '}
        <Link
          inline
          newTab
          href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000045457991"
        >
          l'arrêté du 28 mars 2022{' '}
        </Link>
        . Veuillez trouver ici{' '}
        <Link
          inline
          href="https://esante.gouv.fr/sites/default/files/media_entity/documents/referentiel-didentification-electronique---usagers_0.zip"
          aria-label="Réferentiel d'identifiation électronique des usagers"
        >
          le Référentiel d'identification électronique des usagers
        </Link>
        .
      </li>
    </ul>
    <p>
      Vous trouverez plus d’informations sur{' '}
      <Link inline newTab href="https://franceconnect.gouv.fr/partenaires">
        notre page dédiée
      </Link>
      .
    </p>
  </>
);

export const availableScopes = [
  {
    value: 'family_name',
    label: 'Nom de naissance',
    groupTitle: 'Identité pivot :',
  },
  {
    value: 'given_name',
    label: 'Prénoms',
    groupTitle: 'Identité pivot :',
  },
  {
    value: 'birthdate',
    label: 'Date de naissance',
    triggerWarning: true,
    groupTitle: 'Identité pivot :',
  },
  {
    value: 'birthplace',
    label: 'Ville de naissance',
    triggerWarning: true,
    groupTitle: 'Identité pivot :',
  },
  {
    value: 'birthcountry',
    label: 'Pays de naissance',
    triggerWarning: true,
    groupTitle: 'Identité pivot :',
  },
  {
    value: 'gender',
    label: 'Sexe',
    triggerWarning: true,
    groupTitle: 'Identité pivot :',
  },
  {
    value: 'preferred_username',
    label: 'Nom d’usage',
    triggerWarning: true,
    warningType: 'fc_incomplete',
    groupTitle: 'Autres données :',
  },
  {
    value: 'email',
    label: 'Adresse électronique',
    triggerWarning: true,
    groupTitle: 'Autres données :',
  },
  {
    value: 'openid',
    label: 'Identifiant technique',
    required: true,
    helper: '"sub" de l\'utilisateur au format OpenIDConnect',
    groupTitle: 'Donnée technique :',
  },
];

const target_api = 'franceconnect';

const FranceConnect = () => (
  <Form
    target_api={target_api}
    contactEmail={DATA_PROVIDER_CONFIGURATIONS[target_api]?.email}
    documentationUrl="https://partenaires.franceconnect.gouv.fr/monprojet/cadrage"
  >
    <OrganisationSection />
    <DescriptionSection />
    <DonneesSection
      availableScopes={availableScopes}
      DonneesDescription={DonneesDescription}
    />
    <FranceConnectPlusSection />
    <CadreJuridiqueSection
      CadreJuridiqueDescription={CadreJuridiqueDescription}
    />
    <ÉquipeSection responsableTechniqueNeedsMobilePhone={true} />
    <CguSection
      cguLink="https://partenaires.franceconnect.gouv.fr/cgu"
      additionalTermsOfUse={[
        {
          id: 'has_alternative_authentication_methods',
          label: (
            <>
              J’atteste que mon service propose une alternative à la connexion
              avec FranceConnect, et que cette alternative permet l’accès, dans
              des conditions analogues, à la même prestation de service public.
            </>
          ),
        },
      ]}
    />
  </Form>
);

export default FranceConnect;
