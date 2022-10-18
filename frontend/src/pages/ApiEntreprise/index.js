import React from 'react';
import Form from '../../components/templates/Form';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import DemarcheSection from '../../components/organisms/form-sections/DemarcheSection';
import DescriptionSection from '../../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../../components/organisms/form-sections/DonneesSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import demarches from './demarches.json';
import ÉquipeSection, {
  getDefaultDelegueProtectionDonneesDescription,
  getDefaultResponsableTraitementDescription,
} from '../../components/organisms/form-sections/ÉquipeSection';
import { DATA_PROVIDER_PARAMETERS } from '../../config/data-provider-parameters';
import WarningEmoji from '../../components/atoms/icons/WarningEmoji';
import Link from '../../components/atoms/hyperTexts/Link';

const DonneesDescription = () => (
  <>
    <p>Vous pouvez vous aider :</p>
    <ul>
      <li>
        du{' '}
        <Link inline newTab href="https://entreprise.api.gouv.fr/catalogue/">
          catalogue de API
        </Link>
        . Il présente l’ensemble des API disponibles accompagnées d’une
        documentation métier et d’un accès aux spécifications techniques
        (swagger).
      </li>
      <li>
        des{' '}
        <Link inline newTab href="https://entreprise.api.gouv.fr/cas_usages">
          cas d’usage
        </Link>{' '}
        proposés par API Entreprise. Nous y décrivons les données utiles par
        contexte d'utilisation. Si votre besoin correspond à l’un de ces cas
        d’usage, vous pourrez vous appuyez sur le formulaire pré-rempli adéquat.
      </li>
    </ul>
  </>
);

