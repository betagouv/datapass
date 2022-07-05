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
import ApiParticulier from '../pages/ApiParticulier';
import ApiPrestationsSociales from '../pages/ApiPrestationsSociales';
import ApiPrestationsSocialesFc from '../pages/ApiPrestationsSocialesFc';
import ApiProSanteConnect from '../pages/ApiProSanteConnect';
import ApiServiceNational from '../pages/ApiServiceNational';
import ApiStatutDemandeurEmploi from '../pages/ApiStatutDemandeurEmploi';
import ApiStatutEtudiant from '../pages/ApiStatutEtudiant';
import ApiStatutEtudiantBoursier from '../pages/ApiStatutEtudiantBoursier';
import ApiSystemeImmatriculationVehicules from '../pages/ApiSystemeImmatriculationVehicules';
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
import ApiFicobaSandbox from '../pages/DgfipPages/ApiFicobaSandbox';
import ApiHermesProduction from '../pages/DgfipPages/ApiHermesProduction';
import ApiHermesSandbox from '../pages/DgfipPages/ApiHermesSandbox';
import ApiImpotParticulierFcProduction from '../pages/DgfipPages/ApiImpotParticulierFcProduction';
import ApiImpotParticulierFcSandbox from '../pages/DgfipPages/ApiImpotParticulierFcSandbox';
import ApiImpotParticulierProduction from '../pages/DgfipPages/ApiImpotParticulierProduction';
import ApiImpotParticulierSandbox from '../pages/DgfipPages/ApiImpotParticulierSandbox';
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
import ApiRobfProduction from '../pages/DgfipPages/ApiRobfProduction';
import ApiRobfSandbox from '../pages/DgfipPages/ApiRobfSandbox';
import FranceConnect from '../pages/FranceConnect';
import HubeePortail from '../pages/HubeePortail';
import HubeePortailDila from '../pages/HubeePortailDila';
import LeTaxi from '../pages/LeTaxi';
import ApiDeclarationAutoEntrepreneur from '../pages/UrssafPages/ApiDeclarationAutoEntrepreneur';
import ApiDeclarationCesu from '../pages/UrssafPages/ApiDeclarationCesu';
import ApiTiersDePrestation from '../pages/UrssafPages/ApiTiersDePrestation';

type DataProviderParameter = {
  label: string;
  icon: string | null;
  email: string | null;
  component: React.FC;
};

