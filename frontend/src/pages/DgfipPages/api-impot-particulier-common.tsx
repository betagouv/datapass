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
        href="/docs/presentation_de_l_api_impot_particulier_v2.8.pdf"
        aria-label="Présentation de l’API Impôt particulier (PDF)"
      >
        Présentation de l’API Impôt particulier (PDF)
      </Link>
      .
    </p>
  </>
);

export const fcDemarches = {
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
};

export const demarches = fcDemarches;
(demarches.default.state.scopes as any).dgfip_IndLep = false;

export const fcScopesConfiguration = [
  {
    value: 'dgfip_annee_n_moins_1',
    label: 'Dernière année de revenu',
  },
  {
    value: 'dgfip_annee_n_moins_2',
    label: 'Avant-dernière année de revenu',
  },
  {
    value: 'dgfip_annee_n_moins_3',
    label: 'Avant-avant-dernière année de revenu',
  },
  {
    value: 'dgfip_annee_n_moins_2_si_indispo_n_moins_1',
    label:
      'Avant-dernière année de revenu, si la dernière année de revenu est indisponible',
    helper:
      'En cochant cette case, vous optez pour récupérer les informations de l’avant-dernière année, lorsque celles de la dernière année ne sont pas disponibles.\n\nCette option n’est pas possible si vous souhaitez des données fournies uniquement par la ressource facture /avis IR.\n\nPour plus de précisions, consulter la documentation présente dans la rubrique « Comment choisir les données ? »',
  },
  {
    value: 'dgfip_nmUsaDec1',
    label: 'Nom',
  },
  {
    value: 'dgfip_nmNaiDec1',
    label: 'Nom de naissance',
  },
  {
    value: 'dgfip_prnmDec1',
    label: 'Prénom(s)',
  },
  {
    value: 'dgfip_dateNaisDec1',
    label: 'Date de naissance',
  },
  {
    value: 'dgfip_nmUsaDec2',
    label: 'Nom',
  },
  {
    value: 'dgfip_nmNaiDec2',
    label: 'Nom de naissance',
  },
  {
    value: 'dgfip_prnmDec2',
    label: 'Prénom(s)',
  },
  {
    value: 'dgfip_dateNaisDec2',
    label: 'Date de naissance',
  },
  {
    value: 'dgfip_aft',
    label: 'Adresse déclarée au 1er Janvier',
  },
  {
    value: 'dgfip_sitfam',
    label: 'Situation de famille (marié, pacsé, célibataire, veuf divorcé)',
  },
  {
    value: 'dgfip_nbpart',
    label: 'Nombre de parts',
  },
  {
    value: 'dgfip_pac_nbPac',
    label: 'Nombre de personnes à charge',
  },
  {
    value: 'dgfip_pac',
    label: 'Détail des personnes à charge et rattachées',
  },
  {
    value: 'dgfip_pariso',
    label: 'Parent isolé (case T)',
  },
  {
    value: 'dgfip_annee_df_au_3112_si_deces_ctb_mp',
    label:
      "Données fiscales au 31/12 en cas de décès d'un contribuable marié ou pacsé",
    helper:
      'En cochant cette case, vous optez pour récupérer les données fiscales de la période après décès d’un contribuable marié ou pacsé (à défaut aucune donnée fiscale n’est transmise).\n\nCette option n’est pas possible si vous souhaitez des données fournies uniquement par la ressource facture /avis IR.\n\nPour plus de précisions, consulter la documentation présente dans la rubrique « Comment choisir les données ? »',
  },
  {
    value: 'dgfip_rfr',
    label: 'Revenu fiscal de référence',
  },
  {
    value: 'dgfip_mntRevbareme',
    label: 'Montant de l’impôt sur les revenus soumis au barème (ligne 14)',
    helper:
      'Cette donnée n’intègre pas la taxation des revenus au taux effectif ou au taux proportionnel. Une expression de besoin spécifique est à réaliser si, après échanges avec DGFiP, ces types de taxation sont nécessaires.\n\nPour plus de précisions, consulter la documentation présente dans la rubrique « Comment choisir les données ? »',
  },
  {
    value: 'dgfip_inddeficit',
    label: 'Indicateur de l’existence d’un déficit',
  },
  {
    value: 'dgfip_indiIFI',
    label: 'Indicateur ISF/IFI',
  },
  {
    value: 'dgfip_RevDecl_Cat1_Tspr',
    label: 'Catégorie 1 - Salaires, pensions, rentes',
  },
  {
    value: 'dgfip_RevDecl_Cat1_RentOn',
    label: 'Catégorie 1 - Rentes viagères à titre onéreux',
  },
  {
    value: 'dgfip_RevDecl_Cat2_Rcm',
    label: 'Catégorie 2 - Revenus de capitaux mobiliers',
  },
  {
    value: 'dgfip_RevDecl_Cat3_PMV',
    label: 'Catégorie 3 - Plus ou moins values',
  },
  {
    value: 'dgfip_RevDecl_Cat4_Ref',
    label: 'Catégorie 4 - Revenus fonciers',
  },
  {
    value: 'dgfip_RevDecl_Cat5_NonSal',
    label: 'Catégorie 5 - Revenus des professions non salariées',
  },
  {
    value: 'dgfip_RevNets_Cat1_Tspr',
    label: 'Catégorie 1 - Salaires, pensions, rentes',
  },
  {
    value: 'dgfip_RevNets_Cat1_RentOn',
    label: 'Catégorie 1 - Rentes viagères à titre onéreux',
  },
  {
    value: 'dgfip_RevNets_Cat2_Rcm',
    label: 'Catégorie 2 - Revenus de capitaux mobiliers',
  },
  {
    value: 'dgfip_RevNets_Cat3_PMV',
    label: 'Catégorie 3 - Plus ou moins values',
  },
  {
    value: 'dgfip_RevNets_Cat4_Ref',
    label: 'Catégorie 4 - Revenus fonciers',
  },
  {
    value: 'dgfip_RevNets_Cat5_NonSal',
    label: 'Catégorie 5 - Revenus des professions non salariées',
  },
  {
    value: 'dgfip_PaDeduc_EnfMaj',
    label:
      'Pensions alimentaires déductibles - Pension alimentaire versées à enfant majeur',
  },
  {
    value: 'dgfip_PaDeduc_Autres',
    label:
      'Pensions alimentaires déductibles - Autres pensions alimentaires versées (enfants mineurs, ascendants, ...)',
  },
  {
    value: 'dgfip_EpargRetrDeduc',
    label: 'Versement épargne retraite',
  },
];

