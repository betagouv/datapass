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

enum DataProviderType {
  api = 'api',
  service = 'service',
}

type DataProviderParameter = {
  label: string;
  icon: string | null;
  email: string | null;
  type: DataProviderType;
  component?: React.FC;
  formConfiguration?: any;
};

export const DATA_PROVIDER_PARAMETERS: { [k: string]: DataProviderParameter } =
  {
    aidants_connect: {
      label: 'Aidants Connect',
      icon: 'aidants-connect_logo.png',
      email: 'contact@aidantsconnect.beta.gouv.fr',
      type: DataProviderType.service,
      component: AidantsConnect,
    },
    hubee_portail: {
      label: 'Portail HubEE - Démarche CertDC',
      icon: 'logo-hubee.png',
      email: 'dgs-certdc@sante.gouv.fr',
      type: DataProviderType.service,
      component: HubeePortail,
    },
    hubee_portail_dila: {
      label: 'Portail HubEE - Démarches DILA',
      icon: 'logo-hubee.png',
      email: 'support.partenaires@service-public.fr',
      type: DataProviderType.service,
      component: HubeePortailDila,
    },
    franceconnect: {
      label: 'FranceConnect',
      icon: 'logo-fc-with-label.png',
      email: 'support.partenaires@franceconnect.gouv.fr',
      type: DataProviderType.api,
      component: FranceConnect,
    },
    api_particulier: {
      label: 'API Particulier',
      icon: 'logo-beta-gouv.svg',
      email: 'contact@particulier.api.gouv.fr',
      type: DataProviderType.api,
      component: ApiParticulier,
      formConfiguration: {
        scopes: [
          {
            value: 'dgfip_declarant1_nom',
            label: 'Nom',
            groupTitle: 'DGFIP - État civil - déclarant 1',
          },
          {
            value: 'dgfip_declarant1_nom_naissance',
            label: 'Nom de naissance',
            groupTitle: 'DGFIP - État civil - déclarant 1',
          },
          {
            value: 'dgfip_declarant1_prenoms',
            label: 'Prénom(s)',
            groupTitle: 'DGFIP - État civil - déclarant 1',
          },
          {
            value: 'dgfip_declarant1_date_naissance',
            label: 'Date de naissance',
            groupTitle: 'DGFIP - État civil - déclarant 1',
          },
          {
            value: 'dgfip_declarant2_nom',
            label: 'Nom',
            groupTitle: 'DGFIP - État civil - déclarant 2',
          },
          {
            value: 'dgfip_declarant2_nom_naissance',
            label: 'Nom de naissance',
            groupTitle: 'DGFIP - État civil - déclarant 2',
          },
          {
            value: 'dgfip_declarant2_prenoms',
            label: 'Prénom(s)',
            groupTitle: 'DGFIP - État civil - déclarant 2',
          },
          {
            value: 'dgfip_declarant2_date_naissance',
            label: 'Date de naissance',
            groupTitle: 'DGFIP - État civil - déclarant 2',
          },
          {
            value: 'dgfip_date_recouvrement',
            label: 'Date de recouvrement',
            groupTitle: 'DGFIP - Échéances de l’avis d’imposition',
          },
          {
            value: 'dgfip_date_etablissement',
            label: "Date d'établissement",
            groupTitle: 'DGFIP - Échéances de l’avis d’imposition',
          },
          {
            value: 'dgfip_adresse_fiscale_taxation',
            label: 'Adresse',
            groupTitle: 'DGFIP - Situation du foyer fiscal',
          },
          {
            value: 'dgfip_adresse_fiscale_annee',
            label: 'Année de déclaration',
            groupTitle: 'DGFIP - Situation du foyer fiscal',
          },
          {
            value: 'dgfip_nombre_parts',
            label: 'Nombre de parts',
            groupTitle: 'DGFIP - Situation du foyer fiscal',
          },
          {
            value: 'dgfip_nombre_personnes_a_charge',
            label: 'Nombre de personnes à charge',
            groupTitle: 'DGFIP - Situation du foyer fiscal',
          },
          {
            value: 'dgfip_situation_familiale',
            label: 'Situation de famille',
            groupTitle: 'DGFIP - Situation du foyer fiscal',
            helper: '(marié, pacsé, célibataire, veuf divorcé)',
          },
          {
            value: 'dgfip_revenu_brut_global',
            label: 'Revenu brut global',
            groupTitle: 'DGFIP - Agrégats fiscaux',
          },
          {
            value: 'dgfip_revenu_imposable',
            label: 'Revenu imposable',
            groupTitle: 'DGFIP - Agrégats fiscaux',
          },
          {
            value: 'dgfip_impot_revenu_net_avant_corrections',
            label: 'Impôt sur le revenu net avant corrections',
            groupTitle: 'DGFIP - Agrégats fiscaux',
          },
          {
            value: 'dgfip_montant_impot',
            label: "Montant de l'impôt",
            groupTitle: 'DGFIP - Agrégats fiscaux',
          },
          {
            value: 'dgfip_revenu_fiscal_reference',
            label: 'Revenu fiscal de référence',
            groupTitle: 'DGFIP - Agrégats fiscaux',
          },
          {
            value: 'dgfip_annee_impot',
            label: "Année de l'impôt",
            groupTitle: 'DGFIP - Agrégats fiscaux',
          },
          {
            value: 'dgfip_annee_revenus',
            label: 'Année des revenus',
            groupTitle: 'DGFIP - Agrégats fiscaux',
          },
          {
            value: 'dgfip_erreur_correctif',
            label: 'Erreur correctif',
            groupTitle: 'DGFIP - Compléments',
            helper:
              'Indique si un correctif plus récent que l’avis recherché est disponible.',
          },
          {
            value: 'dgfip_situation_partielle',
            label: 'Situation partielle',
            groupTitle: 'DGFIP - Compléments',
            helper:
              'Dans un foyer marié ou pacsé, quand décès d’un des contribuable, affiche les données de l’avis avec l’indication « situation partielle ». Donc, il faut les références de l’autre avis pour le consulter.',
          },
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
            helper:
              'Données concernant l’inscription de la personne à Pôle Emploi',
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
            helper:
              'Limite la recherche aux seuls étudiants admis (non-inscrits).',
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
        ],
        editorList: [
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
          { name: 'JVS', siret: '32855218700069' },
          { name: '3D Ouest', siret: '44973625500018' },
          { name: 'Entrouvert', siret: '49108189900032' },
          { name: 'Waigeo', siret: '80321944300014' },
          { name: 'AFI', siret: '32275019100031' },
          { name: 'Arche MC2', siret: '38251931200088' },
          {
            name: 'Société d’assistance et gestion du stationnement (SAGS)',
            siret: '38933781700065',
          },
        ],
        demarches: {
          default: {
            label: 'Demande Libre',
            about: 'https://api.gouv.fr/les-api/api-particulier',
            state: {
              intitule: '',
              description: '',
              data_recipients: '',
              data_retention_period: '',
              fondement_juridique_title: '',
              fondement_juridique_url: '',
              scopes: {
                dgfip_declarant1_nom: false,
                dgfip_declarant1_nom_naissance: false,
                dgfip_declarant1_prenoms: false,
                dgfip_declarant1_date_naissance: false,
                dgfip_declarant2_nom: false,
                dgfip_declarant2_nom_naissance: false,
                dgfip_declarant2_prenoms: false,
                dgfip_declarant2_date_naissance: false,
                dgfip_date_recouvrement: false,
                dgfip_date_etablissement: false,
                dgfip_adresse_fiscale_taxation: false,
                dgfip_adresse_fiscale_annee: false,
                dgfip_nombre_parts: false,
                dgfip_nombre_personnes_a_charge: false,
                dgfip_situation_familiale: false,
                dgfip_revenu_brut_global: false,
                dgfip_revenu_imposable: false,
                dgfip_impot_revenu_net_avant_corrections: false,
                dgfip_montant_impot: false,
                dgfip_revenu_fiscal_reference: false,
                dgfip_annee_impot: false,
                dgfip_annee_revenus: false,
                dgfip_erreur_correctif: false,
                dgfip_situation_partielle: false,
                cnaf_quotient_familial: false,
                cnaf_allocataires: false,
                cnaf_enfants: false,
                cnaf_adresse: false,
                pole_emploi_identite: false,
                pole_emploi_contact: false,
                pole_emploi_adresse: false,
                pole_emploi_inscription: false,
                mesri_identifiant: false,
                mesri_identite: false,
                mesri_inscription_etudiant: false,
                mesri_inscription_autre: false,
                mesri_admission: false,
                mesri_etablissements: false,
                cnous_statut_boursier: false,
                cnous_echelon_bourse: false,
                cnous_email: false,
                cnous_periode_versement: false,
                cnous_statut_bourse: false,
                cnous_ville_etudes: false,
                cnous_identite: false,
              },
            },
            team_members: {
              responsable_technique: {
                given_name: '',
                family_name: '',
                job: '',
                email: '',
                phone_number: '',
              },
            },
          },
          abelium: {
            label:
              'Domino web 2.0, Tarification services municipaux / Portail Famille, Données CNAF',
            about: 'https://api.gouv.fr/guides/portail-famille-tarification',
            state: {
              intitule:
                'Service Périscolaire, Restauration Scolaire, Extrascolaire, Accueil des loisirs',
              description:
                "Le logiciel Domino 'Web 2.0 permet la facturation des prestations pour les services suivants : périscolaire (par exemple : tarifs garderie matin, soir, etc.), restauration (par exemple : tarif repas enfant et adulte), centres de loisirs (par exemple : tarif demi-journée ou journée ALSH, etc.), jeunesse (par exemple : tarif journée, tarif activité, etc.), petite enfance (tarif d'accueil horaire) et temps libre (école d'art, école de danse et de musique). Le calcul du montant des prestations est réalisé selon un ou plusieurs critères suivants : revenu déclaré du foyer, quotient familial du foyer, nombre d'enfants à charge et /ou nombre total d'enfants. Abelium Collectivités accompagne le demandeur lors de la mise en place de la demande des informations sur l'application API particulier.",
              data_recipients: 'Agents du service',
              data_retention_period: 60,
              fondement_juridique_title:
                "L'article L114-8 du code des relations entre le public et l'administration fixe le cadre général des échanges de données au sein de l'administration. En tant que collectivité territoriale, la délibération ci-jointe précise l'objet du téléservice, selon l'arrêté du 04/07/13 sur les téléservices, et précise les données nécessaires à son fonctionnement",
              technical_team_type: 'software_company',
              technical_team_value: '42172024400050',
              scopes: {
                cnaf_quotient_familial: true,
                cnaf_allocataires: false,
                cnaf_enfants: false,
                cnaf_adresse: false,
              },
            },
            team_members: {
              responsable_technique: {
                given_name: 'Marina',
                family_name: 'MOROZOVA',
                job: 'Support client',
                email: 'marina.morozova@abelium.fr',
                phone_number: '0000000000',
              },
            },
          },
          'agora-plus': {
            label:
              'Agora Famille Premium, Tarification services municipaux / Portail Famille, Données CNAF',
            about: 'https://api.gouv.fr/guides/portail-famille-tarification',
            state: {
              intitule:
                "Dématérialisation du calcul du quotient/taux d'effort pour les structures gérés par les administrations/collectivités (petite enfance, enfance, jeunesse et adultes)",
              description:
                'Cette démarche auprès des administrés nous permettra de récupérer les éléments nécessaires à appliquer pour le calcul des tarifs des différentes prestations.\r\n  - Cette démarche auprès des administrés nous permettra de récupérer les éléments nécessaires à appliquer pour le calcul des tarifs des différentes prestations.\r\n  - Les allocataires\r\n  - Les revenus déclarés aux différents organisme\r\n  - Adresse du foyer\r\n Nous sommes accompagnés par Agora.',
              data_recipients: 'Adresse du foyer',
              data_retention_period: 12,
              fondement_juridique_title:
                "L'article L114-8 du code des relations entre le public et l'administration fixe le cadre général des échanges de données au sein de l'administration. En tant que collectivité territoriale, la délibération ci-jointe précise l'objet du téléservice, selon l'arrêté du 04/07/13 sur les téléservices, et précise les données nécessaires à son fonctionnement",
              technical_team_type: 'software_company',
              technical_team_value: '48017088500010',
              scopes: {
                cnaf_quotient_familial: true,
                cnaf_allocataires: true,
                cnaf_enfants: true,
                cnaf_adresse: true,
              },
            },
            team_members: {
              responsable_technique: {
                email: 'projet@agoraplus.fr',
                phone_number: '0184160095',
              },
            },
          },
          'amiciel-malice': {
            label:
              'Malice, Tarification services municipaux / Portail Famille, Données CNAF et DGFIP',
            about: 'https://api.gouv.fr/guides/portail-famille-tarification',
            state: {
              intitule:
                "Récupération des données de la famille pour l'inscription et la facturation en crèche, cantine, périscolaire, extrascolaire, transports scolaires",
              description:
                "La collectivité utilisera les API Particulier dans les cas suivants :\r\n- Lors de l'inscription d'une nouvelle famille sur le portail familles : la famille pourra choisir le remplissage des informations déjà connues (Dites-le nous une fois).\r\n- Lors de l'inscription ou actualisation d'une famille sur le portail familles : les données actualisées via les API ne nécessiteront plus de justificatifs.\r\n- Lors du suivi du dossier par la collectivité, les données pourront être automatiquement vérifiées, contrôlées et actualisées\r\nL’utilisation de l’API Particulier se fait dans le cadre de l’utilisation du portail familles MALICE édité par la société AMICIEL.",
              data_recipients:
                'Agents instructeurs gérant les inscriptions et les facturations des prestations Petite Enfance, Scolaire et Extra-Scolaire',
              data_retention_period: 60,
              fondement_juridique_title:
                "L'article L114-8 du code des relations entre le public et l'administration fixe le cadre général des échanges de données au sein de l'administration. En tant que collectivité territoriale, la délibération ci-jointe précise l'objet du téléservice, selon l'arrêté du 04/07/13 sur les téléservices, et précise les données nécessaires à son fonctionnement",
              technical_team_type: 'software_company',
              technical_team_value: '44884396100021',
              scopes: {
                cnaf_quotient_familial: true,
                cnaf_allocataires: true,
                cnaf_enfants: true,
                cnaf_adresse: true,
                dgfip_declarant1_nom: true,
                dgfip_declarant1_nom_naissance: true,
                dgfip_declarant1_prenoms: true,
                dgfip_declarant1_date_naissance: true,
                dgfip_declarant2_nom: true,
                dgfip_declarant2_nom_naissance: true,
                dgfip_declarant2_prenoms: true,
                dgfip_declarant2_date_naissance: true,
                dgfip_adresse_fiscale_taxation: true,
                dgfip_adresse_fiscale_annee: true,
                dgfip_nombre_parts: true,
                dgfip_nombre_personnes_a_charge: true,
                dgfip_situation_familiale: true,
              },
            },
          },
          'arpege-concerto': {
            label:
              'Concerto, Tarification services municipaux / Portail Famille, Données CNAF',
            about: 'https://api.gouv.fr/guides/portail-famille-tarification',
            state: {
              intitule:
                'Récupération du Quotient Familial pour les services Petite Enfance et Périscolaire',
              description:
                'Notre commune module la facturation des services liés à la petite enfance et à l’enfance en fonction des QF. Dans un esprit de simplification et de sécurité, nous souhaitons ne pas demander aux familles ces éléments de calcul mais plutôt nous baser sur les données proposées par API Particulier. Nous utilisons le logiciel Concerto, édité par la Société Arpège.',
              data_recipients:
                'Agents instructeurs des dossiers d’inscription en multi-accueil, Agents instructeurs des dossiers au guichet unique, Agents instructeurs des dossiers d’inscription en accueil périscolaire',
              data_retention_period: 12,
              fondement_juridique_title:
                "L'article L114-8 du code des relations entre le public et l'administration fixe le cadre général des échanges de données au sein de l'administration. En tant que collectivité territoriale, la délibération ci-jointe précise l'objet du téléservice, selon l'arrêté du 04/07/13 sur les téléservices, et précise les données nécessaires à son fonctionnement ",
              fondement_juridique_url:
                'Joindre les délibérations ou procédures internes concernées.',
              technical_team_type: 'software_company',
              technical_team_value: '35142130000036',
              scopes: {
                cnaf_quotient_familial: true,
                cnaf_allocataires: true,
                cnaf_enfants: true,
                cnaf_adresse: false,
              },
            },
          },
          'bl-enfance-berger-levrault-cnaf-dgfip': {
            label:
              'BL Enfance, Tarification services municipaux / Portail Famille, Données CNAF/DGFIP',
            about: 'https://api.gouv.fr/guides/portail-famille-tarification',
            state: {
              intitule:
                'Calcul du quotient familial pour la facturation des activités scolaires, périscolaires et loisirs',
              description:
                'La collectivité a voté un règlement intérieur où figure le tarif des prestations liées aux activités scolaires et périscolaires, qui est fonction du quotient familial. Il est donc nécessaire de récupérer ce dernier qui a été transmis par la CAF.\r\nLa solution utilisée est BL.enfance de l’éditeur Berger-levrault.',
              data_recipients:
                'Agent de la collectivité ( ou association) en charge de l’inscription des familles ou en charge de la facturation des activités, agent du service guichet unique.',
              data_retention_period: 36,
              fondement_juridique_title:
                "L'article L114-8 du code des relations entre le public et l'administration fixe le cadre général des échanges de données au sein de l'administration. En tant que collectivité territoriale, la délibération ci-jointe précise l'objet du téléservice, selon l'arrêté du 04/07/13 sur les téléservices, et précise les données nécessaires à son fonctionnement.",
              technical_team_type: 'software_company',
              technical_team_value: '75580064600373',
              scopes: {
                cnaf_quotient_familial: true,
                cnaf_allocataires: true,
                cnaf_adresse: true,
                dgfip_revenu_fiscal_reference: true,
              },
            },
            team_members: {
              responsable_technique: {
                given_name: 'Jean-François',
                family_name: 'Pommier',
                job: 'Produit',
                email: 'jf.pommier@berger-levrault.com',
                phone_number: '0628770862',
              },
            },
          },
          'bl-enfance-berger-levrault-dgfip': {
            label:
              'BL Enfance, Tarification services municipaux / Portail Famille, Données DGFIP',
            about: 'https://api.gouv.fr/guides/portail-famille-tarification',
            state: {
              intitule:
                'Calcul du quotient familial pour la facturation des activités scolaires, périscolaires et loisirs',
              description:
                'La collectivité a voté un règlement intérieur où figure le tarif des prestations liées aux activités scolaires et périscolaires, qui est fonction du quotient familial. Il est donc nécessaire de récupérer ce dernier qui a été transmis par la CAF.\r\nLa solution utilisée est BL.enfance de l’éditeur Berger-levrault.',
              data_recipients:
                'Agent de la collectivité ( ou association) en charge de l’inscription des familles ou en charge de la facturation des activités, agent du service guichet unique.',
              data_retention_period: 36,
              fondement_juridique_title:
                "L'article L114-8 du code des relations entre le public et l'administration fixe le cadre général des échanges de données au sein de l'administration. En tant que collectivité territoriale, la délibération ci-jointe précise l'objet du téléservice, selon l'arrêté du 04/07/13 sur les téléservices, et précise les données nécessaires à son fonctionnement.",
              technical_team_type: 'software_company',
              technical_team_value: '75580064600373',
              scopes: {
                dgfip_revenu_fiscal_reference: true,
              },
            },
            team_members: {
              responsable_technique: {
                given_name: 'Jean-François',
                family_name: 'Pommier',
                job: 'Produit',
                email: 'jf.pommier@berger-levrault.com',
                phone_number: '0628770862',
              },
            },
          },
          'bl-enfance-berger-levrault-cnaf': {
            label:
              'BL Enfance, Tarification services municipaux / Portail Famille, Données CNAF',
            about: 'https://api.gouv.fr/guides/portail-famille-tarification',
            state: {
              intitule:
                'Calcul du quotient familial pour la facturation des activités scolaires, périscolaires et loisirs',
              description:
                'La collectivité a voté un règlement intérieur où figure le tarif des prestations liées aux activités scolaires et périscolaires, qui est fonction du quotient familial. Il est donc nécessaire de récupérer ce dernier qui a été transmis par la CAF.\r\nLa solution utilisée est BL.enfance de l’éditeur Berger-levrault.',
              data_recipients:
                'Agent de la collectivité ( ou association) en charge de l’inscription des familles ou en charge de la facturation des activités, agent du service guichet unique.',
              data_retention_period: 36,
              fondement_juridique_title:
                "L'article L114-8 du code des relations entre le public et l'administration fixe le cadre général des échanges de données au sein de l'administration. En tant que collectivité territoriale, la délibération ci-jointe précise l'objet du téléservice, selon l'arrêté du 04/07/13 sur les téléservices, et précise les données nécessaires à son fonctionnement.",
              technical_team_type: 'software_company',
              technical_team_value: '75580064600373',
              scopes: {
                cnaf_quotient_familial: true,
                cnaf_allocataires: true,
                cnaf_adresse: true,
              },
            },
            team_members: {
              responsable_technique: {
                given_name: 'Jean-François',
                family_name: 'Pommier',
                job: 'Produit',
                email: 'jf.pommier@berger-levrault.com',
                phone_number: '0628770862',
              },
            },
          },
          'cantine-de-france': {
            label:
              'Cantines-de-France, Tarification services municipaux / Portail Famille, Données CNAF',
            about: 'https://api.gouv.fr/guides/portail-famille-tarification',
            state: {
              intitule:
                'Récupération du Quotient Familial ainsi que les informations administratives (CAF et Impôts) pour les services Cantine et Garderie',
              description:
                "La mairie souhaite bénéficier du service API Particulier pour les besoins suivants :\r\n- Le tarif des prestations de la collectivité est indexé sur le QF de chaque famille\r\n- Les nouvelles familles arrivant sur la commune peuvent lors de la création de leurs comptes remonter l'ensemble des informations administratives grâce à API particulier\r\n- Avoir la mise à jour des QF afin de mettre à jour les facturations des familles\r\n- Dématérialiser les mises à jours de ces informations et de limiter les déplacements en mairie ou échange de courriers\r\n\r\nLa consommation se fait le cadre de l'utilisation du logiciel Cantine de France de la société Jdéalise.",
              data_retention_period: 36,
              fondement_juridique_title:
                "L'article L114-8 du code des relations entre le public et l'administration fixe le cadre général des échanges de données au sein de l'administration. En tant que collectivité territoriale, la délibération ci-jointe précise l'objet du téléservice, selon l'arrêté du 04/07/13 sur les téléservices, et précise les données nécessaires à son fonctionnement.",
              technical_team_type: 'software_company',
              technical_team_value: '89255569900016',
              scopes: {
                cnaf_quotient_familial: true,
                cnaf_allocataires: true,
                cnaf_enfants: true,
                cnaf_adresse: true,
              },
            },
            team_members: {
              responsable_technique: {
                email: 'contact@jdealise.fr',
                phone_number: '0972473612',
              },
            },
          },
          'city-family-mushroom-software-cnaf': {
            label:
              'City Family, Tarification services municipaux / Portail Famille, Données CNAF',
            about: 'https://api.gouv.fr/guides/portail-famille-tarification',
            state: {
              intitule:
                'Calcul du quotient familial pour la facturations des crèches, du périscolaire, du scolaire et de l’extrascolaire',
              description:
                'La ville gère les prestations liées à la restauration scolaire, les garderies, les centres de loisirs et les crèches. Le calcul du prix des prestations est lié soit aux revenus des familles soit à leur quotient familial.\r\nNous utilisons la solution CityFamily de Mushroom Software.',
              data_recipients:
                "Il s'agit de l'agent en Mairie effectuant la gestion des familles pour une facturation conforme à la délibération municipale. La consultation des données n’est pas autorisée ni permise aux agents n’ayant pas rapport au service.",
              data_retention_period: 24,
              fondement_juridique_title:
                "L'article L114-8 du code des relations entre le public et l'administration fixe le cadre général des échanges de données au sein de l'administration. En tant que collectivité territoriale, la délibération ci-jointe précise l'objet du téléservice, selon l'arrêté du 04/07/13 sur les téléservices, et précise les données nécessaires à son fonctionnement.",
              technical_team_type: 'software_company',
              technical_team_value: '81122842800017',
              scopes: {
                cnaf_quotient_familial: true,
                cnaf_allocataires: true,
                cnaf_adresse: true,
              },
            },
            team_members: {
              responsable_technique: {
                given_name: 'Jean-Charles',
                family_name: 'Geeraert',
                job: 'Produit',
                email: 'technique@mushroom-software.com',
                phone_number: '0674577622',
              },
            },
          },
          'city-family-mushroom-software-CNAF-DGFIP': {
            label:
              'City Family, Tarification services municipaux / Portail Famille, Données CNAF/DGFIP',
            about: 'https://api.gouv.fr/guides/portail-famille-tarification',
            state: {
              intitule:
                'Calcul du quotient familial pour la facturations des crèches, du périscolaire, du scolaire et de l’extrascolaire',
              description:
                'La ville gère les prestations liées à la restauration scolaire, les garderies, les centres de loisirs et les crèches. Le calcul du prix des prestations est lié soit aux revenus des familles soit à leur quotient familial.\r\nNous utilisons la solution CityFamily de Mushroom Software.',
              data_recipients:
                "Il s'agit de l'agent en Mairie effectuant la gestion des familles pour une facturation conforme à la délibération municipale. La consultation des données n’est pas autorisée ni permise aux agents n’ayant pas rapport au service.",
              data_retention_period: 24,
              fondement_juridique_title:
                "L'article L114-8 du code des relations entre le public et l'administration fixe le cadre général des échanges de données au sein de l'administration. En tant que collectivité territoriale, la délibération ci-jointe précise l'objet du téléservice, selon l'arrêté du 04/07/13 sur les téléservices, et précise les données nécessaires à son fonctionnement.",
              technical_team_type: 'software_company',
              technical_team_value: '81122842800017',
              scopes: {
                dgfip_declarant1_nom: true,
                dgfip_declarant1_nom_naissance: true,
                dgfip_declarant1_prenoms: true,
                dgfip_declarant1_date_naissance: true,
                dgfip_declarant2_nom: true,
                dgfip_declarant2_nom_naissance: true,
                dgfip_declarant2_prenoms: true,
                dgfip_declarant2_date_naissance: true,
                dgfip_date_recouvrement: true,
                dgfip_date_etablissement: true,
                dgfip_adresse_fiscale_taxation: true,
                dgfip_adresse_fiscale_annee: true,
                dgfip_nombre_parts: true,
                dgfip_nombre_personnes_a_charge: true,
                dgfip_situation_familiale: true,
                dgfip_revenu_brut_global: true,
                dgfip_revenu_imposable: true,
                dgfip_revenu_fiscal_reference: true,
                dgfip_annee_impot: true,
                cnaf_quotient_familial: true,
                cnaf_allocataires: true,
                cnaf_adresse: true,
              },
            },
            team_members: {
              responsable_technique: {
                given_name: 'Jean-Charles',
                family_name: 'Geeraert',
                job: 'Produit',
                email: 'technique@mushroom-software.com',
                phone_number: '0674577622',
              },
            },
          },
          'city-family-mushroom-software-dgfip': {
            label:
              'City Family, Tarification services municipaux / Portail Famille, Données DGFIP',
            about: 'https://api.gouv.fr/guides/portail-famille-tarification',
            state: {
              intitule:
                'Calcul du quotient familial pour la facturations des crèches, du périscolaire, du scolaire et de l’extrascolaire',
              description:
                'La ville gère les prestations liées à la restauration scolaire, les garderies, les centres de loisirs et les crèches. Le calcul du prix des prestations est lié soit aux revenus des familles soit à leur quotient familial.\r\nNous utilisons la solution CityFamily de Mushroom Software.',
              data_recipients:
                "Il s'agit de l'agent en Mairie effectuant la gestion des familles pour une facturation conforme à la délibération municipale. La consultation des données n’est pas autorisée ni permise aux agents n’ayant pas rapport au service.",
              data_retention_period: 24,
              fondement_juridique_title:
                "L'article L114-8 du code des relations entre le public et l'administration fixe le cadre général des échanges de données au sein de l'administration. En tant que collectivité territoriale, la délibération ci-jointe précise l'objet du téléservice, selon l'arrêté du 04/07/13 sur les téléservices, et précise les données nécessaires à son fonctionnement.",
              technical_team_type: 'software_company',
              technical_team_value: '81122842800017',
              scopes: {
                dgfip_declarant1_nom: true,
                dgfip_declarant1_nom_naissance: true,
                dgfip_declarant1_prenoms: true,
                dgfip_declarant1_date_naissance: true,
                dgfip_declarant2_nom: true,
                dgfip_declarant2_nom_naissance: true,
                dgfip_declarant2_prenoms: true,
                dgfip_declarant2_date_naissance: true,
                dgfip_date_recouvrement: true,
                dgfip_date_etablissement: true,
                dgfip_adresse_fiscale_taxation: true,
                dgfip_adresse_fiscale_annee: true,
                dgfip_nombre_parts: true,
                dgfip_nombre_personnes_a_charge: true,
                dgfip_situation_familiale: true,
                dgfip_revenu_brut_global: true,
                dgfip_revenu_imposable: true,
                dgfip_revenu_fiscal_reference: true,
                dgfip_annee_impot: true,
              },
            },
            team_members: {
              responsable_technique: {
                given_name: 'Jean-Charles',
                family_name: 'Geeraert',
                job: 'Produit',
                email: 'technique@mushroom-software.com',
                phone_number: '0674577622',
              },
            },
          },
          'docaposte-fast': {
            label:
              'Docaposte, Tarification services municipaux / Portail Famille, Données CNAF',
            about: 'https://api.gouv.fr/guides/portail-famille-tarification',
            state: {
              intitule:
                'Récupération du Quotient Familial ainsi que les informations administratives (CAF et Impôts) pour les services Cantine et Garderie',
              description:
                "Notre mairie souhaite bénéficier du service API Particulier pour les besoins suivants :\r\n - Le tarif des prestations de la collectivité est indexé sur le QF de chaque famille\r\n - Les nouvelles familles arrivant sur la commune peuvent lors de la création de leurs comptes remonter l'ensemble des informations administratives grâce à API particulier\r\n - Avoir la mise à jour des QF afin de mettre à jour les facturations des familles\r\n - Dématérialiser les mises à jours de ces informations et de limiter les déplacements en mairie ou échange de courriers\r\n L’Utilisation de l’API Particulier se fait dans le cadre de l’utilisation du logiciel FAST-Famille  édité par la société DOCAPOSTE-FAST.",
              data_recipients:
                'Agents instructeurs en charge de la tarification et de la facturation des prestations aux familles',
              data_retention_period: 36,
              fondement_juridique_title:
                "L'article L114-8 du code des relations entre le public et l'administration fixe le cadre général des échanges de données au sein de l'administration. En tant que collectivité territoriale, la délibération ci-jointe précise l'objet du téléservice, selon l'arrêté du 04/07/13 sur les téléservices, et précise les données nécessaires à son fonctionnement.",
              technical_team_type: 'software_company',
              technical_team_value: '48847870200027',
              scopes: {
                cnaf_quotient_familial: true,
                cnaf_allocataires: true,
                cnaf_enfants: true,
                cnaf_adresse: true,
              },
            },
          },
          'entrouvert-publik': {
            label:
              'Publik Famille, Tarification services municipaux / Portail Famille, Données CNAF/DGFIP',
            about: 'https://api.gouv.fr/guides/portail-famille-tarification',
            state: {
              intitule:
                'Calcul du tarif des activités péri-extrascolaires, petite enfance, socio-culturelles et sportives pour les enfants ou les adultes inscrits',
              description:
                "Calculer le tarif des activités péri-extrascolaires, petite enfance, socio-culturelles et sportives pour la facturation des familles qui effectuent leurs démarches en ligne via la plateforme de Gestion de la relation usager Publik de la collectivité, éditée par la société Entr'ouvert",
              data_recipients:
                'Agents instructeurs des dossiers "restauration scolaire"',
              data_retention_period: 20,
              technical_team_type: 'software_company',
              technical_team_value: '49108189900032',
              scopes: {
                dgfip_declarant1_nom: true,
                dgfip_declarant1_nom_naissance: true,
                dgfip_declarant1_prenoms: true,
                dgfip_declarant1_date_naissance: true,
                dgfip_declarant2_nom: true,
                dgfip_declarant2_nom_naissance: true,
                dgfip_declarant2_prenoms: true,
                dgfip_declarant2_date_naissance: true,
                dgfip_nombre_parts: true,
                dgfip_nombre_personnes_a_charge: true,
                dgfip_revenu_fiscal_reference: true,
                dgfip_annee_revenus: true,
                dgfip_situation_familiale: true,
                cnaf_quotient_familial: true,
                cnaf_allocataires: true,
                cnaf_enfants: true,
              },
            },
          },
          'jvs-parascol': {
            label:
              'Parascol, Tarification services municipaux / Portail Famille, Données CNAF',
            about: 'https://api.gouv.fr/guides/portail-famille-tarification',
            state: {
              intitule:
                'Facturation des familles pour les services périscolaires et loisirs',
              description:
                "La commune/la structure intercommunale est chargée de la gestion de la facturation des services liés à l'Enfance.\r\nDans ce cadre, elle a besoin de récupérer des informations concernant la famille et ses éléments de revenus et de quotient familial.\r\nAfin d'avoir des informations fiables sur ces points et pour éviter de réclamer certains justificatifs, l'utilisation d'API Particulier semble adaptée.\r\nLe logiciel utilisé est Parascol, édité par JVS-MAIRISTEM.\r\nL'Espace Famille, proposé en complément de Parascol, permet aux familles (entre autres mises à jour de leur dossier ou inscription) de déclarer leurs ressources et calculer leur quotient familial, sans avoir à se déplacer en mairie. Là encore, l'utilisation d'API Particulier représente un véritable plus pour les familles.",
              data_recipients:
                'Agents instructeurs des dossiers d’inscription (périscolaire, multi-accueil, guichet unique)',
              data_retention_period: 24,
              fondement_juridique_title:
                "L'article L114-8 du code des relations entre le public et l'administration fixe le cadre général des échanges de données au sein de l'administration. En tant que collectivité territoriale, la délibération ci-jointe précise l'objet du téléservice, selon l'arrêté du 04/07/13 sur les téléservices, et précise les données nécessaires à son fonctionnement.",
              technical_team_type: 'software_company',
              technical_team_value: '32855218700069',
              scopes: {
                cnaf_quotient_familial: true,
                cnaf_allocataires: true,
                cnaf_enfants: true,
                cnaf_adresse: true,
              },
            },
          },
          'civil-enfance-ciril-group': {
            label:
              'Civil, Tarification services municipaux / Portail Famille, Données CNAF et DGFIP',
            about: 'https://api.gouv.fr/guides/portail-famille-tarification',
            state: {
              intitule:
                'Déclaration et calcul du quotient familial pour la facturation des activités du portail famille',
              description:
                "Ce service permet aux familles de déclarer leurs ressources et faire calculer leur quotient familial via le portail famille Civil Enfance de l'éditeur Ciril Group sans se déplacer en Mairie. Cette procédure est entièrement dématérialisée.\r\n[Vous pouvez indiquer que les données nécessaires au calcul du quotient seront récupérées des services fiscaux et / ou des services de la CNAF en fonction de vos besoins. Soyez-spécifique sur quelle donnée pour quel usage.]",
              data_recipients:
                'Agents de la collectivité en charge des services enfance, petite enfance et jeunesse de la ville.',
              data_retention_period: 36,
              fondement_juridique_title:
                "L'article L114-8 du code des relations entre le public et l'administration fixe le cadre général des échanges de données au sein de l'administration. En tant que collectivité territoriale, la délibération ci-jointe précise l'objet du téléservice, selon l'arrêté du 04/07/13 sur les téléservices, et précise les données nécessaires à son fonctionnement.",
              technical_team_type: 'software_company',
              technical_team_value: '30516304000119',
              scopes: {
                dgfip_declarant1_nom: true,
                dgfip_declarant1_nom_naissance: true,
                dgfip_declarant1_prenoms: true,
                dgfip_declarant1_date_naissance: true,
                dgfip_declarant2_nom: true,
                dgfip_declarant2_nom_naissance: true,
                dgfip_declarant2_prenoms: true,
                dgfip_declarant2_date_naissance: true,
                dgfip_date_recouvrement: true,
                dgfip_date_etablissement: true,
                dgfip_adresse_fiscale_taxation: true,
                dgfip_adresse_fiscale_annee: true,
                dgfip_nombre_parts: true,
                dgfip_nombre_personnes_a_charge: true,
                dgfip_situation_familiale: true,
                dgfip_revenu_brut_global: true,
                dgfip_revenu_imposable: true,
                dgfip_revenu_fiscal_reference: true,
                dgfip_annee_impot: true,
                dgfip_annee_revenus: true,
                dgfip_erreur_correctif: true,
                dgfip_situation_partielle: true,
                cnaf_quotient_familial: true,
                cnaf_allocataires: true,
                cnaf_enfants: true,
                cnaf_adresse: true,
              },
            },
            team_members: {
              responsable_technique: {
                given_name: 'Romain',
                family_name: 'Jalabert',
                job: 'Chef Produit',
                email: 'rjalabert@cirilgroup.com',
                phone_number: '0472691680',
              },
            },
          },
          'nfi-grc': {
            label:
              'NFI, Tarification services municipaux / Portail Famille, Données CNAF et DGFIP',
            about: 'https://api.gouv.fr/guides/portail-famille-tarification',
            state: {
              intitule: 'Gestion de la relation client sur le portail famille',
              description:
                "Permettre la récupération de quotient familial par les administrés eux-mêmes sur leur compte d'inscription en saisissant leur identifiant Caf et en demandant l'actualisation du quotient Familial.\r\nPermettre le même traitement en mairie pour le compte d'un administré spécifique dans le cas d'un administré n'ayant pas accès à Internet ou pour le compte de l'ensemble des administrés gérés dans le cadre du service et en cours de validité au moment du traitement afin d'actualiser la totalité des foyers et d'être conforme à la délibération municipale fixant les coût des prestations en fonction du Quotient Familial.\r\nIl s'agit également, vu que les données sont demandées aux administrés au moment de leur inscription, de récupérer les informations sur les enfants et les allocataires ainsi que l'adresse du foyer. En effet, cela permettra aux administrés non seulement de connaître la connaissance de la CAF sur la composition de leur foyer mais également de pré-saisir et donc d'éviter des erreurs de saisie sur l'adresse ainsi que sur les prénoms, sexe et date de naissance des enfants. Les données sont gardées en base de données le temps de l'activité au sein du service du portail famille. Les données peuvent être anonymisées dès que l'administré en fait la demande et qu'il ne fait plus parti des administrés actifs au service.\r\nNous utilisons la solution de GRC de l'éditeur Nord France Informatique (NFI).",
              data_recipients:
                "Il s'agit de l'agent en Mairie effectuant la gestion des familles pour une facturation conforme à la délibération municipale. La consultation des données n’est pas autorisée ni permise aux agents n’ayant pas rapport au service.",
              data_retention_period: 24,
              fondement_juridique_title:
                'Délibération de la commune au format PDF en pièce jointe',
              technical_team_type: 'software_company',
              technical_team_value: '37996323400032',
              scopes: {
                cnaf_quotient_familial: true,
                cnaf_allocataires: true,
                cnaf_enfants: true,
                cnaf_adresse: true,
              },
            },
            team_members: {
              responsable_technique: {
                given_name: 'Richard',
                family_name: 'GHESQUIERE',
                job: 'Chef Produit',
                email: 'richard.ghesquiere@nfi.fr',
                phone_number: '0632362572',
              },
            },
          },
          teamnet: {
            label:
              'Axel, Tarification services municipaux / Portail Famille, Données CNAF',
            about: 'https://api.gouv.fr/guides/portail-famille-tarification',
            state: {
              intitule:
                'Déclaration des revenus et calcul du quotient familial pour actualiser les tarifs appliqués aux différentes prestations facturées',
              description:
                'Le télé-service de déclaration des revenus est accessible sur le Portail Familles. Il permet à une famille de déclarer ses revenus et de préciser le nombre de personnes qui compose le foyer.\r\nLes revenus déclarés par la famille sont utilisés pour actualiser les tarifs appliqués aux différentes prestations facturées.\r\nLes tarifs des prestations sont calculés en fonction des revenus de la famille ou de son quotient familial. Le quotient familial est calculé avec les revenus du foyer et le nombre de personnes qui composent le foyer.',
              data_recipients:
                "Agents instructeurs qui gèrent la facturation des prestations de la Petite Enfance, du Scolaire et de l'extra-scolaire",
              data_retention_period: 36,
              fondement_juridique_title:
                'Préciser la référence et le texte et de la délibération au format PDF vous autorisant à traiter les données.',
              technical_team_type: 'software_company',
              technical_team_value: '33922000600078',
              scopes: {
                cnaf_quotient_familial: true,
                cnaf_allocataires: false,
                cnaf_enfants: false,
                cnaf_adresse: false,
              },
            },
          },
          qiis: {
            label:
              'eTicket, Tarification services municipaux / Portail Famille, Données CNAF',
            about: 'https://api.gouv.fr/guides/portail-famille-tarification',
            state: {
              intitule:
                'Demande de certification et de référencement de notre plateforme eTicket https://www.eticket.qiis.fr/',
              description:
                'Cette démarche auprès des administrés nous permettra de récupérer les éléments nécessaires à appliquer pour le calcul des tarifs des différentes prestations.\r\n  - Cette démarche auprès des administrés nous permettra de récupérer les éléments nécessaires à appliquer pour le calcul des tarifs des différentes prestations.\r\n  - Les allocataires\r\n  - Les revenus déclarés aux différents organisme\r\n  - Adresse du foyer\r\n ',
              data_recipients: 'Adresse du foyer',
              data_retention_period: 12,
              fondement_juridique_title:
                "L'article L114-8 du code des relations entre le public et l'administration fixe le cadre général des échanges de données au sein de l'administration. En tant que collectivité territoriale, la délibération ci-jointe précise l'objet du téléservice, selon l'arrêté du 04/07/13 sur les téléservices, et précise les données nécessaires à son fonctionnement.",
              technical_team_type: 'software_company',
              technical_team_value: '52834311400021',
              scopes: {
                cnaf_quotient_familial: true,
                cnaf_allocataires: true,
                cnaf_enfants: true,
                cnaf_adresse: true,
              },
            },
            team_members: {
              responsable_technique: {
                given_name: 'Eric',
                family_name: 'Veyret',
                job: 'CEO',
                email: 'eric.veyret@qiis.fr',
                phone_number: '0646436364',
              },
            },
          },
          aiga: {
            label:
              'iNoé, Tarification services municipaux / Portail Famille, Données CNAF',
            about: 'https://api.gouv.fr/guides/portail-famille-tarification',
            state: {
              intitule:
                'Facturation des familles inscrites aux CLSH, services périscolaires … des collectivités',
              description:
                'iNoé permet la facturation des prestations des activités périscolaires, garderies et centres de loisirs des collectivités. La tarification aux familles est dépendante du quotient familial, au plus juste quand récupéré auprès de la CNAF. ',
              data_recipients: 'Adresse du foyer',
              data_retention_period: 12,
              fondement_juridique_title:
                "L'article L114-8 du code des relations entre le public et l'administration fixe le cadre général des échanges de données au sein de l'administration. En tant que collectivité territoriale, la délibération ci-jointe précise l'objet du téléservice, selon l'arrêté du 04/07/13 sur les téléservices, et précise les données nécessaires à son fonctionnement.",
              technical_team_type: 'software_company',
              technical_team_value: '39825361700045',
              scopes: {
                cnaf_quotient_familial: true,
              },
            },
            team_members: {
              responsable_technique: {
                given_name: 'Fabrice',
                family_name: 'Biollet',
                job: 'CEO',
                email: 'fabrice.biollet@free.fr',
                phone_number: '0472532200',
              },
            },
          },
          waigeo: {
            label:
              'MyPerischool, Tarification services municipaux / Portail Famille, Données CNAF',
            about: 'https://api.gouv.fr/guides/portail-famille-tarification',
            state: {
              intitule:
                'Calcul de la tarification pour la facturation des services périscolaires, restauration scolaire et des accueils de loisirs.',
              description:
                "Ce service permet aux familles de déclarer leurs ressources et de bénéficier d'une tarification en fonction de leur situation.\r\nMypérischool permet la facturation des prestations liées à la restauration scolaire, les activités périscolaires, les garderies et les centres de loisirsLa tarification se base sur le quotient familial récupéré auprès de la CNAF ou sur les revenus des familles récupérés directement auprès des services fiscaux à travers l'avis d'imposition.",
              data_recipients:
                'Agents de la collectivité en charge des services enfance et jeunesse de la ville.',
              data_retention_period: 36,
              fondement_juridique_title:
                "L'article L114-8 du code des relations entre le public et l'administration fixe le cadre général des échanges de données au sein de l'administration. En tant que collectivité territoriale, la délibération ci-jointe précise l'objet du téléservice, selon l'arrêté du 04/07/13 sur les téléservices, et précise les données nécessaires à son fonctionnement.",
              technical_team_type: 'software_company',
              technical_team_value: '80321944300014',
              scopes: {
                cnaf_quotient_familial: true,
              },
            },
            team_members: {
              responsable_technique: {
                email: 'technique@waigeo.fr',
                phone_number: '0970805210',
              },
            },
          },
          '3d-ouest': {
            label:
              '3D Ouest, Tarification services municipaux / Portail Famille, Données CNAF',
            about: 'https://api.gouv.fr/guides/portail-famille-tarification',
            state: {
              intitule:
                'Tarification Services Enfance et récupération des quotients familiaux avec le logiciel Enfance 3D OUEST',
              description:
                'Dans un esprit de simplification et de sécurité, les collectivités pourront utiliser API Particulier pour récupérer les quotients familiaux des administrés afin de faciliter la facturation des services enfance et périscolaire. L’utilisation d’API Particulier est un vrai plus pour dématérialiser les mises à jour de ces informations',
              data_recipients: 'Agents des services publics de la ville',
              data_retention_period: 36,
              fondement_juridique_title:
                "L'article L114-8 du code des relations entre le public et l'administration fixe le cadre général des échanges de données au sein de l'administration. En tant que collectivité territoriale, la délibération ci-jointe précise l'objet du téléservice, selon l'arrêté du 04/07/13 sur les téléservices, et précise les données nécessaires à son fonctionnement.",
              technical_team_type: 'software_company',
              technical_team_value: '44973625500018',
              scopes: {
                cnaf_quotient_familial: true,
                cnaf_allocataires: true,
                cnaf_enfants: true,
              },
            },
            team_members: {
              responsable_technique: {
                given_name: 'Laurent',
                family_name: 'DELATTRE',
                job: 'Directeur R&D',
                email: 'laurent.delattre@3douest.com',
                phone_number: '0256662007',
              },
            },
          },
          'ccas-Melissandre-afi': {
            label:
              "AFI, Dématérialisation de l'instruction des dossiers dans un CCAS, Données CNAF/DGFIP/MESRI/Pole Emploi/CROUS",
            about: 'https://api.gouv.fr/guides/ccas',
            state: {
              intitule: "Instructions des dossiers d'aides sociales",
              description:
                "Les agents du CCAS instruisent des dossiers de demandes d'aides légales et facultatives. Pour définir si un usager est éligible, les agents analysent la situation fiscal et familiale (toutes les ressources perçues, le quotient familial, la composition du ménage, si l'adresse est bien sur la commune, etc.). L'accès à certaines informations, certifiées via l'API Particulier, permet un gain de temps dans le traitement des dossiers par les instructeurs et simplifie les démarches des familles. Logiciel utilisé : Melissande, édité par la Société A.F.I.",
              data_recipients:
                "agents instructeurs des demandes d'aides, agents instructeurs des demandes d'inscriptions aux services à la personne, ...",
              data_retention_period: 12,
              fondement_juridique_title:
                "Préciser ici les délibérations du conseil d'administration qui détaillent les modalités de calcul du montant des aides et/ou du prix de services.\r\nLorsque le calcul du montant des aides est à la libre appréciation du travailleur social ou de la commission d’attribution, préciser sur quels éléments se basent la décision.",
              fondement_juridique_url:
                'Joindre les délibérations ou procédures internes concernées.',
              technical_team_type: 'software_company',
              technical_team_value: '32275019100031',
              scopes: {
                dgfip_declarant1_nom: true,
                dgfip_declarant1_nom_naissance: true,
                dgfip_declarant1_prenoms: true,
                dgfip_declarant1_date_naissance: true,
                dgfip_declarant2_nom: true,
                dgfip_declarant2_nom_naissance: true,
                dgfip_declarant2_prenoms: true,
                dgfip_declarant2_date_naissance: true,
                dgfip_date_recouvrement: true,
                dgfip_date_etablissement: true,
                dgfip_adresse_fiscale_taxation: true,
                dgfip_adresse_fiscale_annee: true,
                dgfip_nombre_parts: true,
                dgfip_nombre_personnes_a_charge: true,
                dgfip_situation_familiale: true,
                dgfip_revenu_brut_global: true,
                dgfip_revenu_imposable: true,
                dgfip_impot_revenu_net_avant_corrections: true,
                dgfip_montant_impot: true,
                dgfip_revenu_fiscal_reference: true,
                dgfip_annee_impot: true,
                dgfip_annee_revenus: true,
                cnaf_quotient_familial: true,
                cnaf_allocataires: true,
                cnaf_enfants: true,
                cnaf_adresse: true,
                pole_emploi_identite: true,
                pole_emploi_contact: true,
                pole_emploi_adresse: true,
                pole_emploi_inscription: true,
                mesri_identifiant: true,
                mesri_identite: true,
                cnous_statut_bourse: true,
                cnous_identite: true,
              },
            },
            team_members: {
              responsable_technique: {
                given_name: 'Avelinda',
                family_name: 'Jess',
                job: 'Chef produit',
                email: 'ajess@afi-sa.fr',
                phone_number: '0614677910',
              },
            },
          },
          'ccas-ArcheMC2': {
            label:
              "Arche MC2, Dématérialisation de l'instruction des dossiers dans un CCAS/CIAS, Données CNAF/DGFIP",
            about: 'https://api.gouv.fr/guides/ccas',
            state: {
              intitule: "Instructions des dossiers d'aides sociales",
              description:
                "Les agents sociaux de la collectivité (CCAS/CIAS) instruisent des dossiers de demande d'aides légales et/ou facultatives. Dans ce contexte, ils ont besoin de connaître la composition familiale et la situation financière du foyer du demandeur : état civil (nom prénom date de naissance), structure familiale (nom prénom date de naissance des enfants et parents), adresse du foyer, quotient familial calculé par la CAF et les données fiscales de la DGFIP. Toutes ces informations leur permettent de vérifier les conditions d'éligibilité aux aides sociales. Ainsi, dans une volonté de simplification de la démarche pour les citoyens et agents, nous souhaitons exploiter les données déjà connues de l'API Particulier. Pour cela, la collectivité utilise la solution Millésime édité par la société Arche MC2.",
              data_recipients:
                "agents instructeurs des demandes d'aides, agents instructeurs des demandes d'inscriptions aux services à la personne, ...",
              data_retention_period: 24,
              fondement_juridique_title:
                "Article L. 312-1 et Article R123-5 du code de l'action sociale et des familles. Article L114-8 et Article R. 114-9-3 du code des relations entre le public et l'administration.",
              fondement_juridique_url:
                'Joindre les délibérations ou procédures internes concernées.',
              technical_team_type: 'software_company',
              technical_team_value: '38251931200088',
              scopes: {
                dgfip_declarant1_nom: true,
                dgfip_declarant1_nom_naissance: true,
                dgfip_declarant1_prenoms: true,
                dgfip_declarant1_date_naissance: true,
                dgfip_declarant2_nom: true,
                dgfip_declarant2_nom_naissance: true,
                dgfip_declarant2_prenoms: true,
                dgfip_declarant2_date_naissance: true,
                dgfip_adresse_fiscale_annee: true,
                dgfip_nombre_parts: true,
                dgfip_nombre_personnes_a_charge: true,
                dgfip_situation_familiale: true,
                dgfip_revenu_brut_global: true,
                dgfip_revenu_imposable: true,
                dgfip_revenu_fiscal_reference: true,
                dgfip_annee_impot: true,
                dgfip_annee_revenus: true,
                cnaf_quotient_familial: true,
                cnaf_allocataires: true,
                cnaf_enfants: true,
                cnaf_adresse: true,
              },
            },
            team_members: {
              responsable_technique: {
                given_name: 'Pascal',
                family_name: 'BALIGOUT',
                job: 'Chef produit',
                email: 'pascal.baligout@arche‑mc2.fr',
                phone_number: '0352829363',
              },
            },
          },
          'ccas-arpege': {
            label:
              "Arpege, Dématérialisation de l'instruction des dossiers dans un CCAS, Données CNAF",
            about: 'https://api.gouv.fr/guides/ccas',
            state: {
              intitule:
                'Récupération du Quotient Familial et des Impôts pour les aides sociales facultatives et les services à la personne du CCAS',
              description:
                'Le CCAS de notre commune module le montant des aides octroyées aux usagers en difficulté en fonction du QF.\r\nLe prix des services à la personne pour les aînés et personnes en situation de handicap est calculé en fonction de l’impôt sur le revenu.\r\nDans un esprit de simplification et de sécurité, nous souhaitons ne pas demander aux familles les informations de calcul mais plutôt nous baser sur les données proposées par API Particulier.\r\nNous utilisons le logiciel Sonate édité par la Société Arpège.',
              data_recipients:
                "agents instructeurs des demandes d'aides, agents instructeurs des demandes d'inscriptions aux services à la personne, ...",
              data_retention_period: 12,
              fondement_juridique_title:
                "Préciser ici les délibérations du conseil d'administration qui détaillent les modalités de calcul du montant des aides et/ou du prix de services.\r\nLorsque le calcul du montant des aides est à la libre appréciation du travailleur social ou de la commission d’attribution, préciser sur quels éléments se basent la décision.",
              fondement_juridique_url:
                'Joindre les délibérations ou procédures internes concernées.',
              technical_team_type: 'software_company',
              technical_team_value: '35142130000036',
              scopes: {
                cnaf_quotient_familial: true,
                cnaf_allocataires: false,
                cnaf_enfants: false,
                cnaf_adresse: false,
              },
            },
          },
        },
        cguLink: 'https://api.gouv.fr/resources/CGU%20API%20Particulier.pdf',
        donneesDescription: `
La loi informatique et libertés définit les principes à respecter lors de
la collecte, du traitement et de la conservation de données personnelles.

L’article 6 précise :

- 3° [les données] sont adéquates, pertinentes et non excessives au regard
des finalités pour lesquelles elles sont collectées et de leurs
traitements ultérieurs ;
- 4° Elles sont exactes, complètes et, si nécessaire, mises à jour ; les
mesures appropriées doivent être prises pour que les données inexactes
ou incomplètes au regard des finalités pour lesquelles elles sont
collectées ou traitées soient effacées ou rectifiées ;

Nous vous remercions de sélectionner uniquement les données strictement
nécessaires à votre téléservice. Le non-respect du principe de
proportionnalité vous expose vis-à-vis de la CNIL.
`,
      },
    },
    api_entreprise: {
      label: 'API Entreprise',
      icon: null,
      email: 'support@entreprise.api.gouv.fr',
      type: DataProviderType.api,
      component: ApiEntreprise,
    },
    api_impot_particulier_sandbox: {
      label: 'API Impôt particulier (Bac à sable)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiImpotParticulierSandbox,
    },
    api_impot_particulier_production: {
      label: 'API Impôt particulier (Production)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiImpotParticulierProduction,
    },
    api_impot_particulier_fc_sandbox: {
      label: 'API Impôt particulier (FC) (Bac à sable)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiImpotParticulierFcSandbox,
    },
    api_impot_particulier_fc_production: {
      label: 'API Impôt particulier (FC) (Production)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiImpotParticulierFcProduction,
    },
    api_r2p_sandbox: {
      label: 'API R2P (Bac à sable)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiR2PSandbox,
    },
    api_r2p_production: {
      label: 'API R2P (Production)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiR2PProduction,
    },
    api_hermes_sandbox: {
      label: 'API Hermes (Bac à sable)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiHermesSandbox,
    },
    api_hermes_production: {
      label: 'API Hermes (Production)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiHermesProduction,
    },
    api_e_contacts_sandbox: {
      label: 'API E-Contacts (Bac à sable)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiEContactsSandbox,
    },
    api_e_contacts_production: {
      label: 'API E-Contacts (Production)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiEContactsProduction,
    },
    api_opale_sandbox: {
      label: 'API OPALE (Bac à sable)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiOpaleSandbox,
    },
    api_opale_production: {
      label: 'API OPALE (Production)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiOpaleProduction,
    },
    api_mire_sandbox: {
      label: 'API MIRE (Bac à sable)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiMireSandbox,
    },
    api_mire_production: {
      label: 'API MIRE (Production)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiMireProduction,
    },
    api_ocfi_sandbox: {
      label: 'API OCFI (Bac à sable)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiOcfiSandbox,
    },
    api_ocfi_production: {
      label: 'API OCFI (Production)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiOcfiProduction,
    },
    api_e_pro_sandbox: {
      label: 'API E-PRO (Bac à sable)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiEProSandbox,
    },
    api_e_pro_production: {
      label: 'API E-PRO (Production)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiEProProduction,
    },
    api_robf_sandbox: {
      label: 'API ROBF (Bac à sable)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiRobfSandbox,
    },
    api_robf_production: {
      label: 'API ROBF (Production)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiRobfProduction,
    },
    api_cpr_pro_sandbox: {
      label: 'API CPR PRO - ADELIE (Bac à sable)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiCprProSandbox,
    },
    api_cpr_pro_production: {
      label: 'API CPR PRO - ADELIE (Production)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiCprProProduction,
    },
    api_infinoe_sandbox: {
      label: 'API INFINOE (Bac à sable)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiInfinoeSandbox,
    },
    api_infinoe_production: {
      label: 'API INFINOE (Production)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiInfinoeProduction,
    },
    api_ficoba_sandbox: {
      label: 'API FICOBA (Bac à sable)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiFicobaSandbox,
    },
    api_ficoba_production: {
      label: 'API FICOBA (Production)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiFicobaProduction,
    },
    api_droits_cnam: {
      label: 'API Droits CNAM',
      icon: 'logo-cnam.jpg',
      email: 'partenaires-api-ameli.cnam@assurance-maladie.fr',
      type: DataProviderType.api,
      component: ApiDroitsCnam,
    },
    le_taxi: {
      label: 'API le.Taxi',
      icon: 'logo-le.taxi.svg',
      email: 'equipe@le.taxi',
      type: DataProviderType.api,
      component: LeTaxi,
    },
    cartobio: {
      label: 'CartoBio - Territoires',
      icon: 'logo-cartobio-text.svg',
      email: 'cartobio@beta.gouv.fr',
      type: DataProviderType.api,
      component: CartoBio,
    },
    api_service_national: {
      label: 'API Service National',
      icon: null,
      email: 'dsnj-api.contact.fct@intradef.gouv.fr',
      type: DataProviderType.api,
      component: ApiServiceNational,
    },
    api_tiers_de_prestation: {
      label: 'API Tiers de prestation',
      icon: 'logo-urssaf.png',
      email: 'habilitation-api@urssaf.fr',
      type: DataProviderType.api,
      component: ApiTiersDePrestation,
    },
    api_pro_sante_connect: {
      label: 'API Pro Santé Connect',
      icon: 'logo-ans.png',
      email: 'prosanteconnect.editeurs@esante.gouv.fr',
      type: DataProviderType.api,
      component: ApiProSanteConnect,
    },
    api_declaration_auto_entrepreneur: {
      label: 'API Tierce Déclaration auto-entrepreneur',
      icon: 'logo-urssaf.png',
      email: 'contact.tiercedeclaration@urssaf.fr',
      type: DataProviderType.api,
      component: ApiDeclarationAutoEntrepreneur,
    },
    api_indemnites_journalieres_cnam: {
      label: 'API Indemnités Journalières (CNAM)',
      icon: 'logo-cnam.jpg',
      email: 'partenaires-api-ameli.cnam@assurance-maladie.fr',
      type: DataProviderType.api,
      component: ApiIndemnitesJournalieresCnam,
    },
    api_declaration_cesu: {
      label: 'API Tierce Déclaration CESU',
      icon: 'logo-urssaf.png',
      email: 'habilitation-api@urssaf.fr',
      type: DataProviderType.api,
      component: ApiDeclarationCesu,
    },
    api_histovec: {
      label: 'API Historique d’un véhicule',
      icon: 'logo-minint.png',
      email: null,
      type: DataProviderType.api,
      component: ApiHistovec,
    },
    api_prestations_sociales: {
      label: 'API prestations sociales',
      icon: null,
      email: 'contact@apisecu.fr',
      type: DataProviderType.api,
      component: ApiPrestationsSociales,
    },
    api_prestations_sociales_fc: {
      label: 'API prestations sociales (FC)',
      icon: null,
      email: null,
      type: DataProviderType.api,
      component: ApiPrestationsSocialesFc,
    },
    api_ensu_documents_sandbox: {
      label: 'API ENSU Documents (Bac à sable)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiEnsuDocumentsSandbox,
    },
    api_ensu_documents_production: {
      label: 'API ENSU Documents (Production)',
      icon: 'logo-dgfip-with-label.png',
      email: 'dtnum.donnees.demande-acces@dgfip.finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiEnsuDocumentsProduction,
    },
    api_ingres: {
      label: 'API INGRES',
      icon: null,
      email: 'api.cisirh@finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiIngres,
    },
    api_statut_etudiant: {
      label: 'API Statut étudiant',
      icon: 'logo-mesri.png',
      email: 'support-statutetudiant@renater.fr',
      type: DataProviderType.api,
      component: ApiStatutEtudiant,
    },
    api_statut_demandeur_emploi: {
      label: 'API statut demandeur d’emploi',
      icon: 'logo-pole-emploi.png',
      email: 'support@pole-emploi.io',
      type: DataProviderType.api,
      component: ApiStatutDemandeurEmploi,
    },
    api_captchetat: {
      label: 'API CaptchEtat',
      icon: 'logo-aife.png',
      email: 'piste.aife@finances.gouv.fr',
      type: DataProviderType.api,
      component: ApiCaptchetat,
    },
    api_statut_etudiant_boursier: {
      label: 'API Statut étudiant boursier',
      icon: 'logo-cnous.png',
      email: 'api-boursier@cnous.fr',
      type: DataProviderType.api,
      component: ApiStatutEtudiantBoursier,
    },
    api_indemnisation_pole_emploi: {
      label: 'API Indemnisation Pôle emploi',
      icon: 'logo-pole-emploi.png',
      email: 'support@pole-emploi.io',
      type: DataProviderType.api,
      component: ApiIndemnisationPoleEmploi,
    },
    agent_connect_fi: {
      label: 'AgentConnect - fournisseur d’identité',
      icon: 'logo-agentconnect.png',
      email: 'support.partenaires@agentconnect.gouv.fr',
      type: DataProviderType.api,
      component: AgentConnectFi,
    },
    agent_connect_fs: {
      label: 'AgentConnect - fournisseur de service',
      icon: 'logo-agentconnect.png',
      email: 'support.partenaires@agentconnect.gouv.fr',
      type: DataProviderType.api,
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
