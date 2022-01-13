import { DonneesDescription as CommonDonneesDescription } from './common';
import Link from '../../components/atoms/hyperTexts/Link';

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
        href="/docs/presentation_de_l_api_impot_particulier_v1_9.pdf"
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
      scopes: {
        dgfip_annee_n_moins_1: false,
        dgfip_annee_n_moins_2: false,
        dgfip_annee_n_moins_3: false,
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
  carte_stationnement: {
    label: 'Délivrance d’une carte de stationnement',
    state: {
      scopes: {
        dgfip_aft: true,
        dgfip_annee_n_moins_1: true,
      },
    },
  },
  quotient_familial: {
    label: 'Calcul du quotient familial pour les prestations municipales',
    state: {
      scopes: {
        dgfip_nbpart: true,
        dgfip_rfr: true,
        dgfip_annee_n_moins_1: true,
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
    value: 'dgfip_rfr',
    label: 'Revenu fiscal de référence',
    groupTitle: 'Agrégats fiscaux',
  },
  {
    value: 'dgfip_mntRevbareme',
    label: 'Montant de l’impôt sur les revenus soumis au barème (ligne 14)',
    groupTitle: 'Agrégats fiscaux',
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
