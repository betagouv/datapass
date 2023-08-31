import React from 'react';
import AgentConnectFi from '../pages/AgentConnectFi';
import AgentConnectFs from '../pages/AgentConnectFs';
import AidantsConnect from '../pages/AidantsConnect';
import ApiCaptchetat from '../pages/ApiCaptchetat';
import ApiDroitsCnam from '../pages/ApiDroitsCnam';
import ApiEntreprise from '../pages/ApiEntreprise';
import ApiHistovec from '../pages/ApiHistovec';
import ApiIndemnisationPoleEmploi from '../pages/ApiIndemnisationPoleEmploi';
import ApiIndemnitesJournalieresCnam from '../pages/ApiIndemnitesJournalieresCnam';
import ApiIngres from '../pages/ApiIngres';
import ApiPrestationsSociales from '../pages/ApiPrestationsSociales';
import ApiPrestationsSocialesFc from '../pages/ApiPrestationsSocialesFc';
import ApiProSanteConnect from '../pages/ApiProSanteConnect';
import ApiServiceNational from '../pages/ApiServiceNational';
import ApiStatutDemandeurEmploi from '../pages/ApiStatutDemandeurEmploi';
import ApiStatutEtudiant from '../pages/ApiStatutEtudiant';
import ApiStatutEtudiantBoursier from '../pages/ApiStatutEtudiantBoursier';
import ApiScolarite from '../pages/ApiScolarite';
import CartoBio from '../pages/CartoBio';
import ApiCprProProduction from '../pages/DgfipPages/ApiCprProProduction';
import ApiCprProSandbox from '../pages/DgfipPages/ApiCprProSandbox';
import ApiEContactsProduction from '../pages/DgfipPages/ApiEContactsProduction';
import ApiEContactsSandbox from '../pages/DgfipPages/ApiEContactsSandbox';
import ApiEnsuDocumentsProduction from '../pages/DgfipPages/ApiEnsuDocumentsProduction';
import ApiEnsuDocumentsSandbox from '../pages/DgfipPages/ApiEnsuDocumentsSandbox';
import ApiEProProduction from '../pages/DgfipPages/ApiEProProduction';
import ApiEProSandbox from '../pages/DgfipPages/ApiEProSandbox';
import ApiFicobaProduction from '../pages/DgfipPages/ApiFicobaProduction';
import ApiFicobaUnique from '../pages/DgfipPages/ApiFicobaUnique';
import ApiFicobaSandbox from '../pages/DgfipPages/ApiFicobaSandbox';
import ApiHermesProduction from '../pages/DgfipPages/ApiHermesProduction';
import ApiHermesSandbox from '../pages/DgfipPages/ApiHermesSandbox';
import ApiImpotParticulierFcProduction from '../pages/DgfipPages/ApiImpotParticulierFcProduction';
import ApiImpotParticulierFcSandbox from '../pages/DgfipPages/ApiImpotParticulierFcSandbox';
import ApiImpotParticulierFcUnique from '../pages/DgfipPages/ApiImpotParticulierFcUnique';
import ApiImpotParticulierProduction from '../pages/DgfipPages/ApiImpotParticulierProduction';
import ApiImpotParticulierSandbox from '../pages/DgfipPages/ApiImpotParticulierSandbox';
import ApiImpotParticulierUnique from '../pages/DgfipPages/ApiImpotParticulierUnique';
import ApiInfinoeProduction from '../pages/DgfipPages/ApiInfinoeProduction';
import ApiInfinoeSandbox from '../pages/DgfipPages/ApiInfinoeSandbox';
import ApiMireProduction from '../pages/DgfipPages/ApiMireProduction';
import ApiMireSandbox from '../pages/DgfipPages/ApiMireSandbox';
import ApiOcfiProduction from '../pages/DgfipPages/ApiOcfiProduction';
import ApiOcfiSandbox from '../pages/DgfipPages/ApiOcfiSandbox';
import ApiOpaleProduction from '../pages/DgfipPages/ApiOpaleProduction';
import ApiOpaleSandbox from '../pages/DgfipPages/ApiOpaleSandbox';
import ApiR2PProduction from '../pages/DgfipPages/ApiR2PProduction';
import ApiR2PSandbox from '../pages/DgfipPages/ApiR2PSandbox';
import ApiR2PUnique from '../pages/DgfipPages/ApiR2PUnique';
import ApiRobfProduction from '../pages/DgfipPages/ApiRobfProduction';
import ApiRobfSandbox from '../pages/DgfipPages/ApiRobfSandbox';
import ApiSatelitProduction from '../pages/DgfipPages/ApiSatelitProduction';
import ApiSatelitSandbox from '../pages/DgfipPages/ApiSatelitSandbox';
import ApiSfipProduction from '../pages/DgfipPages/ApiSfipProduction';
import ApiSfipSandbox from '../pages/DgfipPages/ApiSfipSandbox';
import ApiSfipUnique from '../pages/DgfipPages/ApiSfipUnique';
import FranceConnect from '../pages/FranceConnect';
import HubeePortail from '../pages/HubeePortail';
import HubeePortailDila from '../pages/HubeePortailDila';
import LeTaxi from '../pages/LeTaxi';
import ApiDeclarationAutoEntrepreneur from '../pages/UrssafPages/ApiDeclarationAutoEntrepreneur';
import ApiDeclarationCesu from '../pages/UrssafPages/ApiDeclarationCesu';
import ApiTiersDePrestation from '../pages/UrssafPages/ApiTiersDePrestation';
import { ScopeConfiguration } from '../components/organisms/form-sections/DonneesSection/Scopes';

