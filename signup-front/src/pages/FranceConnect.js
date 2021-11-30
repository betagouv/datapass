import React from 'react';
import PropTypes from 'prop-types';

import Form from '../components/templates/Form';
import OrganisationSection from '../components/organisms/form-sections/OrganisationSection';
import DescriptionSection from '../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../components/organisms/form-sections/DonneesSection';
import FranceConnectPlusSection from '../components/organisms/form-sections/FranceConnectPlusSection';
import CadreJuridiqueSection from '../components/organisms/form-sections/CadreJuridiqueSection';
import ÉquipeSection from '../components/organisms/form-sections/ÉquipeSection';
import CguSection from '../components/organisms/form-sections/CguSection';
import HasNextEnrollmentsNotification from '../components/templates/Form/HasNextEnrollmentsNotification';
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
    mandatory: true,
    comment: '"sub" de l\'utilisateur au format OpenIDConnect',
    groupTitle: 'Donnée technique :',
  },
];

const editorList = [
  { siret: 'Operis / GNAU', name: 'Operis / GNAU' },
  { siret: 'Netads/Copler', name: 'Netads/Copler' },
  { siret: 'Berger Levrault', name: 'Berger Levrault' },
  { siret: 'Docapost Localeo', name: 'Docapost Localeo' },
  { siret: 'Entr’ouvert / Publik', name: 'Entr’ouvert / Publik' },
  { siret: 'MGDIS', name: 'MGDIS' },
  { siret: 'spl-xdemat', name: 'spl-xdemat' },
  { siret: 'Arpège', name: 'Arpège' },
  { siret: '32682006500083', name: 'Sopra Steria' },
  { siret: '80337757100036', name: 'Cap Collectif' },
  { siret: '30516304000119', name: 'Ciril GROUP' },
  { siret: 'Octopus', name: 'Octopus' },
  { siret: 'AMRF Docapost Localeo', name: 'AMRF Docapost Localeo' },
  { siret: 'Polyconseil', name: 'Polyconseil' },
  { siret: 'Un zéro Un', name: 'Un zéro Un' },
  { siret: 'Numesia', name: 'Numesia' },
  { siret: 'NetAds', name: 'NetAds' },
  { siret: 'Berger-Levrault', name: 'Berger-Levrault' },
  { siret: 'Operis', name: 'Operis' },
  { siret: 'jway', name: 'jway' },
  { siret: 'Citopia', name: 'Citopia' },
  { siret: 'Lanteas', name: 'Lanteas' },
  { siret: 'Ypok / Ygrc', name: 'Ypok / Ygrc' },
  { siret: '6tzen', name: '6tzen' },
  { siret: 'Eridanis', name: 'Eridanis' },
  { siret: 'Inovagora', name: 'Inovagora' },
  { siret: 'Ypok', name: 'Ypok' },
  { siret: 'Telmedia', name: 'Telmedia' },
  { siret: 'Saiga', name: 'Saiga' },
  { siret: 'Webgam', name: 'Webgam' },
  { siret: 'CitizenLab', name: 'CitizenLab' },
  { siret: 'Acheteza', name: 'Acheteza' },
  { siret: 'Xapiema', name: 'Xapiema' },
];

const FranceConnect = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api="franceconnect"
    contactInformation={[
      {
        email: DATA_PROVIDER_CONTACT_EMAILS.franceconnect,
        label: 'Nous contacter',
        subject: 'Contact%20via%20datapass.api.gouv.fr',
      },
    ]}
    documentationUrl="https://partenaires.franceconnect.gouv.fr/monprojet/cadrage"
  >
    <HasNextEnrollmentsNotification enrollmentId={enrollmentId} />
    <OrganisationSection editorList={editorList} />
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

FranceConnect.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

FranceConnect.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default FranceConnect;
