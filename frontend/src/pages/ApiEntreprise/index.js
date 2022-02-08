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
          catalogue de données
        </Link>
        . Il présente l’ensemble des API disponibles accompagnées d’une
        documentation fonctionnelle et technique.
      </li>
      <li>
        des{' '}
        <Link inline newTab href="https://entreprise.api.gouv.fr/cas_usage/">
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
    triggerWarning: true,
    warningType: 'apientreprise_sensitive',
    link: 'https://entreprise.api.gouv.fr/catalogue/#a-bilans_entreprises_bdf',
  },
  {
    value: 'liasse_fiscale',
    label: 'Déclarations de résultat - DGFIP 🔐',
    groupTitle: 'Informations financières :',
    triggerWarning: true,
    warningType: 'apientreprise_sensitive',
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
        <b>Le demandeur</b> est à l'origine de la demande d'habilitation, c'est
        vous. Si la demande est validée, vous serez responsable de la clé
        d'accès (token) que vous pourrez copier/coller ou déléguer aux personnes
        en charge de l'implémentation technique. Vous serez contacté en cas de
        problèmes fonctionnels sur votre service. Vous serez également averti de
        l'expiration du jeton intervenant tous les 18 mois, pour vous permettre
        de renouveler votre demande.
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
    documentationUrl="https://entreprise.api.gouv.fr/doc/"
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