export type FullDataProviderConfiguration = {
  label: string;
  icon: string | null;
  email: string | null;
  type: DataProviderType;
  scopesConfiguration: ScopeConfiguration[];
  groups: {
    [k: string]: {
      label: string;
      scopes: string[];
    };
  };
  editeurs: { name: string; siret: string }[];
  demarches: {
    [k: string]: {
      label: string;
      about: string;
      state: any;
      team_members?: any;
    };
  };
  cguLink: string;
  donneesDescription: string;
  cadreJuridiqueDescription: string;
};

export enum DataProviderType {
  api = 'api',
  service = 'service',
}

export type DataProviderConfiguration = {
  label: string;
  icon: string | null;
  email: string | null;
  type: DataProviderType;
  component?: React.FC;
  url?: string;
};

export const TargetAPI = {
  aidants_connect: 'aidants_connect',
  hubee_portail: 'hubee_portail',
  hubee_portail_dila: 'hubee_portail_dila',
  franceconnect: 'franceconnect',
  api_entreprise: 'api_entreprise',
  api_impot_particulier_sandbox: 'api_impot_particulier_sandbox',
  api_impot_particulier_production: 'api_impot_particulier_production',
  api_impot_particulier_unique: 'api_impot_particulier_unique',
  api_impot_particulier_fc_sandbox: 'api_impot_particulier_fc_sandbox',
  api_impot_particulier_fc_production: 'api_impot_particulier_fc_production',
  api_impot_particulier_fc_unique: 'api_impot_particulier_fc_unique',
  api_r2p_sandbox: 'api_r2p_sandbox',
  api_r2p_production: 'api_r2p_production',
  api_r2p_unique: 'api_r2p_unique',
  api_hermes_sandbox: 'api_hermes_sandbox',
  api_hermes_production: 'api_hermes_production',
  api_e_contacts_sandbox: 'api_e_contacts_sandbox',
  api_e_contacts_production: 'api_e_contacts_production',
  api_opale_sandbox: 'api_opale_sandbox',
  api_opale_production: 'api_opale_production',
  api_mire_sandbox: 'api_mire_sandbox',
  api_mire_production: 'api_mire_production',
  api_ocfi_sandbox: 'api_ocfi_sandbox',
  api_ocfi_production: 'api_ocfi_production',
  api_e_pro_sandbox: 'api_e_pro_sandbox',
  api_e_pro_production: 'api_e_pro_production',
  api_robf_sandbox: 'api_robf_sandbox',
  api_robf_production: 'api_robf_production',
  api_cpr_pro_sandbox: 'api_cpr_pro_sandbox',
  api_cpr_pro_production: 'api_cpr_pro_production',
  api_infinoe_sandbox: 'api_infinoe_sandbox',
  api_infinoe_production: 'api_infinoe_production',
  api_ficoba_sandbox: 'api_ficoba_sandbox',
  api_ficoba_production: 'api_ficoba_production',
  api_ficoba_unique: 'api_ficoba_unique',
  api_droits_cnam: 'api_droits_cnam',
  le_taxi: 'le_taxi',
  cartobio: 'cartobio',
  api_service_national: 'api_service_national',
  api_tiers_de_prestation: 'api_tiers_de_prestation',
  api_pro_sante_connect: 'api_pro_sante_connect',
  api_declaration_auto_entrepreneur: 'api_declaration_auto_entrepreneur',
  api_indemnites_journalieres_cnam: 'api_indemnites_journalieres_cnam',
  api_declaration_cesu: 'api_declaration_cesu',
  api_histovec: 'api_histovec',
  api_prestations_sociales: 'api_prestations_sociales',
  api_prestations_sociales_fc: 'api_prestations_sociales_fc',
  api_ensu_documents_sandbox: 'api_ensu_documents_sandbox',
  api_ensu_documents_production: 'api_ensu_documents_production',
  api_ingres: 'api_ingres',
  api_statut_etudiant: 'api_statut_etudiant',
  api_statut_demandeur_emploi: 'api_statut_demandeur_emploi',
  api_captchetat: 'api_captchetat',
  api_statut_etudiant_boursier: 'api_statut_etudiant_boursier',
  api_scolarite: 'api_scolarite',
  api_indemnisation_pole_emploi: 'api_indemnisation_pole_emploi',
  agent_connect_fi: 'agent_connect_fi',
  agent_connect_fs: 'agent_connect_fs',
  api_satelit_sandbox: 'api_satelit_sandbox',
  api_satelit_production: 'api_satelit_production',
  api_sfip_sandbox: 'api_sfip_sandbox',
  api_sfip_production: 'api_sfip_production',
  api_sfip_unique: 'api_sfip_unique',
};

