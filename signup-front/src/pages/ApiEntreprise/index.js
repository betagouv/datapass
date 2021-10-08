import React from 'react';
import PropTypes from 'prop-types';

import Form from '../../components/templates/Form';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import DemarcheSection from '../../components/organisms/form-sections/deprecated/DemarcheSection';
import DescriptionSection from '../../components/organisms/form-sections/deprecated/DescriptionSection';
import DonneesSection from '../../components/organisms/form-sections/deprecated/DonneesSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/deprecated/CadreJuridiqueSection';
import DonneesPersonnellesSection from '../../components/organisms/form-sections/deprecated/DonneesPersonnellesSection';
import MiseEnOeuvreSection from '../../components/organisms/form-sections/deprecated/MiseEnOeuvreSection';
import CguSection from '../../components/organisms/form-sections/deprecated/CguSection';
import { sample } from 'lodash';
import demarches from './demarches.json';
import Quote from '../../components/atoms/inputs/Quote';
import WarningEmoji from '../../components/atoms/icons/WarningEmoji';
import { DATA_PROVIDER_CONTACT_EMAILS } from '../../config/data-provider-parameters';

const contacts = {
  contact_metier: {
    heading: 'Contact métier',
    description: (
      <Quote>
        <p>
          Nous contacterons cette personne pour vous avertir de nouvelles
          fonctionnalités ou d’incidents majeurs sur nos API.
        </p>
      </Quote>
    ),
    family_name: '',
    given_name: '',
    email: '',
    phone_number: '',
  },
  responsable_technique: {
    heading: 'Contact technique',
    description: (
      <Quote>
        <p>
          Nous contacterons cette personne pour vous avertir des évolutions
          techniques, des incidents et de l’expiration des jetons.
        </p>
      </Quote>
    ),
    family_name: '',
    given_name: '',
    // set a key to avoid « each key should have a unique key property »
    // error when including WarningEmoji alongside text
    emailDescription: (
      <Quote>
        <p>
          <WarningEmoji key="warning-emoji" /> Vos jetons d’accès expireront
          tous les 18 mois. Afin de garantir que votre service ne soit pas
          interrompu, merci de renseigner une adresse email générique afin que
          nous puissions vous transmettre les nouveaux jetons malgré des aléas
          de changement de poste, congés ou autre.
        </p>
      </Quote>
    ),
    email: '',
    emailPlaceholder: 'contact@nom-organisation.fr',
    phone_number: '',
  },
};

const DonneesDescription = () => (
  <Quote>
    <p>
      Sélectionner ci-dessous les API qui sont strictement nécessaires pour
      cette démarche.
    </p>
    <p>
      Vous pouvez trouver une description détaillée de chaque API sur{' '}
      <a
        href="https://entreprise.api.gouv.fr/catalogue/"
        target="_blank"
        rel="noopener noreferrer"
      >
        entreprise.api.gouv.fr
      </a>
      .
    </p>
  </Quote>
);

