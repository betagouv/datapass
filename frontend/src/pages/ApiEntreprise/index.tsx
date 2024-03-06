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
import { DATA_PROVIDER_CONFIGURATIONS } from '../../config/data-provider-configurations';
import WarningEmoji from '../../components/atoms/icons/WarningEmoji';
import Link from '../../components/atoms/hyperTexts/Link';
import { ScopeWarningModalType } from '../../config/scope-warning-modal-configuration';

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
const scopesConfiguration = [
  {
    value: 'unites_legales_etablissements_insee',
    label:
      'Données unités légales et établissements du répertoire Sirene - Insee (y compris les données non-diffusibles)',
    link: 'https://entreprise.api.gouv.fr/catalogue?APIEntreprise_Endpoint%5Bquery%5D=insee',
  },
  {
    value: 'associations_djepva',
    label: 'Données associations - DJEPVA',
    link: 'https://entreprise.api.gouv.fr/catalogue/djepva/associations',
  },
  {
    value: 'effectifs_urssaf',
    label: 'Effectifs - GIP-MDS',
    link: 'https://entreprise.api.gouv.fr/catalogue/?APIEntreprise_Endpoint%5Bquery%5D=effectif%20gip',
    triggerWarning: true,
    warningType: ScopeWarningModalType.apientreprise_sensitive_effectifs,
  },
  {
    value: 'mandataires_sociaux_infogreffe',
    label: 'Mandataires sociaux - Infogreffe',
    link: 'https://entreprise.api.gouv.fr/catalogue/infogreffe/mandataires_sociaux',
    triggerWarning: true,
    warningType: ScopeWarningModalType.apientreprise_sensitive_mandataires,
  },
  {
    value: 'chiffre_affaires_dgfip',
    label: 'Chiffre d’affaires - DGFIP',
    link: 'https://entreprise.api.gouv.fr/catalogue/dgfip/chiffres_affaires',
  },
  {
    value: 'bilans_bdf',
    label: '3 derniers bilans annuels - Banque de France',
    triggerWarning: true,
    warningType: ScopeWarningModalType.apientreprise_sensitive,
    link: 'https://entreprise.api.gouv.fr/catalogue/banque_de_france/bilans',
  },
  {
    value: 'liasses_fiscales_dgfip',
    label: 'Liasses fiscales - DGFIP',
    triggerWarning: true,
    warningType: ScopeWarningModalType.apientreprise_sensitive,
    link: 'https://entreprise.api.gouv.fr/catalogue/dgfip/liasses_fiscales',
  },
  {
    value: 'attestation_fiscale_dgfip',
    label: 'Attestation fiscale - DGFIP',
    link: 'https://entreprise.api.gouv.fr/catalogue/dgfip/attestations_fiscales',
  },
  {
    value: 'attestation_sociale_urssaf',
    label: 'Attestation de vigilance - Urssaf',
    link: 'https://entreprise.api.gouv.fr/catalogue/urssaf/attestation_vigilance',
  },
  {
    value: 'cotisations_msa',
    label: 'Conformité cotisations de sécurité sociale agricole - MSA',
    link: 'https://entreprise.api.gouv.fr/catalogue/msa/conformites_cotisations',
  },
  {
    value: 'cotisations_probtp',
    label: 'Conformité cotisations retraite complémentaire - ProBTP',
    link: 'https://entreprise.api.gouv.fr/catalogue/probtp/conformites_cotisations_retraite',
  },
  {
    value: 'certification_cnetp',
    label:
      'Attestation de cotisations congés payés & chômage-intempéries - CNETP',
    link: 'https://entreprise.api.gouv.fr/catalogue/cnetp/attestations_cotisations_conges_payes_chomage_intemperies',
  },
  {
    value: 'certifications_qualiopi_france_competences',
    label: 'Qualiopi & habilitations France compétences - CARIF-OREF',
    link: 'https://entreprise.api.gouv.fr/catalogue/carif_oref/certifications_qualiopi_france_competences',
  },
  {
    value: 'open_data_unites_legales_etablissements_insee',
    label:
      'Données des unités légales et établissements en open data - Insee | API incluse par défaut',
    link: 'https://entreprise.api.gouv.fr/catalogue?APIEntreprise_Endpoint%5Bquery%5D=insee%20diffusible',
    required: true,
  },
  {
    value: 'open_data_extrait_rcs_infogreffe',
    label: 'Extrait RCS - Infogreffe | API incluse par défaut',
    link: 'https://entreprise.api.gouv.fr/catalogue/infogreffe/rcs/extrait',
    required: true,
  },
  {
    value: 'open_data_associations_djepva',
    label: 'Données associations - DJEPVA | API incluse par défaut',
    link: 'https://entreprise.api.gouv.fr/catalogue/infogreffe/rcs/extrait',
    required: true,
  },
  {
    value: 'open_data_beneficiaires_effectifs_inpi',
    label: 'Bénéficiaires effectifs - Inpi | API incluse par défaut',
    link: 'https://entreprise.api.gouv.fr/catalogue/inpi/rne/beneficiaires_effectifs',
    required: true,
  },
  {
    value: 'open_data_numero_tva_commission_europeenne',
    label:
      'N°TVA intracommunautaire français - Commission européenne | API incluse par défaut',
    link: 'https://entreprise.api.gouv.fr/catalogue/commission_europeenne/numero_tva',
    required: true,
  },
  {
    value: 'open_data_conventions_collectives_fabnum',
    label: 'Conventions collectives - FabNum | API incluse par défaut',
    link: 'https://entreprise.api.gouv.fr/catalogue/fabrique_numerique_ministeres_sociaux/conventions_collectives',
    required: true,
  },
  {
    value: 'open_data_immatriculation_eori_douanes',
    label: 'Immatriculation EORI - Douanes | API incluse par défaut',
    link: 'https://entreprise.api.gouv.fr/catalogue/douanes/immatriculation_eori',
    required: true,
  },
  {
    value: 'open_data_carte_pro_travaux_publics_fntp',
    label:
      'Carte professionnelles des travaux publics - FNTP | API incluse par défaut',
    link: 'https://entreprise.api.gouv.fr/catalogue/fntp/carte_professionnelle_travaux_public',
    required: true,
  },
  {
    value: 'open_data_certifications_bio_agence_bio',
    label: 'Certification en BIO - Agence BIO | API incluse par défaut',
    link: 'https://entreprise.api.gouv.fr/catalogue/agence_bio/certifications_bio',
    required: true,
  },
  {
    value: 'open_data_certifications_rge_ademe',
    label: 'Certification RGE - ADEME | API incluse par défaut',
    link: 'https://entreprise.api.gouv.fr/catalogue/ademe/certifications_rge',
    required: true,
  },
  {
    value: 'open_data_certifications_batiment_qualibat',
    label: 'Certification Qualibat - Qualibat | API incluse par défaut',
    link: 'https://entreprise.api.gouv.fr/catalogue/qualibat/certifications_batiment',
    required: true,
  },
  {
    value: 'open_data_certifications_ingenierie_opqibi',
    label: 'Certification d’ingénierie - OPQIBI | API incluse par défaut',
    link: 'https://entreprise.api.gouv.fr/catalogue/opqibi/qualifications_ingenierie',
    required: true,
  },
  {
    value: 'open_data_certifications_qualifelec',
    label: 'Certification Qualifelec - Qualifelec | API incluse par défaut',
    link: 'https://entreprise.api.gouv.fr/catalogue/qualifelec/certificats',
    required: true,
  },
  {
    value: 'open_data_brevets_marques_modeles_deposes_inpi',
    label:
      'Brevets, marques et modèles déposés - Inpi | API incluse par défaut',
    link: 'https://entreprise.api.gouv.fr/catalogue?APIEntreprise_Endpoint%5Bquery%5D=inpi%20d%C3%A9pos%C3%A9',
    required: true,
  },
];