export const DATA_PROVIDER_CONFIGURATIONS: Record<
  string,
  DataProviderConfiguration
> = {
  [TargetAPI.aidants_connect]: {
    label: 'Aidants Connect',
    icon: 'aidants-connect_logo.png',
    email: 'contact@aidantsconnect.beta.gouv.fr',
    type: DataProviderType.service,
    component: AidantsConnect,
  },
  [TargetAPI.hubee_portail]: {
    label: 'Portail HubEE - Démarche CertDC',
    icon: 'logo-hubee.png',
    email: 'dgs-certdc@sante.gouv.fr',
    type: DataProviderType.service,
    component: HubeePortail,
    url: 'https://portail.hubee.numerique.gouv.fr/',
  },
  [TargetAPI.hubee_portail_dila]: {
    label: 'Portail HubEE - Démarches DILA',
    icon: 'logo-hubee.png',
    email: 'support.partenaires@service-public.fr',
    type: DataProviderType.service,
    component: HubeePortailDila,
    url: 'https://portail.hubee.numerique.gouv.fr/',
  },
  [TargetAPI.franceconnect]: {
    label: 'FranceConnect',
    icon: 'logo-fc-with-label.png',
    email: 'support.partenaires@franceconnect.gouv.fr',
    type: DataProviderType.api,
    component: FranceConnect,
  },
  [TargetAPI.api_entreprise]: {
    label: 'API Entreprise',
    icon: null,
    email: 'support@entreprise.api.gouv.fr',
    type: DataProviderType.api,
    component: ApiEntreprise,
    url: 'https://entreprise.api.gouv.fr/compte',
  },
  [TargetAPI.api_impot_particulier_sandbox]: {
    label: 'API Impôt particulier (Bac à sable)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiImpotParticulierSandbox,
  },
  [TargetAPI.api_impot_particulier_production]: {
    label: 'API Impôt particulier (Production)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiImpotParticulierProduction,
  },
  [TargetAPI.api_impot_particulier_unique]: {
    label: 'API Impôt particulier (Formulaire Unique)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiImpotParticulierUnique,
  },
  [TargetAPI.api_impot_particulier_fc_sandbox]: {
    label: 'API Impôt particulier (FC) (Bac à sable)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiImpotParticulierFcSandbox,
  },
  [TargetAPI.api_impot_particulier_fc_production]: {
    label: 'API Impôt particulier (FC) (Production)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiImpotParticulierFcProduction,
  },
  [TargetAPI.api_impot_particulier_fc_unique]: {
    label: 'API Impôt particulier (FC) (Formulaire Unique)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiImpotParticulierFcUnique,
  },
  [TargetAPI.api_r2p_sandbox]: {
    label: 'API R2P (Bac à sable)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiR2PSandbox,
  },
  [TargetAPI.api_r2p_production]: {
    label: 'API R2P (Production)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiR2PProduction,
  },
  [TargetAPI.api_r2p_unique]: {
    label: 'API R2P (Formulaire Unique)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiR2PUnique,
  },
  [TargetAPI.api_hermes_sandbox]: {
    label: 'API Hermes (Bac à sable)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiHermesSandbox,
  },
  [TargetAPI.api_hermes_production]: {
    label: 'API Hermes (Production)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiHermesProduction,
  },
  [TargetAPI.api_e_contacts_sandbox]: {
    label: 'API E-Contacts (Bac à sable)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiEContactsSandbox,
  },
  [TargetAPI.api_e_contacts_production]: {
    label: 'API E-Contacts (Production)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiEContactsProduction,
  },
  [TargetAPI.api_opale_sandbox]: {
    label: 'API OPALE (Bac à sable)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiOpaleSandbox,
  },
  [TargetAPI.api_opale_production]: {
    label: 'API OPALE (Production)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiOpaleProduction,
  },
  [TargetAPI.api_mire_sandbox]: {
    label: 'API MIRE (Bac à sable)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiMireSandbox,
  },
  [TargetAPI.api_mire_production]: {
    label: 'API MIRE (Production)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiMireProduction,
  },
  [TargetAPI.api_ocfi_sandbox]: {
    label: 'API OCFI (Bac à sable)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiOcfiSandbox,
  },
  [TargetAPI.api_ocfi_production]: {
    label: 'API OCFI (Production)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiOcfiProduction,
  },
  [TargetAPI.api_e_pro_sandbox]: {
    label: 'API E-PRO (Bac à sable)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiEProSandbox,
  },
  [TargetAPI.api_e_pro_production]: {
    label: 'API E-PRO (Production)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiEProProduction,
  },
  [TargetAPI.api_robf_sandbox]: {
    label: 'API ROBF (Bac à sable)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiRobfSandbox,
  },
  [TargetAPI.api_robf_production]: {
    label: 'API ROBF (Production)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiRobfProduction,
  },
  [TargetAPI.api_cpr_pro_sandbox]: {
    label: 'API CPR PRO - ADELIE (Bac à sable)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiCprProSandbox,
  },
  [TargetAPI.api_cpr_pro_production]: {
    label: 'API CPR PRO - ADELIE (Production)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiCprProProduction,
  },
  [TargetAPI.api_infinoe_sandbox]: {
    label: 'API INFINOE (Bac à sable)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiInfinoeSandbox,
  },
  [TargetAPI.api_infinoe_production]: {
    label: 'API INFINOE (Production)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiInfinoeProduction,
  },
  [TargetAPI.api_ficoba_sandbox]: {
    label: 'API FICOBA (Bac à sable)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiFicobaSandbox,
  },
  [TargetAPI.api_ficoba_production]: {
    label: 'API FICOBA (Production)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiFicobaProduction,
  },
  [TargetAPI.api_ficoba_unique]: {
    label: 'API FICOBA (Formulaire Unique)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiFicobaUnique,
  },
  [TargetAPI.api_droits_cnam]: {
    label: 'API Droits CNAM',
    icon: 'logo-cnam.jpg',
    email: 'partenaires-api-ameli.cnam@assurance-maladie.fr',
    type: DataProviderType.api,
    component: ApiDroitsCnam,
  },
  [TargetAPI.le_taxi]: {
    label: 'API le.Taxi',
    icon: 'logo-le.taxi.svg',
    email: 'equipe@le.taxi',
    type: DataProviderType.api,
    component: LeTaxi,
  },
  [TargetAPI.cartobio]: {
    label: 'CartoBio - Territoires',
    icon: 'logo-cartobio-text.svg',
    email: 'cartobio@beta.gouv.fr',
    type: DataProviderType.api,
    component: CartoBio,
  },
  [TargetAPI.api_service_national]: {
    label: 'API Service National',
    icon: null,
    email: 'dsnj-api.contact.fct@intradef.gouv.fr',
    type: DataProviderType.api,
    component: ApiServiceNational,
  },
  [TargetAPI.api_tiers_de_prestation]: {
    label: 'API Tiers de prestation',
    icon: 'logo-urssaf.png',
    email: 'habilitation-api@urssaf.fr',
    type: DataProviderType.api,
    component: ApiTiersDePrestation,
  },
  [TargetAPI.api_pro_sante_connect]: {
    label: 'API Pro Santé Connect',
    icon: 'logo-ans.png',
    email: 'prosanteconnect.editeurs@esante.gouv.fr',
    type: DataProviderType.api,
    component: ApiProSanteConnect,
  },
  [TargetAPI.api_declaration_auto_entrepreneur]: {
    label: 'API Tierce Déclaration auto-entrepreneur',
    icon: 'logo-urssaf.png',
    email: 'contact.tiercedeclaration@urssaf.fr',
    type: DataProviderType.api,
    component: ApiDeclarationAutoEntrepreneur,
  },
  [TargetAPI.api_indemnites_journalieres_cnam]: {
    label: 'API Indemnités Journalières (CNAM)',
    icon: 'logo-cnam.jpg',
    email: 'partenaires-api-ameli.cnam@assurance-maladie.fr',
    type: DataProviderType.api,
    component: ApiIndemnitesJournalieresCnam,
  },
  [TargetAPI.api_declaration_cesu]: {
    label: 'API Tierce Déclaration CESU',
    icon: 'logo-urssaf.png',
    email: 'habilitation-api@urssaf.fr',
    type: DataProviderType.api,
    component: ApiDeclarationCesu,
  },
  [TargetAPI.api_histovec]: {
    label: 'API Historique d’un véhicule',
    icon: 'logo-minint.png',
    email: null,
    type: DataProviderType.api,
    component: ApiHistovec,
  },
  [TargetAPI.api_prestations_sociales]: {
    label: 'API prestations sociales',
    icon: null,
    email: 'contact@apisecu.fr',
    type: DataProviderType.api,
    component: ApiPrestationsSociales,
  },
  [TargetAPI.api_prestations_sociales_fc]: {
    label: 'API prestations sociales (FC)',
    icon: null,
    email: null,
    type: DataProviderType.api,
    component: ApiPrestationsSocialesFc,
  },
  [TargetAPI.api_ensu_documents_sandbox]: {
    label: 'API ENSU Documents (Bac à sable)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiEnsuDocumentsSandbox,
  },
  [TargetAPI.api_ensu_documents_production]: {
    label: 'API ENSU Documents (Production)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiEnsuDocumentsProduction,
  },
  [TargetAPI.api_ingres]: {
    label: 'API INGRES',
    icon: null,
    email: 'api.cisirh@finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiIngres,
  },
  [TargetAPI.api_statut_etudiant]: {
    label: 'API Statut étudiant',
    icon: 'logo-mesri.png',
    email: 'support-statutetudiant@renater.fr',
    type: DataProviderType.api,
    component: ApiStatutEtudiant,
  },
  [TargetAPI.api_statut_demandeur_emploi]: {
    label: 'API statut demandeur d’emploi',
    icon: 'logo-pole-emploi.png',
    email: 'support@pole-emploi.io',
    type: DataProviderType.api,
    component: ApiStatutDemandeurEmploi,
  },
  [TargetAPI.api_captchetat]: {
    label: 'API CaptchEtat',
    icon: 'logo-aife.png',
    email: 'piste.aife@finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiCaptchetat,
  },
  [TargetAPI.api_statut_etudiant_boursier]: {
    label: 'API Statut étudiant boursier',
    icon: 'logo-cnous.png',
    email: 'api-boursier@cnous.fr',
    type: DataProviderType.api,
    component: ApiStatutEtudiantBoursier,
  },
  [TargetAPI.api_scolarite]: {
    label: 'API Scolarité',
    icon: 'logo-menj.png',
    email: 'api-sco-eleve_contacts@education.gouv.fr',
    type: DataProviderType.api,
    component: ApiScolarite,
  },
  [TargetAPI.api_indemnisation_pole_emploi]: {
    label: 'API Indemnisation Pôle emploi',
    icon: 'logo-pole-emploi.png',
    email: 'support@pole-emploi.io',
    type: DataProviderType.api,
    component: ApiIndemnisationPoleEmploi,
  },
  [TargetAPI.agent_connect_fi]: {
    label: 'AgentConnect - fournisseur d’identité',
    icon: 'logo-agentconnect.png',
    email: 'support.partenaires@agentconnect.gouv.fr',
    type: DataProviderType.api,
    component: AgentConnectFi,
  },
  [TargetAPI.agent_connect_fs]: {
    label: 'AgentConnect - fournisseur de service',
    icon: 'logo-agentconnect.png',
    email: 'support.partenaires@agentconnect.gouv.fr',
    type: DataProviderType.api,
    component: AgentConnectFs,
  },
  [TargetAPI.api_satelit_sandbox]: {
    label: 'API Satelit (Bac à sable)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiSatelitSandbox,
  },
  [TargetAPI.api_satelit_production]: {
    label: 'API Satelit (Production)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiSatelitProduction,
  },
  [TargetAPI.api_sfip_sandbox]: {
    label: 'API Courtier fonctionnel SFiP (Bac à sable)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiSfipSandbox,
  },
  [TargetAPI.api_sfip_production]: {
    label: 'API Courtier fonctionnel SFiP (Production)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiSfipProduction,
  },
  [TargetAPI.api_sfip_unique]: {
    label: 'API Courtier fonctionnel SFiP (Formulaire Unique)',
    icon: 'logo-dgfip-with-label.png',
    email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
    type: DataProviderType.api,
    component: ApiSfipUnique,
  },
};

