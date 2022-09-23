import Link from '../../components/atoms/hyperTexts/Link';
import { DonneesDescription as CommonDonneesDescription } from './common';

export const DonneesDescription = () => (
  <>
    <CommonDonneesDescription />
    <p>
      Pour connaitre les modalités d’appel et de réponse de l’API Impôt
      particulier ainsi que les données proposées, merci de consulter le
      document suivant :{' '}
      <Link
        inline
        newTab
        href="/docs/presentation_de_l_api_impot_particulier_v2.2.pdf"
        aria-label="Présentation de l’API Impôt particulier (PDF)"
      >
        Présentation de l’API Impôt particulier (PDF)
      </Link>
      .
    </p>
  </>
);

export const demarches = {
  default: {
    label: 'Demande libre',
    state: {
      intitule: '',
      description: '',
      data_recipients: '',
      fondement_juridique_title: '',
      scopes: {
        dgfip_annee_n_moins_1: false,
        dgfip_annee_n_moins_2: false,
        dgfip_annee_n_moins_3: false,
        dgfip_annee_n_moins_2_si_indispo_n_moins_1: false,
        dgfip_nmUsaDec1: false,
        dgfip_nmNaiDec1: false,
        dgfip_prnmDec1: false,
        dgfip_dateNaisDec1: false,
        dgfip_nmUsaDec2: false,
        dgfip_nmNaiDec2: false,
        dgfip_prnmDec2: false,
        dgfip_dateNaisDec2: false,
        dgfip_aft: false,
        dgfip_locaux_th_ident: false,
        dgfip_locaux_th_Nat: false,
        dgfip_locaux_th_Tax: false,
        dgfip_locaux_th_Aff: false,
        dgfip_sitfam: false,
        dgfip_nbpart: false,
        dgfip_pac_nbPac: false,
        dgfip_pac: false,
        dgfip_pariso: false,
        dgfip_annee_df_au_3112_si_deces_ctb_mp: false,
        dgfip_rfr: false,
        dgfip_mntRevbareme: false,
        dgfip_inddeficit: false,
        dgfip_indiIFI: false,
        dgfip_RevDecl_Cat1_Tspr: false,
        dgfip_RevDecl_Cat1_RentOn: false,
        dgfip_RevDecl_Cat2_Rcm: false,
        dgfip_RevDecl_Cat3_PMV: false,
        dgfip_RevDecl_Cat4_Ref: false,
        dgfip_RevDecl_Cat5_NonSal: false,
        dgfip_RevNets_Cat1_Tspr: false,
        dgfip_RevNets_Cat1_RentOn: false,
        dgfip_RevNets_Cat2_Rcm: false,
        dgfip_RevNets_Cat3_PMV: false,
        dgfip_RevNets_Cat4_Ref: false,
        dgfip_RevNets_Cat5_NonSal: false,
        dgfip_PaDeduc_EnfMaj: false,
        dgfip_PaDeduc_Autres: false,
        dgfip_EpargRetrDeduc: false,
      },
    },
  },
  stationnement_residentiel: {
    label: 'Stationnement Résidentiel',
    state: {
      intitule: 'Dites-le nous une fois - Stationnement Résidentiel',
      description:
        'Simplification des demandes de carte de stationnement résidentiel pour les usagers par l’utilisation des données fiscales fournies par la DGFiP.\r\n(A compléter par le demandeur)',
      data_recipients:
        'Agents instructeurs des demandes de carte de stationnement résidentiel',
      fondement_juridique_title:
        '- Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016, relatif à la protection des personnes physiques à l’égard du traitement des données à caractère personnel et à la libre circulation de ces données (RGPD)\r\n- Les articles L. 114-8 et suivants du code des relations entre le public et l’administration (CRPA)\r\n- Délibération de la collectivité (ou autre fondement juridique)',
    },
  },
  place_creche: {
    label: 'Place en crèche',
    state: {
      intitule: 'Dites-le nous une fois - Place en crèche',
      description:
        'Simplification des demandes de place en crèche pour les usagers par l’utilisation des données fiscales fournies par la DGFiP.\r\n(A compléter par le demandeur)',
      data_recipients: 'Agents instructeurs des demandes de place en crèche',
      fondement_juridique_title:
        '- Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016, relatif à la protection des personnes physiques à l’égard du traitement des données à caractère personnel et à la libre circulation de ces données (RGPD)\r\n- Les articles L. 114-8 et suivants du code des relations entre le public et l’administration (CRPA)\r\n- Délibération de la collectivité (ou autre fondement juridique)',
    },
  },
  activites_periscolaires: {
    label: 'Activités périscolaires',
    state: {
      intitule: 'Dites-le-nous une fois – Activités périscolaires',
      description:
        'Simplification de la souscription aux activités périscolaires pour les usagers par l’utilisation des données fiscales fournies par la DGFiP afin de déterminer les tarifs applicables.\r\n(A compléter par le demandeur)',
      data_recipients:
        'Agents instructeurs des demandes de souscription aux activités périscolaires',
      fondement_juridique_title:
        '- Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016, relatif à la protection des personnes physiques à l’égard du traitement des données à caractère personnel et à la libre circulation de ces données (RGPD)\r\n- Les articles L. 114-8 et suivants du code des relations entre le public et l’administration (CRPA)\r\n- Délibération de la collectivité (ou autre fondement juridique)',
    },
  },
  cantine_scolaire: {
    label: 'Cantine scolaire',
    state: {
      intitule: 'Dites-le-nous une fois – Cantine scolaire',
      description:
        'Simplification de la souscription à la cantine scolaire pour les usagers par l’utilisation des données fiscales fournies par la DGFiP afin de déterminer les tarifs applicables.\r\n(A compléter par le demandeur)',
      data_recipients:
        'Agents instructeurs des demandes de souscription à la cantine scolaire',
      fondement_juridique_title:
        '- Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016, relatif à la protection des personnes physiques à l’égard du traitement des données à caractère personnel et à la libre circulation de ces données (RGPD)\r\n- Les articles L. 114-8 et suivants du code des relations entre le public et l’administration (CRPA)\r\n- Délibération de la collectivité (ou autre fondement juridique)',
    },
  },
  aides_sociales_facultatives: {
    label: 'Aides sociales facultatives',
    state: {
      intitule: 'Dites-le-nous une fois – Aides sociales facultatives',
      description:
        'Simplification des demandes d’aides sociales facultatives pour les usagers par l’utilisation des données fiscales fournies par la DGFiP pour déterminer l’éligibilité au service.\r\n(A compléter par le demandeur)',
      data_recipients:
        'Agents instructeurs des demandes d’aides sociales facultatives',
      fondement_juridique_title:
        '- Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016, relatif à la protection des personnes physiques à l’égard du traitement des données à caractère personnel et à la libre circulation de ces données (RGPD)\r\n- Les articles L. 114-8 et suivants du code des relations entre le public et l’administration (CRPA)\r\n- Délibération de la collectivité (ou autre fondement juridique)',
    },
  },
  carte_transport: {
    label: 'Carte de transport',
    state: {
      intitule: 'Dites-le-nous une fois – Carte de transport',
      description:
        'Simplification de la souscription à la carte de transport pour les usagers par l’utilisation des données fiscales fournies par la DGFiP pour déterminer le tarif applicable.\r\n(A compléter par le demandeur)',
      data_recipients: 'Agents instructeurs des demandes de carte de transport',
      fondement_juridique_title:
        '- Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016, relatif à la protection des personnes physiques à l’égard du traitement des données à caractère personnel et à la libre circulation de ces données (RGPD)\r\n- Les articles L. 114-8 et suivants du code des relations entre le public et l’administration (CRPA)\r\n- Délibération de la collectivité (ou autre fondement juridique)',
    },
  },
  migration_api_particulier: {
    label:
      'Migration de l’API Particulier (DINUM) vers l’API Impôt Particulier (DGFiP)',
    state: {
      intitule:
        'Migration de l’API Particulier (DINUM) vers l’API Impôt Particulier (DGFiP)',
      description:
        'Veuillez obligatoirement compléter les informations ci-dessous :\r\nLa référence (numéro DataPass) de votre accès actuel à l’API Particulier  :\r\nLe cas d’usage concerné : Sa description ou bien choisir parmi la liste (stationnement résidentiel, place en crèche, activités périscolaires, cantine scolaire, aides sociales facultatives, carte de transport) :\r\nLes coordonnées de votre éditeur de logiciel (si vous en avez) ou préciser si c’est un développement interne :\r\nInformations importantes:\r\n1. L’accès aux données se fait via le numéro fiscal seul en lieu et place du numéro fiscal et de la référence de l’avis d’imposition. Pour un téléservice directement ouvert aux usagers, l’API Impôt particulier est accessible par FranceConnect.\r\n2. Il n’est pas nécessaire de cocher les données nécessaires dans le formulaire. Le périmètre des données sera équivalent à celui de l’API particulier :\r\nMillésime - Dernière année de revenu disponible (sur une profondeur de 2 ans)\r\nDéclarant 1  - Nom de naissance\r\nDéclarant 1  - Nom \r\nDéclarant 1  - Prénom(s) \r\nDéclarant 1  - Date de naissance \r\nDéclarant 2  - Nom de naissance\r\nDéclarant 2  - Nom \r\nDéclarant 2  - Prénom(s) \r\nDéclarant 2  - Date de naissance \r\nAdresse \r\nSituation de famille \r\nNombre de parts \r\nNombre de personnes à charge \r\nRevenu fiscal de référence \r\nRevenu brut global \r\nDate de recouvrement \r\nDate d’établissement \r\nRevenu imposable \r\nImpôt sur le revenu net avant corrections \r\nMontant de l’impôt \r\nAnnée des revenus',
      fondement_juridique_title:
        'Si pas disponible, à justifier dans un délai de 6 mois (décret, loi, délibération, autre fondement juridique)',
      scopes: {
        dgfip_annee_n_moins_2_si_indispo_n_moins_1: true,
      },
    },
  },
};

