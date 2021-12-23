import React from 'react';
import Form from '../components/templates/Form';
import OrganisationSection from '../components/organisms/form-sections/OrganisationSection';
import DescriptionSection from '../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../components/organisms/form-sections/DonneesSection';
import FranceConnectPlusSection from '../components/organisms/form-sections/FranceConnectPlusSection';
import CadreJuridiqueSection from '../components/organisms/form-sections/CadreJuridiqueSection';
import ÉquipeSection from '../components/organisms/form-sections/ÉquipeSection';
import CguSection from '../components/organisms/form-sections/CguSection';
import { DATA_PROVIDER_CONTACT_EMAILS } from '../config/data-provider-parameters';

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
        <a
          href="https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000037611479&categorieLien=id"
          target="_blank"
          rel="noopener noreferrer"
        >
          l’arrêté du 8 novembre 2018
        </a>
        . N’oubliez pas de justifier la nécessité d’identification de la
        personne dans le champs de description de votre cas d’usage.{' '}
      </li>
      <li>
        Si vous êtes une <b>entreprise</b>, vous devez citer le cadre légal et
        réglementaire qui s’applique à votre entité. Vous trouverez plus
        d’information sur{' '}
        <a
          href="https://franceconnect.gouv.fr/partenaires"
          target="_blank"
          rel="noopener noreferrer"
        >
          notre page dédiée
        </a>
        .
      </li>
    </ul>
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

const FranceConnect = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api="franceconnect"
    contactEmail={DATA_PROVIDER_CONTACT_EMAILS.franceconnect}
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