// NB: this list was manually updated from https://dashboard.entreprise.api.gouv.fr/api/admin/roles
// Then edited by API Entreprise UX team
const availableScopes = [
  {
    value: 'entreprises',
    label:
      'Données des unités légales du répertoire Sirene et de leurs sièges sociaux & mandataires sociaux - Insee & Infogreffe ',
    groupTitle: 'Informations générales :',
    link: 'https://entreprise.api.gouv.fr/catalogue?Endpoint[query]=insee%20unite%20legale',
  },
  {
    value: 'etablissements',
    label: 'Données et adresse des établissements du répertoire Sirene - Insee',
    groupTitle: 'Informations générales :',
    link: 'https://entreprise.api.gouv.fr/catalogue?Endpoint[query]=insee etablissement',
  },
  {
    value: 'extraits_rcs',
    label: 'Extrait RCS - Infogreffe',
    groupTitle: 'Informations générales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/infogreffe/rcs/extrait',
  },
  {
    value: 'associations',
    label: 'Données du RNA d’une association - Ministère de l’Intérieur',
    groupTitle: 'Informations générales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/ministere_interieur/rna',
  },
  {
    value: 'documents_association',
    label: 'Divers documents d’une association - Ministère de l’Intérieur',
    groupTitle: 'Informations générales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/ministere_interieur/documents_associations',
  },
  {
    value: 'actes_inpi',
    label: 'Actes - Inpi',
    groupTitle: 'Informations générales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/inpi/actes',
  },
  {
    value: 'conventions_collectives',
    label:
      'Conventions collectives - Fabrique numérique des Ministères Sociaux',
    groupTitle: 'Informations générales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/fabrique_numerique_ministeres_sociaux/conventions_collectives',
  },
  {
    value: 'entreprises_artisanales',
    label: 'Données du RNM d’une entreprise artisanale  - CMA France',
    groupTitle: 'Informations générales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/cma_france/rnm',
  },
  {
    value: 'effectifs_acoss',
    label: '🔐 Effectif d’une entreprise - Urssaf',
    groupTitle: 'Informations générales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/urssaf/effectifs',
  },
  {
    value: 'eori_douanes',
    label: 'Immatriculation EORI - Douanes',
    groupTitle: 'Informations générales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/douanes/immatriculation_eori',
  },
  {
    value: 'exercices',
    label: '🔐 Chiffre d’affaires - DGFIP',
    groupTitle: 'Informations financières :',
    link: 'https://entreprise.api.gouv.fr/catalogue/dgfip/chiffres_affaires',
  },
  {
    value: 'bilans_inpi',
    label: 'Comptes annuels du RNCS - Inpi',
    groupTitle: 'Informations financières :',
    link: 'https://entreprise.api.gouv.fr/catalogue/inpi/comptes_annuels_rncs',
  },
  {
    value: 'bilans_entreprise_bdf',
    label: '🔐 3 derniers bilans annuels - Banque de France',
    groupTitle: 'Informations financières :',
    triggerWarning: true,
    warningType: 'apientreprise_sensitive',
    link: 'https://entreprise.api.gouv.fr/catalogue/banque_de_france/bilans',
  },
  {
    value: 'liasse_fiscale',
    label: '🔐 Liasses fiscales - DGFIP',
    groupTitle: 'Informations financières :',
    triggerWarning: true,
    warningType: 'apientreprise_sensitive',
    link: 'https://entreprise.api.gouv.fr/catalogue/dgfip/liasses_fiscales',
  },
  {
    value: 'attestations_fiscales',
    label: '🔐 Attestation fiscale - DGFIP',
    groupTitle: 'Attestations sociales et fiscales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/dgfip/attestations_fiscales',
  },
  {
    value: 'attestations_sociales',
    label: '🔐 Attestation de vigilance - Urssaf',
    groupTitle: 'Attestations sociales et fiscales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/urssaf/attestation_vigilance',
  },
  {
    value: 'msa_cotisations',
    label: '🔐 Conformité cotisations de sécurité sociale agricole - MSA',
    groupTitle: 'Attestations sociales et fiscales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/msa/conformites_cotisations',
  },
  {
    value: 'probtp',
    label: '🔐 Conformité des cotisations retraites - ProBTP',
    groupTitle: 'Attestations sociales et fiscales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/probtp/conformites_cotisations_retraite',
  },
  {
    value: 'fntp_carte_pro',
    label: 'Carte professionnelle travaux publics - FNTP',
    groupTitle: 'Attestations sociales et fiscales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/fntp/carte_professionnelle_travaux_public',
  },
  {
    value: 'certificat_cnetp',
    label:
      '🔐 Attestation de cotisations congés payés & chômage-intempéries - CNETP',
    groupTitle: 'Attestations sociales et fiscales :',
    link: 'https://entreprise.api.gouv.fr/catalogue/cnetp/attestations_cotisations_conges_payes_chomage_intemperies',
  },
  {
    value: 'certificat_agence_bio',
    label: 'Certification en BIO - Agence BIO',
    groupTitle: 'Certifications professionnelles :',
    link: 'https://entreprise.api.gouv.fr/catalogue/agence_bio/certifications_bio',
  },
  {
    value: 'certificat_rge_ademe',
    label: 'Certification RGE - ADEME',
    groupTitle: 'Certifications professionnelles :',
    link: 'https://entreprise.api.gouv.fr/catalogue/ademe/certifications_rge',
  },
  {
    value: 'qualibat',
    label: 'Certification Qualibat - Qualibat',
    groupTitle: 'Certifications professionnelles :',
    link: 'https://entreprise.api.gouv.fr/catalogue/qualibat/certifications_batiment',
  },
  {
    value: 'certificat_opqibi',
    label: 'Certification de qualification d’ingénierie - OPQIBI',
    groupTitle: 'Certifications professionnelles :',
    link: 'https://entreprise.api.gouv.fr/catalogue/opqibi/qualifications_ingenierie',
  },
  {
    value: 'extrait_court_inpi',
    label: 'Brevets, modèles et marques déposés - INPI',
    groupTitle: 'Propriété intellectuelle :',
    link: 'https://entreprise.api.gouv.fr/catalogue?Endpoint[query]=inpi%20depo',
  },
];

const editorList = [
  { name: 'Achatpublic.com', siret: '44785462100045' },
  { name: 'Achat solution', siret: '81449011600013' },
  { name: 'Actradis', siret: '50433492100021' },
  { name: 'Alpi40.fr', siret: '25400330400030' },
  { name: 'Atexo', siret: '44090956200033' },
  { name: 'Atline services', siret: '44166368900012' },
  { name: 'Avenue web systemes (AWS)', siret: '44392887400066' },
  { name: 'Axyus', siret: '43024416000072' },
  { name: 'Dematis', siret: '45072478600030' },
  { name: 'e-Attestations', siret: '50382936800045' },
  { name: "Entr'ouvert", siret: '44317013900036' },
  { name: 'GIP Maximilien', siret: '13001845000028' },
  { name: 'Klekoon', siret: '42140180300042' },
  { name: 'Mgdis', siret: '32816124500027' },
  { name: 'Provigis', siret: '43196025100061' },
  { name: 'SETEC', siret: '70200590100104' },
  { name: 'Territoires Numériques BFC', siret: '13000493000025' },
];