// NB: this list was manually updated from https://dashboard.entreprise.api.gouv.fr/api/admin/roles
// Then edited by API Entreprise UX team
const availableScopes = [
  {
    value: 'entreprises',
    label: 'Données de référence d’une entité - INSEE & Infogreffe',
    groupTitle: 'Informations générales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/#a-entreprises',
  },
  {
    value: 'etablissements',
    label: 'Données de référence d’un établissement - INSEE',
    groupTitle: 'Informations générales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/#a-etablissements',
  },
  {
    value: 'extraits_rcs',
    label: 'Extrait RCS - Infogreffe',
    groupTitle: 'Informations générales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/#a-extraits_rcs_infogreffe',
  },
  {
    value: 'associations',
    label:
      'Informations déclaratives d’une association - Ministère de l’Intérieur',
    groupTitle: 'Informations générales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/#a-associations',
  },
  {
    value: 'documents_association',
    label: 'Divers documents d’une association - Ministère de l’Intérieur',
    groupTitle: 'Informations générales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/#a-documents_associations',
  },
  {
    value: 'actes_inpi',
    label: 'Actes - INPI',
    groupTitle: 'Informations générales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/#a-actes_inpi',
  },
  {
    value: 'conventions_collectives',
    label:
      'Conventions collectives - Fabrique numérique des Ministères Sociaux',
    groupTitle: 'Informations générales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/#a-conventions_collectives',
  },
  {
    value: 'entreprises_artisanales',
    label: 'Données de référence d’une entreprise artisanale - CMA France',
    groupTitle: 'Informations générales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/#a-entreprises_artisanales_cma',
  },
  {
    value: 'effectifs_acoss',
    label: 'Effectifs d’une entreprise - ACOSS 🔐',
    groupTitle: 'Informations générales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/#a-effectifs_..._acoss_covid',
  },
  {
    value: 'eori_douanes',
    label: 'Immatriculation EORI - Douanes',
    groupTitle: 'Informations générales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/#a-eori_douanes',
  },
  {
    value: 'exercices',
    label: 'Chiffre d’affaires - DGFIP 🔐',
    groupTitle: 'Informations financières :',
    link: 'https://entreprise.api.gouv.fr/catalogue/#a-exercices',
  },
  {
    value: 'bilans_inpi',
    label: 'Bilans annuels - INPI',
    groupTitle: 'Informations financières :',
    link: 'https://entreprise.api.gouv.fr/catalogue/#a-bilans_inpi',
  },
  {
    value: 'bilans_entreprise_bdf',
    label: '3 derniers bilans annuels - Banque de France 🔐',
    groupTitle: 'Informations financières :',
    link: 'https://entreprise.api.gouv.fr/catalogue/#a-bilans_entreprises_bdf',
  },
  {
    value: 'liasse_fiscale',
    label: 'Déclarations de résultat - DGFIP 🔐',
    groupTitle: 'Informations financières :',
    link: 'https://entreprise.api.gouv.fr/catalogue/#a-liasses_fiscales_dgfip',
  },
  {
    value: 'attestations_fiscales',
    label: 'Attestation fiscale - DGFIP 🔐',
    groupTitle: 'Attestations sociales et fiscales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/#a-attestations_fiscales_dgfip',
  },
  {
    value: 'attestations_sociales',
    label: 'Attestation de vigilance - ACOSS 🔐',
    groupTitle: 'Attestations sociales et fiscales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/#a-attestations_sociales_acoss',
  },
  {
    value: 'attestations_agefiph',
    label: 'Conformité emploi des travailleurs handicapés - AGEFIPH',
    groupTitle: 'Attestations sociales et fiscales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/#a-attestations_agefiph',
  },
  {
    value: 'msa_cotisations',
    label: 'Cotisations de sécurité sociale agricole - MSA 🔐',
    groupTitle: 'Attestations sociales et fiscales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/#a-cotisations_msa',
  },
  {
    value: 'probtp',
    label: 'Cotisations retraite bâtiment - ProBTP 🔐',
    groupTitle: 'Attestations sociales et fiscales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/#a-cotisation_retraite_probtp',
  },
  {
    value: 'fntp_carte_pro',
    label: 'Carte professionnelle travaux publics - FNTP',
    groupTitle: 'Attestations sociales et fiscales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/#a-cartes_professionnelles_fntp',
  },
  {
    value: 'certificat_cnetp',
    label: 'Cotisations congés payés & chômage intempéries - CNETP 🔐',
    groupTitle: 'Attestations sociales et fiscales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/#a-certificats_cnetp',
  },
  {
    value: 'certificat_agence_bio',
    label: 'Certifications en BIO',
    groupTitle: 'Certifications professionnelles :',
    link: 'https://entreprise.api.gouv.fr/catalogue/#a-certificats_agence_bio',
  },
  {
    value: 'certificat_rge_ademe',
    label: 'Certificats RGE - ADEME',
    groupTitle: 'Certifications professionnelles :',
    link: 'https://entreprise.api.gouv.fr/catalogue/#a-certificats_rge_ademe',
  },
  {
    value: 'qualibat',
    label: 'Certification de qualification bâtiment - Qualibat',
    groupTitle: 'Certifications professionnelles :',
    link: 'https://entreprise.api.gouv.fr/catalogue/#a-certificats_qualibat',
  },
  {
    value: 'certificat_opqibi',
    label: 'Certification de qualification d’ingénierie - OPQIBI',
    groupTitle: 'Certifications professionnelles :',
    link: 'https://entreprise.api.gouv.fr/catalogue/#a-certificats_opqibi',
  },
  {
    value: 'extrait_court_inpi',
    label: 'Brevets, modèles et marques déposés - INPI',
    groupTitle: 'Propriété intellectuelle :',
    link: 'https://entreprise.api.gouv.fr/catalogue/#a-extraits_courts_inpi',
  },
];

const intitulePlaceholder = sample([
  '« Pré-remplissage du formulaire de création de compte des entreprise »',
  '« Simplification des demandes de subvention de la région »',
  '« Déclaration d’installation classée pour la protection de l’environnement »',
]);

const CadreJuridiqueDescription = () => (
  <Quote>
    <p>
      Pour en savoir plus sur les éléments à fournir pour justifier de votre
      cadre juridique, vous pouvez vous référer{' '}
      <a href="https://entreprise.api.gouv.fr/doc/#le-cadre-juridique">
        cette documentation
      </a>
      .
    </p>
  </Quote>
);

const MiseEnOeuvreDescription = () => (
  <Quote>
    <p>
      Afin de pouvoir vous contacter tout au long de votre utilisation d’API
      Entreprise, merci de renseigner vos informations de contact.
    </p>
  </Quote>
);

const ApiEntreprise = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api="api_entreprise"
    demarches={demarches}
    contactInformation={[
      {
        email: DATA_PROVIDER_CONTACT_EMAILS.api_entreprise,
        label: 'Contact mail',
        subject: 'Contact%20via%20datapass.api.gouv.fr%20-%20API%20Entreprise',
      },
      {
        tel: '07 49 88 96 01',
      },
    ]}
    documentationUrl="https://entreprise.api.gouv.fr/doc/"
  >
    <OrganisationSection />
    <DemarcheSection />
    <DescriptionSection intitulePlaceholder={intitulePlaceholder} />
    <DonneesSection
      availableScopes={availableScopes}
      DonneesDescription={DonneesDescription}
    />
    <CadreJuridiqueSection
      fondementJuridiqueTitlePlaceholder="« loi », « décret », « arrêté », etc."
      CadreJuridiqueDescription={CadreJuridiqueDescription}
    />
    <DonneesPersonnellesSection dataRetentionPeriodHelper="durée d'archivage légale liée à la démarche administrative" />
    <MiseEnOeuvreSection
      initialContacts={contacts}
      MiseEnOeuvreDescription={MiseEnOeuvreDescription}
    />
    <CguSection cguLink="https://entreprise.api.gouv.fr/cgu/" />
  </Form>
);

ApiEntreprise.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

ApiEntreprise.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default ApiEntreprise;