const groups = {
  informations_generales: {
    label: 'Informations générales :',
    scopes: [
      'unites_legales_etablissements_insee',
      'open_data_unites_legales_etablissements_insee',
      'open_data_extrait_rcs_infogreffe',
      'open_data_beneficiaires_effectifs_inpi',
      'mandataires_sociaux_infogreffe',
      'open_data_associations_djepva',
      'associations_djepva',
      'effectifs_urssaf',
      'open_data_numero_tva_commission_europeenne',
      'open_data_conventions_collectives_fabnum',
      'open_data_immatriculation_eori_douanes',
    ],
  },
  informations_financieres: {
    label: 'Informations financières :',
    scopes: ['chiffre_affaires_dgfip', 'bilans_bdf', 'liasses_fiscales_dgfip'],
  },
  attestations_sociales_et_fiscales: {
    label: 'Informations de régularité',
    scopes: [
      'attestation_fiscale_dgfip',
      'attestation_sociale_urssaf',
      'cotisations_msa',
      'cotisations_probtp',
      'open_data_carte_pro_travaux_publics_fntp',
      'certification_cnetp',
    ],
  },
  certifications: {
    label: 'Certifications :',
    scopes: [
      'certifications_qualiopi_france_competences',
      'open_data_certifications_bio_agence_bio',
      'open_data_certifications_rge_ademe',
      'open_data_certifications_batiment_qualibat',
      'open_data_certifications_ingenierie_opqibi',
      'open_data_certifications_qualifelec',
      'open_data_brevets_marques_modeles_deposes_inpi',
    ],
  },
};

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
      La loi Lemaire pour une République numérique du 7 octobre 2016 suffit si
      vous demandez des données publiques ; c‘est-à-dire les données n‘ayant pas
      de 🔐 devant leur nom.
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
    contactEmail={DATA_PROVIDER_CONFIGURATIONS[target_api]?.email}
    documentationUrl="https://entreprise.api.gouv.fr/"
  >
    <OrganisationSection editorList={editorList} />
    <DemarcheSection scopesConfiguration={scopesConfiguration} />
    <DescriptionSection />
    <DonneesSection
      scopesConfiguration={scopesConfiguration}
      groups={groups}
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
