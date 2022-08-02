import Link from '../../components/atoms/hyperTexts/Link';
import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import DemarcheSection from '../../components/organisms/form-sections/DemarcheSection';
import DescriptionSection from '../../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../../components/organisms/form-sections/DonneesSection';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import ÉquipeSection from '../../components/organisms/form-sections/ÉquipeSection';
import { getDefaultDocumentationUrl } from '../../components/organisms/Nav';
import Form from '../../components/templates/Form';
import { DATA_PROVIDER_PARAMETERS } from '../../config/data-provider-parameters';
import demarches from './demarches.json';

const DonneesDescription = () => (
  <>
    <p>
      Les données particulier de la DGFIP ne sont plus délivrées par l’API
      Particulier. Pour accéder aux données fiscales des particuliers, utiliser{' '}
      <Link inline newTab href="https://api.gouv.fr/les-api/impot-particulier">
        l’API Impôt Particulier - DGFIP
      </Link>
      .
    </p>
    <p>
      La loi informatique et libertés définit les principes à respecter lors de
      la collecte, du traitement et de la conservation de données personnelles.
    </p>
    <p>L’article 6 précise :</p>
    <ul>
      <li>
        3° [les données] sont adéquates, pertinentes et non excessives au regard
        des finalités pour lesquelles elles sont collectées et de leurs
        traitements ultérieurs ;
      </li>
      <li>
        4° Elles sont exactes, complètes et, si nécessaire, mises à jour ; les
        mesures appropriées doivent être prises pour que les données inexactes
        ou incomplètes au regard des finalités pour lesquelles elles sont
        collectées ou traitées soient effacées ou rectifiées ;
      </li>
    </ul>
    <p>
      Nous vous remercions de sélectionner uniquement les données strictement
      nécessaires à votre téléservice. Le non-respect du principe de
      proportionnalité vous expose vis-à-vis de la CNIL.
    </p>
  </>
);

const CadreJuridiqueDescription = () => (
  <>
    <p>
      Pour pouvoir bénéficier du raccordement à l’API Particulier, le cadre
      légal et réglementaire des fournisseurs de service doit permettre à la
      DINUM de transmettre des données personnelles à votre entité
      administrative. Merci de le compléter.
    </p>
    <p>
      Dans le cas où vous représentez une collectivité, veuillez joindre la
      délibération du conseil municipal explicitant l’usage des données
      demandées.
    </p>
    <p>
      Important : à priori, vous n’avez pas de nouvelle délibération à réaliser.
      Il vous suffit de déposer la dernière délibération tarifaire qui détaille
      les barèmes de facturation des services, ou le règlement qui décrit les
      données nécessaires à une instruction.
    </p>
    <p>
      Pour en savoir plus, consultez{' '}
      <Link inline href="https://api.gouv.fr/guides/deliberation-api-part">
        notre guide sur ce qu’est une bonne délibération
      </Link>
      .
    </p>
  </>
);