export const HIDDEN_DATA_PROVIDER_KEYS = [
  'api_hermes_sandbox',
  'api_hermes_production',
  'api_e_contacts_sandbox',
  'api_e_contacts_production',
  'api_opale_sandbox',
  'api_opale_production',
  'api_mire_sandbox',
  'api_mire_production',
  'api_ocfi_sandbox',
  'api_ocfi_production',
  'api_e_pro_sandbox',
  'api_e_pro_production',
  'api_robf_sandbox',
  'api_robf_production',
  'api_cpr_pro_sandbox',
  'api_cpr_pro_production',
  'api_infinoe_sandbox',
  'api_infinoe_production',
  'api_sfip_sandbox',
  'api_sfip_production',
  'api_sfip_unique',
];

// Centralise this 2 Const for Login Page and WelcomeMessageRouter

export const APISDGFIP = [
  'api_impot_particulier_sandbox',
  'api_impot_particulier_production',
  'api_impot_particulier_unique',
  'api_r2p_sandbox',
  'api_r2p_production',
  'api_r2p_unique',
  'api_hermes_sandbox',
  'api_hermes_production',
  'api_e_contacts_sandbox',
  'api_e_contacts_production',
  'api_opale_sandbox',
  'api_opale_production',
  'api_mire_sandbox',
  'api_mire_production',
  'api_ocfi_sandbox',
  'api_ocfi_production',
  'api_e_pro_sandbox',
  'api_e_pro_production',
  'api_robf_sandbox',
  'api_robf_production',
  'api_cpr_pro_sandbox',
  'api_cpr_pro_production',
  'api_infinoe_sandbox',
  'api_infinoe_production',
  'api_ficoba_sandbox',
  'api_ficoba_production',
  'api_ficoba_unique',
  'api_ensu_documents_sandbox',
  'api_ensu_documents_production',
  'api_satelit_sandbox',
  'api_satelit_production',
  'api_sfip_sandbox',
  'api_sfip_production',
  'api_sfip_unique',
];

export const APISFRANCECONNECTED = [
  'api_impot_particulier_fc_sandbox',
  'api_impot_particulier_fc_production',
  'api_droits_cnam',
  'api_prestations_sociales',
  'api_statut_etudiant',
  'api_statut_demandeur_emploi',
  'api_statut_etudiant_boursier',
  'api_indemnisation_pole_emploi',
];