const CadreJuridiqueDescription = () => (
  <>
    <p>
      L’accès à l’API Entreprise se fait sous réserve que son utilisation soit
      justifiée. Chaque donnée requiert la fourniture d’un cadre juridique
      précis. Par exemple, si vous êtes une administration centrale, une agence
      d’État, un opérateur, ou un service déconcentré, il vous faudra
      transmettre le décret ou l’arrêté justifiant votre demande.
    </p>
    <p>
      <WarningEmoji /> Attention, quel que soit votre statut, le{' '}
      <Link
        inline
        newTab
        href="https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000031366350/2020-12-14/"
      >
        CRPA (Code des relations entre le public et l’administration)
      </Link>
      , la{' '}
      <Link
        inline
        newTab
        href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000037307624/"
      >
        loi ESSOC (pour un État au service d’une société de confiance)
      </Link>{' '}
      ou la loi Lemaire (pour une République numérique){' '}
      <b>ne sont pas suffisants</b> car ils indiquent un principe d’échange qui
      doit être complété par un cadre juridique précis pour l’utilisation
      envisagée.
    </p>
  </>
);

const initialContacts = {
  demandeur: {
    header: 'Demandeur',
    description: (
      <>
        <b>Le demandeur</b> est à l'origine de la demande d’habilitation, c'est
        vous. Si l’habilitation est validée, vous serez responsable de la clé
        d'accès (token) que vous pourrez copier/coller ou déléguer aux personnes
        en charge de l'implémentation technique. Vous serez contacté en cas de
        problèmes fonctionnels sur votre service. Vous serez également averti de
        l'expiration du jeton intervenant tous les 18 mois, pour vous permettre
        de renouveler votre habilitation.
      </>
    ),
    forceDisable: true,
  },
  responsable_traitement: {
    header: 'Responsable de traitement',
    description: getDefaultResponsableTraitementDescription(),
  },
  delegue_protection_donnees: {
    header: 'Délégué à la protection des données',
    description: getDefaultDelegueProtectionDonneesDescription(),
  },
  responsable_technique: {
    header: 'Contact technique',
    description: (
      <>
        <b>Le contact technique</b> est la personne en charge de l'intégration
        de l'API Entreprise et de sa maintenance dans vos systèmes
        d'information. Le contact technique sera notifié de l'ensemble des
        opérations de maintenance et des incidents. Le contact technique sera en
        copie des notifications d'expiration du jeton.
        <br />
        Afin de garantir que votre service ne soit pas interrompu, merci de
        renseigner une adresse e-mail générique ou liste de diffusion
        fonctionnelle, afin que ce contact soit permanent et peu influencé par
        les changements de poste, congés ou autres.
      </>
    ),
    displayGroupEmailLabel: true,
  },
  contact_metier: {
    header: 'Contact métier',
    description: (
      <>
        <b>Le contact métier</b> est la personne en charge des aspects
        fonctionnels de votre service, elle connaît notamment les données et les
        informations utiles pour simplifier les démarches des entreprises et des
        associations. Le contact métier sera notamment informé des nouvelles API
        disponibles. Il sera également notifié en cas d'incidents majeurs.
        <br />
        Si votre service métier a une adresse e-mail générique, n'hésitez pas à
        renseigner celle-ci.
      </>
    ),
  },
};

const target_api = 'api_entreprise';

const ApiEntreprise = () => (
  <Form
    target_api={target_api}
    demarches={demarches}
    contactEmail={DATA_PROVIDER_PARAMETERS[target_api]?.email}
    documentationUrl="https://entreprise.api.gouv.fr/"
  >
    <OrganisationSection editorList={editorList} />
    <DemarcheSection availableScopes={availableScopes} />
    <DescriptionSection />
    <DonneesSection
      availableScopes={availableScopes}
      DonneesDescription={DonneesDescription}
    />
    <CadreJuridiqueSection
      CadreJuridiqueDescription={CadreJuridiqueDescription}
    />
    <ÉquipeSection initialContacts={initialContacts} />
    <CguSection cguLink="https://entreprise.api.gouv.fr/cgu/" />
  </Form>
);

export default ApiEntreprise;