export const scopesConfiguration = [
  ...fcScopesConfiguration,
  {
    value: 'dgfip_IndLep',
    label: 'Indicateur d’éligibilité au LEP',
  },
];

export const fcGroups = {
  annees: {
    label: 'Années sur lesquelles porte votre demande',
    scopes: [
      'dgfip_annee_n_moins_1',
      'dgfip_annee_n_moins_2',
      'dgfip_annee_n_moins_3',
      'dgfip_annee_n_moins_2_si_indispo_n_moins_1',
    ],
  },
  etat_civil_declarant_1: {
    label: 'État civil - déclarant 1',
    scopes: [
      'dgfip_nmUsaDec1',
      'dgfip_nmNaiDec1',
      'dgfip_prnmDec1',
      'dgfip_dateNaisDec1',
    ],
  },
  etat_civil_declarant_2: {
    label: 'État civil - déclarant 2',
    scopes: [
      'dgfip_nmUsaDec2',
      'dgfip_nmNaiDec2',
      'dgfip_prnmDec2',
      'dgfip_dateNaisDec2',
    ],
  },
  adresse: {
    label: 'Adresse',
    scopes: ['dgfip_aft'],
  },
  situation_du_foyer_fiscal: {
    label: 'Situation du foyer fiscal',
    scopes: [
      'dgfip_sitfam',
      'dgfip_nbpart',
      'dgfip_pac_nbPac',
      'dgfip_pac',
      'dgfip_pariso',
      'dgfip_annee_df_au_3112_si_deces_ctb_mp',
    ],
  },
  agregats_fiscaux: {
    label: 'Agrégats fiscaux',
    scopes: [
      'dgfip_rfr',
      'dgfip_mntRevbareme',
      'dgfip_inddeficit',
      'dgfip_indiIFI',
    ],
  },
  revenus_categoriels_revenus_declares: {
    label:
      'Revenus catégoriels - revenus déclarés (avant application des abattements, etc...)',
    scopes: [
      'dgfip_RevDecl_Cat1_Tspr',
      'dgfip_RevDecl_Cat1_RentOn',
      'dgfip_RevDecl_Cat2_Rcm',
      'dgfip_RevDecl_Cat3_PMV',
      'dgfip_RevDecl_Cat4_Ref',
      'dgfip_RevDecl_Cat5_NonSal',
    ],
  },
  revenus_categoriels_revenus_nets: {
    label:
      'Revenus catégoriels - revenus nets (après application des abattements, etc...)',
    scopes: [
      'dgfip_RevNets_Cat1_Tspr',
      'dgfip_RevNets_Cat1_RentOn',
      'dgfip_RevNets_Cat2_Rcm',
      'dgfip_RevNets_Cat3_PMV',
      'dgfip_RevNets_Cat4_Ref',
      'dgfip_RevNets_Cat5_NonSal',
    ],
  },
  charges_deductibles: {
    label: 'Charges déductibles',
    scopes: [
      'dgfip_PaDeduc_EnfMaj',
      'dgfip_PaDeduc_Autres',
      'dgfip_EpargRetrDeduc',
    ],
  },
};

export const groups = {
  ...JSON.parse(JSON.stringify(fcGroups)),
  eligibilite_lep: {
    label:
      'Éligibilité Livret d’Épargne Populaire - établissements bancaires uniquement',
    scopes: ['dgfip_IndLep'],
  },
};

export const accessModes = [
  {
    id: 'acces_spi',
    label: 'via le Numéro fiscal (SPI)',
  },
  {
    id: 'acces_etat_civil',
    label: 'via l’état civil',
  },
];