const availableScopes = [
  {
    value: 'cnaf_quotient_familial',
    label: 'Quotient familial',
    groupTitle: 'CNAF',
  },
  {
    value: 'cnaf_allocataires',
    label: 'Allocataires',
    groupTitle: 'CNAF',
  },
  {
    value: 'cnaf_enfants',
    label: 'Enfants',
    groupTitle: 'CNAF',
  },
  {
    value: 'cnaf_adresse',
    label: 'Adresse',
    groupTitle: 'CNAF',
  },
  {
    value: 'pole_emploi_identite',
    label: 'Identité',
    groupTitle: 'Pôle Emploi',
  },
  {
    value: 'pole_emploi_contact',
    label: 'Données de contact',
    groupTitle: 'Pôle Emploi',
  },
  {
    value: 'pole_emploi_adresse',
    label: 'Adresse',
    groupTitle: 'Pôle Emploi',
  },
  {
    value: 'pole_emploi_inscription',
    label: 'Inscription',
    groupTitle: 'Pôle Emploi',
    helper: 'Données concernant l’inscription de la personne à Pôle Emploi',
  },
  {
    value: 'mesri_identifiant',
    label: 'INE',
    groupTitle: 'Statut étudiant',
    helper: 'Identifiant National de l’étudiant',
  },
  {
    value: 'mesri_identite',
    label: 'Identité',
    groupTitle: 'Statut étudiant',
    helper: 'Nom, prénom, date de naissance',
  },
  {
    value: 'mesri_inscription_autre',
    label: 'Inscriptions en formation continue',
    groupTitle: 'Statut étudiant',
    helper:
      'Permet d’interroger les données des étudiants en formation continue. Données : date de début, de fin d’inscription, et code COG de la commune du lieu d’étude.',
  },
  {
    value: 'mesri_inscription_etudiant',
    label: 'Inscriptions en formation initiale',
    groupTitle: 'Statut étudiant',
    helper:
      'Permet d’interroger les données des étudiants en formation initiale. Données : dates de début, fin d’inscription et code COG de la commune du lieu d’étude.',
  },
  {
    value: 'mesri_admission',
    label: 'Admissions',
    groupTitle: 'Statut étudiant',
    helper: 'Limite la recherche aux seuls étudiants admis (non-inscrits).',
  },
  {
    value: 'mesri_etablissements',
    label: 'Établissements',
    groupTitle: 'Statut étudiant',
    helper: 'Le ou les établissements (nom et indentifiant - UAI).',
  },
  {
    value: 'cnous_statut_boursier',
    label: 'Statut étudiant boursier',
    groupTitle: 'Statut étudiant boursier',
    helper:
      'Indique si l‘étudiant est boursier au moment de l‘interrogation (Booléen)',
  },
  {
    value: 'cnous_echelon_bourse',
    label: 'Echelon de la bourse',
    groupTitle: 'Statut étudiant boursier',
    helper: 'échelon de 0bis à 8',
  },
  {
    value: 'cnous_email',
    label: 'Email',
    groupTitle: 'Statut étudiant boursier',
  },
  {
    value: 'cnous_periode_versement',
    label: 'Période de versement',
    groupTitle: 'Statut étudiant boursier',
    helper:
      'Date de début de rentrée scolaire/universitaire et durée de versement de la bourse',
  },
  {
    value: 'cnous_statut_bourse',
    label: 'Statut définitif de la bourse',
    groupTitle: 'Statut étudiant boursier',
    helper: 'O si définitif, >=1 si provisoire (conditionnel)',
  },
  {
    value: 'cnous_ville_etudes',
    label: 'Ville d‘étude et établissement',
    groupTitle: 'Statut étudiant boursier',
    helper: 'Libellé de la ville d‘études et de l‘établissement',
  },
  {
    value: 'cnous_identite',
    label: 'Identité',
    groupTitle: 'Statut étudiant boursier',
    helper: 'Nom, prénom, date de naissance, lieu de naissance, genre',
  },
];

const editorList = [
  { name: 'Arpège', siret: '35142130000036' },
  { name: 'Abelium Collectivités', siret: '42172024400050' },
  { name: 'Agora Plus', siret: '48017088500010' },
  { name: 'Jdéalise/Cantine de France', siret: '89255569900016' },
  { name: 'Berger-Levrault', siret: '75580064600373' },
  { name: 'Ciril GROUP', siret: '30516304000119' },
  { name: 'Docaposte FAST', siret: '48847870200027' },
  { name: 'DOCAPOSTE', siret: '49337600800030' },
  { name: 'Odyssée Informatique', siret: '38812677300026' },
  { name: 'Technocarte', siret: '38873581300056' },
  { name: 'Communauté CapDémat', siret: '79529105300010' },
  { name: 'Nord France Informatique (NFI)', siret: '37996323400032' },
  { name: 'NUMESIA', siret: '81418189700012' },
  { name: 'Mushroom Software', siret: '81122842800017' },
  { name: 'Amiciel', siret: '44884396100021' },
  { name: 'Qiis', siret: '52834311400021' },
  { name: 'Aiga', siret: '39825361700045' },
  { name: 'Teamnet', siret: '33922000600078' },
  { name: 'JVS-Mairistem', siret: '32855218700069' },
  { name: '3D Ouest', siret: '44973625500018' },
  { name: 'Entrouvert', siret: '49108189900032' },
  { name: 'Waigeo', siret: '80321944300014' },
  { name: 'AFI', siret: '32275019100031' },
  { name: 'Arche MC2', siret: '38251931200088' },
  { name: 'Kosmos', siret: '41922342500044' },
  {
    name: 'Société d’assistance et gestion du stationnement (SAGS)',
    siret: '38933781700065',
  },
];

const target_api = 'api_particulier';

const ApiParticulier = () => (
  <Form
    target_api={target_api}
    demarches={demarches}
    contactEmail={DATA_PROVIDER_PARAMETERS[target_api]?.email}
    documentationUrl={getDefaultDocumentationUrl(target_api)}
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
    <ÉquipeSection />
    <CguSection cguLink="https://api.gouv.fr/resources/CGU%20API%20Particulier.pdf" />
  </Form>
);

export default ApiParticulier;