export const availableScopes = [
  {
    value: 'dgfip_annee_n_moins_1',
    label: 'Dernière année de revenu',
    groupTitle: 'Années sur lesquelles porte votre demande',
  },
  {
    value: 'dgfip_annee_n_moins_2',
    label: 'Avant-dernière année de revenu',
    groupTitle: 'Années sur lesquelles porte votre demande',
  },
  {
    value: 'dgfip_annee_n_moins_3',
    label: 'Avant-avant-dernière année de revenu',
    groupTitle: 'Années sur lesquelles porte votre demande',
  },
  {
    value: 'dgfip_annee_n_moins_2_si_indispo_n_moins_1',
    label:
      'Avant-dernière année de revenu, si la dernière année de revenu est indisponible',
    groupTitle: 'Années sur lesquelles porte votre demande',
    helper:
      'En cochant cette case, vous optez pour récupérer les informations de l’avant-dernière année, lorsque celles de la dernière année ne sont pas disponibles.\n\nCette option n’est pas possible si vous souhaitez des données fournies uniquement par la ressource facture /avis IR.\n\nPour plus de précisions, consulter la documentation présente dans la rubrique « Comment choisir les données ? »',
  },
  {
    value: 'dgfip_nmUsaDec1',
    label: 'Nom',
    groupTitle: 'État civil - déclarant 1',
  },
  {
    value: 'dgfip_nmNaiDec1',
    label: 'Nom de naissance',
    groupTitle: 'État civil - déclarant 1',
  },
  {
    value: 'dgfip_prnmDec1',
    label: 'Prénom(s)',
    groupTitle: 'État civil - déclarant 1',
  },
  {
    value: 'dgfip_dateNaisDec1',
    label: 'Date de naissance',
    groupTitle: 'État civil - déclarant 1',
  },
  {
    value: 'dgfip_nmUsaDec2',
    label: 'Nom',
    groupTitle: 'État civil - déclarant 2',
  },
  {
    value: 'dgfip_nmNaiDec2',
    label: 'Nom de naissance',
    groupTitle: 'État civil - déclarant 2',
  },
  {
    value: 'dgfip_prnmDec2',
    label: 'Prénom(s)',
    groupTitle: 'État civil - déclarant 2',
  },
  {
    value: 'dgfip_dateNaisDec2',
    label: 'Date de naissance',
    groupTitle: 'État civil - déclarant 2',
  },
  {
    value: 'dgfip_aft',
    label: 'Adresse déclarée au 1er Janvier',
    groupTitle: 'Adresse',
  },
  {
    value: 'dgfip_locaux_th_ident',
    label: 'Données du local - identifiant du logement',
    groupTitle: 'Adresse',
  },
  {
    value: 'dgfip_locaux_th_Nat',
    label: 'Données du local - nature (maison, appartement, etc.)',
    groupTitle: 'Adresse',
  },
  {
    value: 'dgfip_locaux_th_Tax',
    label:
      'Données du local - régime de taxation (résidence principale uniquement)',
    groupTitle: 'Adresse',
  },
  {
    value: 'dgfip_locaux_th_Aff',
    label: 'Données du local - affectation (« H » pour habitation)',
    groupTitle: 'Adresse',
  },
  {
    value: 'dgfip_sitfam',
    label: 'Situation de famille (marié, pacsé, célibataire, veuf divorcé)',
    groupTitle: 'Situation du foyer fiscal',
  },
  {
    value: 'dgfip_nbpart',
    label: 'Nombre de parts',
    groupTitle: 'Situation du foyer fiscal',
  },
  {
    value: 'dgfip_pac_nbPac',
    label: 'Nombre de personnes à charge',
    groupTitle: 'Situation du foyer fiscal',
  },
  {
    value: 'dgfip_pac',
    label: 'Détail des personnes à charge et rattachées',
    groupTitle: 'Situation du foyer fiscal',
  },
  {
    value: 'dgfip_pariso',
    label: 'Parent isolé (case T)',
    groupTitle: 'Situation du foyer fiscal',
  },
  {
    value: 'dgfip_annee_df_au_3112_si_deces_ctb_mp',
    label:
      "Données fiscales au 31/12 en cas de décès d'un contribuable marié ou pacsé",
    groupTitle: 'Situation du foyer fiscal',
    helper:
      'En cochant cette case, vous optez pour récupérer les données fiscales de la période après décès d’un contribuable marié ou pacsé (à défaut aucune donnée fiscale n’est transmise).\n\nCette option n’est pas possible si vous souhaitez des données fournies uniquement par la ressource facture /avis IR.\n\nPour plus de précisions, consulter la documentation présente dans la rubrique « Comment choisir les données ? »',
  },
  {
    value: 'dgfip_rfr',
    label: 'Revenu fiscal de référence',
    groupTitle: 'Agrégats fiscaux',
  },
  {
    value: 'dgfip_mntRevbareme',
    label: 'Montant de l’impôt sur les revenus soumis au barème (ligne 14)',
    groupTitle: 'Agrégats fiscaux',
    helper:
      'Cette donnée n’intègre pas la taxation des revenus au taux effectif ou au taux proportionnel. Une expression de besoin spécifique est à réaliser si, après échanges avec DGFiP, ces types de taxation sont nécessaires.\n\nPour plus de précisions, consulter la documentation présente dans la rubrique « Comment choisir les données ? »',
  },
  {
    value: 'dgfip_inddeficit',
    label: 'Indicateur de l’existence d’un déficit',
    groupTitle: 'Agrégats fiscaux',
  },
  {
    value: 'dgfip_indiIFI',
    label: 'Indicateur ISF/IFI',
    groupTitle: 'Agrégats fiscaux',
  },
  {
    value: 'dgfip_RevDecl_Cat1_Tspr',
    label: 'Catégorie 1 - Salaires, pensions, rentes',
    groupTitle:
      'Revenus catégoriels - revenus déclarés (avant application des abattements, etc...)',
  },
  {
    value: 'dgfip_RevDecl_Cat1_RentOn',
    label: 'Catégorie 1 - Rentes viagères à titre onéreux',
    groupTitle:
      'Revenus catégoriels - revenus déclarés (avant application des abattements, etc...)',
  },
  {
    value: 'dgfip_RevDecl_Cat2_Rcm',
    label: 'Catégorie 2 - Revenus de capitaux mobiliers',
    groupTitle:
      'Revenus catégoriels - revenus déclarés (avant application des abattements, etc...)',
  },
  {
    value: 'dgfip_RevDecl_Cat3_PMV',
    label: 'Catégorie 3 - Plus ou moins values',
    groupTitle:
      'Revenus catégoriels - revenus déclarés (avant application des abattements, etc...)',
  },
  {
    value: 'dgfip_RevDecl_Cat4_Ref',
    label: 'Catégorie 4 - Revenus fonciers',
    groupTitle:
      'Revenus catégoriels - revenus déclarés (avant application des abattements, etc...)',
  },
  {
    value: 'dgfip_RevDecl_Cat5_NonSal',
    label: 'Catégorie 5 - Revenus des professions non salariées',
    groupTitle:
      'Revenus catégoriels - revenus déclarés (avant application des abattements, etc...)',
  },
  {
    value: 'dgfip_RevNets_Cat1_Tspr',
    label: 'Catégorie 1 - Salaires, pensions, rentes',
    groupTitle:
      'Revenus catégoriels - revenus nets (après application des abattements, etc...)',
  },
  {
    value: 'dgfip_RevNets_Cat1_RentOn',
    label: 'Catégorie 1 - Rentes viagères à titre onéreux',
    groupTitle:
      'Revenus catégoriels - revenus nets (après application des abattements, etc...)',
  },
  {
    value: 'dgfip_RevNets_Cat2_Rcm',
    label: 'Catégorie 2 - Revenus de capitaux mobiliers',
    groupTitle:
      'Revenus catégoriels - revenus nets (après application des abattements, etc...)',
  },
  {
    value: 'dgfip_RevNets_Cat3_PMV',
    label: 'Catégorie 3 - Plus ou moins values',
    groupTitle:
      'Revenus catégoriels - revenus nets (après application des abattements, etc...)',
  },
  {
    value: 'dgfip_RevNets_Cat4_Ref',
    label: 'Catégorie 4 - Revenus fonciers',
    groupTitle:
      'Revenus catégoriels - revenus nets (après application des abattements, etc...)',
  },
  {
    value: 'dgfip_RevNets_Cat5_NonSal',
    label: 'Catégorie 5 - Revenus des professions non salariées',
    groupTitle:
      'Revenus catégoriels - revenus nets (après application des abattements, etc...)',
  },
  {
    value: 'dgfip_PaDeduc_EnfMaj',
    label:
      'Pensions alimentaires déductibles - Pension alimentaire versées à enfant majeur',
    groupTitle: 'Charges déductibles',
  },
  {
    value: 'dgfip_PaDeduc_Autres',
    label:
      'Pensions alimentaires déductibles - Autres pensions alimentaires versées (enfants mineurs, ascendants, ...)',
    groupTitle: 'Charges déductibles',
  },
  {
    value: 'dgfip_EpargRetrDeduc',
    label: 'Versement épargne retraite',
    groupTitle: 'Charges déductibles',
  },
];