export const DATA_PROVIDER_PARAMETERS: { [k: string]: DataProviderParameter } =
  {
    aidants_connect: {
      label: 'Aidants Connect',
      icon: 'aidants-connect_logo.png',
      email: 'contact@aidantsconnect.beta.gouv.fr',
      component: AidantsConnect,
    },
    hubee_portail: {
      label: 'Portail HubEE - Démarche CertDC',
      icon: 'logo-hubee.png',
      email: 'dgs-certdc@sante.gouv.fr',
      component: HubeePortail,
    },
    hubee_portail_dila: {
      label: 'Portail HubEE - Démarches DILA',
      icon: 'logo-hubee.png',
      email: 'support.partenaires@service-public.fr',
      component: HubeePortailDila,
    },
    franceconnect: {
      label: 'FranceConnect',
      icon: 'logo-fc-with-label.png',
      email: 'support.partenaires@franceconnect.gouv.fr',
      component: FranceConnect,
    },
    api_particulier: {
      label: 'API Particulier',
      icon: 'logo-beta-gouv.svg',
      email: 'contact@particulier.api.gouv.fr',
      component: ApiParticulier,
    },
    api_entreprise: {
      label: 'API Entreprise',
      icon: null,
      email: 'support@entreprise.api.gouv.fr',
      component: ApiEntreprise,
    },
    api_impot_particulier_sandbox: {
      label: 'API Impôt particulier (Bac à sable)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      component: ApiImpotParticulierSandbox,
    },
    api_impot_particulier_production: {
      label: 'API Impôt particulier (Production)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      component: ApiImpotParticulierProduction,
    },
    api_impot_particulier_fc_sandbox: {
      label: 'API Impôt particulier (FC) (Bac à sable)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      component: ApiImpotParticulierFcSandbox,
    },
    api_impot_particulier_fc_production: {
      label: 'API Impôt particulier (FC) (Production)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      component: ApiImpotParticulierFcProduction,
    },
    api_r2p_sandbox: {
      label: 'API R2P (Bac à sable)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      component: ApiR2PSandbox,
    },
    api_r2p_production: {
      label: 'API R2P (Production)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      component: ApiR2PProduction,
    },
    api_hermes_sandbox: {
      label: 'API Hermes (Bac à sable)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      component: ApiHermesSandbox,
    },
    api_hermes_production: {
      label: 'API Hermes (Production)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      component: ApiHermesProduction,
    },
    api_e_contacts_sandbox: {
      label: 'API E-Contacts (Bac à sable)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      component: ApiEContactsSandbox,
    },
    api_e_contacts_production: {
      label: 'API E-Contacts (Production)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      component: ApiEContactsProduction,
    },
    api_opale_sandbox: {
      label: 'API OPALE (Bac à sable)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      component: ApiOpaleSandbox,
    },
    api_opale_production: {
      label: 'API OPALE (Production)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      component: ApiOpaleProduction,
    },
    api_mire_sandbox: {
      label: 'API MIRE (Bac à sable)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      component: ApiMireSandbox,
    },
    api_mire_production: {
      label: 'API MIRE (Production)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      component: ApiMireProduction,
    },
    api_ocfi_sandbox: {
      label: 'API OCFI (Bac à sable)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      component: ApiOcfiSandbox,
    },
    api_ocfi_production: {
      label: 'API OCFI (Production)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      component: ApiOcfiProduction,
    },
    api_e_pro_sandbox: {
      label: 'API E-PRO (Bac à sable)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      component: ApiEProSandbox,
    },
    api_e_pro_production: {
      label: 'API E-PRO (Production)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      component: ApiEProProduction,
    },
    api_robf_sandbox: {
      label: 'API ROBF (Bac à sable)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      component: ApiRobfSandbox,
    },
    api_robf_production: {
      label: 'API ROBF (Production)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      component: ApiRobfProduction,
    },
    api_cpr_pro_sandbox: {
      label: 'API CPR PRO - ADELIE (Bac à sable)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      component: ApiCprProSandbox,
    },
    api_cpr_pro_production: {
      label: 'API CPR PRO - ADELIE (Production)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      component: ApiCprProProduction,
    },
    api_infinoe_sandbox: {
      label: 'API INFINOE (Bac à sable)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      component: ApiInfinoeSandbox,
    },
    api_infinoe_production: {
      label: 'API INFINOE (Production)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      component: ApiInfinoeProduction,
    },
    api_ficoba_sandbox: {
      label: 'API FICOBA (Bac à sable)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      component: ApiFicobaSandbox,
    },
    api_ficoba_production: {
      label: 'API FICOBA (Production)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      component: ApiFicobaProduction,
    },
    api_droits_cnam: {
      label: 'API Droits CNAM',
      icon: 'logo-cnam.jpg',
      email: 'partenaires-api-ameli.cnam@assurance-maladie.fr',
      component: ApiDroitsCnam,
    },
    le_taxi: {
      label: 'API le.Taxi',
      icon: 'logo-le.taxi.svg',
      email: 'equipe@le.taxi',
      component: LeTaxi,
    },
    cartobio: {
      label: 'CartoBio - Territoires',
      icon: 'logo-cartobio-text.svg',
      email: 'cartobio@beta.gouv.fr',
      component: CartoBio,
    },
    api_service_national: {
      label: 'API Service National',
      icon: null,
      email: 'dsnj-api.contact.fct@intradef.gouv.fr',
      component: ApiServiceNational,
    },
    api_tiers_de_prestation: {
      label: 'API Tiers de prestation',
      icon: 'logo-urssaf.png',
      email: 'habilitation-api@urssaf.fr',
      component: ApiTiersDePrestation,
    },
    api_pro_sante_connect: {
      label: 'API Pro Santé Connect',
      icon: 'logo-ans.png',
      email: 'prosanteconnect.editeurs@esante.gouv.fr',
      component: ApiProSanteConnect,
    },
    api_declaration_auto_entrepreneur: {
      label: 'API Tierce Déclaration auto-entrepreneur',
      icon: 'logo-urssaf.png',
      email: 'contact.tiercedeclaration@urssaf.fr',
      component: ApiDeclarationAutoEntrepreneur,
    },
    api_indemnites_journalieres_cnam: {
      label: 'API Indemnités Journalières (CNAM)',
      icon: 'logo-cnam.jpg',
      email: 'partenaires-api-ameli.cnam@assurance-maladie.fr',
      component: ApiIndemnitesJournalieresCnam,
    },
    api_systeme_immatriculation_vehicules: {
      label: 'API Système d’Immatriculation des Véhicules',
      icon: null,
      email: null,
      component: ApiSystemeImmatriculationVehicules,
    },
    api_declaration_cesu: {
      label: 'API Tierce Déclaration CESU',
      icon: 'logo-urssaf.png',
      email: 'habilitation-api@urssaf.fr',
      component: ApiDeclarationCesu,
    },
    api_histovec: {
      label: 'API Historique d’un véhicule',
      icon: 'logo-minint.png',
      email: null,
      component: ApiHistovec,
    },
    api_prestations_sociales: {
      label: 'API prestations sociales',
      icon: null,
      email: 'contact@apisecu.fr',
      component: ApiPrestationsSociales,
    },
    api_prestations_sociales_fc: {
      label: 'API prestations sociales (FC)',
      icon: null,
      email: null,
      component: ApiPrestationsSocialesFc,
    },
    api_ensu_documents_sandbox: {
      label: 'API ENSU Documents (Bac à sable)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      component: ApiEnsuDocumentsSandbox,
    },
    api_ensu_documents_production: {
      label: 'API ENSU Documents (Production)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      component: ApiEnsuDocumentsProduction,
    },
    api_ingres: {
      label: 'API INGRES',
      icon: null,
      email: 'api.cisirh@finances.gouv.fr',
      component: ApiIngres,
    },
    api_statut_etudiant: {
      label: 'API Statut étudiant',
      icon: 'logo-mesri.png',
      email: 'support-statutetudiant@renater.fr',
      component: ApiStatutEtudiant,
    },
    api_statut_demandeur_emploi: {
      label: 'API statut demandeur d’emploi',
      icon: 'logo-pole-emploi.png',
      email: 'support@pole-emploi.io',
      component: ApiStatutDemandeurEmploi,
    },
    api_captchetat: {
      label: 'API CaptchEtat',
      icon: 'logo-aife.png',
      email: 'piste.aife@finances.gouv.fr',
      component: ApiCaptchetat,
    },
    api_statut_etudiant_boursier: {
      label: 'API Statut étudiant boursier',
      icon: 'logo-cnous.png',
      email: 'api-boursier@cnous.fr',
      component: ApiStatutEtudiantBoursier,
    },
    api_indemnisation_pole_emploi: {
      label: 'API Indemnisation Pôle emploi',
      icon: 'logo-pole-emploi.png',
      email: 'support@pole-emploi.io',
      component: ApiIndemnisationPoleEmploi,
    },
    agent_connect_fi: {
      label: 'AgentConnect - fournisseur d’identité',
      icon: 'logo-agentconnect.png',
      email: 'support.partenaires@agentconnect.gouv.fr',
      component: AgentConnectFi,
    },
    agent_connect_fs: {
      label: 'AgentConnect - fournisseur de service',
      icon: 'logo-agentconnect.png',
      email: 'support.partenaires@agentconnect.gouv.fr',
      component: AgentConnectFs,
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
];
