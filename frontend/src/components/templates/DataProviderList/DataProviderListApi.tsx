import React from 'react';
import ListHeader from '../../molecules/ListHeader';
import { DataProviderCard } from './DataProviderCard';
import Button from '../../atoms/hyperTexts/Button';
import useListItemNavigation from '../hooks/use-list-item-navigation';

const { REACT_APP_API_GOUV_HOST: API_GOUV_HOST } = process.env;

const DataProvidersApis = [
  {
    title: 'API Ingres - Nomenclatures',
    target_api: 'api_ingres',
    tagline:
      'Récupérez l’ensemble des référentiels utilisés par les Systèmes d’Information des Ressources Humaines de la Fonction Publique d’Etat',
    path: 'les-api/API_Ingres_Nomenclatures',
    logo: 'images/api-logo/logo-cisirh.png',
  },
  {
    title: 'API Ingres - Noyau',
    target_api: 'api_ingres',
    tagline:
      'Récupérez l’ensemble des référentiels utilisés par les Systèmes d’Information des Ressources Humaines de la Fonction Publique d’Etat',
    path: 'les-api/API_Ingres_Noyau',
    logo: 'images/api-logo/logo-cisirh.png',
  },
  {
    title: 'AgentConnect',
    target_api: 'agent_connect_fs',
    tagline:
      'Simplifiez le quotidien des agents publics de l’Etat en leur permettant d’utiliser un même identifiant et mot de passe pour accéder à leurs services en ligne.',
    path: 'les-api/agent-connect',
    logo: 'images/api-logo/dinum.png',
  },
  {
    title: 'API CaptchEtat',
    target_api: 'api_captchetat',
    tagline: 'Générer un CAPTCHA pour sécuriser un service en ligne',
    path: 'les-api/api-captchetat',
    logo: 'images/api-logo/ChorusPro.jpg',
  },
  {
    title: 'API Tierce Déclaration auto-entrepreneur',
    target_api: 'api_declaration_auto_entrepreneur',
    tagline:
      'Connectez-vous directement à l’Urssaf pour déclarer les chiffres d’affaires pour le compte d’un auto-entrepreneur en tant que tiers-déclarant',
    path: 'les-api/api-declaration-auto-entrepreneur',
    logo: 'images/api-logo/urssaf.jpg',
  },
  {
    title: 'API Tierce Déclaration Cesu',
    target_api: 'api-declaration-cesu',
    tagline:
      'Connectez-vous directement à l’Urssaf pour accéder aux services du Cesu pour le compte d’un particulier employeur en tant que tiers-déclarant',
    path: 'les-api/api-declaration-cesus',
    logo: 'images/api-logo/urssaf.jpg',
  },
  {
    title: 'API Entreprise',
    target_api: 'api-entreprise',
    tagline:
      'Entités administratives, simplifiez les démarches des entreprises et des associations en récupérant pour elles leurs informations administratives.',
    path: 'les-api/api-entreprise',
    logo: 'images/api-logo/dinum.png',
  },
  {
    title: 'API Indemnisation Pôle emploi',
    target_api: 'api-indemnisation-pole-emploi',
    tagline: 'Connaitre la situation d’indemnisation d’un demandeur d’emploi',
    path: 'les-api/api-indemnisation-pole-emploi',
    logo: 'images/api-logo/logo_pole_emploi.jpg',
  },
  {
    title: 'API Indemnités Journalières de la CNAM',
    target_api: 'api-indemnites-journalieres-cnam',
    tagline:
      "Accédez au montant des indemnités journalières de l'Assurance Maladie payé à un assuré sur une période.",
    path: 'les-api/api-indemnites-journalieres-cnam',
    logo: 'images/api-logo/cnam.jpg',
  },
  {
    title: 'API Particulier',
    target_api: 'api-particulier',
    tagline:
      'Entités administratives, simplifiez les démarches des particuliers en récupérant pour eux leurs informations administratives (quotient familial CAF, composition familiale, statut demandeur d’emploi, étudiant et étudiant boursier)',
    path: 'les-api/api-particulier',
    logo: 'images/api-logo/dinum.png',
  },
  {
    title: 'API Pro Santé Connect',
    target_api: 'api-pro-sante-connect',
    tagline:
      'Authentifier les professionnels de la santé à partir du Répertoire Partagé des Professionnels de Santé (RPPS)',
    path: 'les-api/api-pro-sante-connect',
    logo: '/images/api-logo/ans.png',
  },
  {
    title: 'API Service National',
    target_api: 'api-service-national',
    tagline:
      'Vérifiez si un candidat est en règle vis-à-vis de ses obligations de Service National et peut s’inscrire au concours ou à l’examen dont vous êtes en charge.',
    path: 'les-api/api-service-national',
    logo: 'images/api-logo/minarm.jpg',
  },
  {
    title: "API statut demandeur d'emploi",
    target_api: 'api-statut-demandeur-emploi',
    tagline:
      'Vérifier si une personne a le statut de demandeur d’emploi sans lui demander de justificatif',
    path: 'les-api/api-statut-demandeur-emploi',
    logo: 'images/api-logo/logo_pole_emploi.jpg',
  },
  {
    title: 'API Statut étudiant boursier',
    target_api: 'api-statut-etudiant-boursier',
    tagline:
      'Vérifiez si un individu identifié avec FranceConnect est un étudiant boursier',
    path: 'les-api/api-statut-etudiant-boursier',
    logo: 'images/api-logo/logo-cnous.png',
  },
  {
    title: 'API Statut Etudiant',
    target_api: 'api-statut-etudiant',
    tagline:
      'Vérifiez si une personne est inscrite dans un établissement de l’enseignement supérieur',
    path: 'les-api/api-statut-etudiant',
    logo: 'images/api-logo/mesri.png',
  },
  {
    title: 'API Tiers de prestation',
    target_api: 'api_tiers_de_prestation',
    tagline:
      'Transmettez directement les factures de service à la personne à l’Urssaf pour que vos clients bénéficient de l’avance immédiate de crédit d’impôt.',
    path: 'les-api/api-tiers-de-prestation',
    logo: 'images/api-logo/urssaf.jpg',
  },
  {
    title: "API de droits à l'Assurance Maladie",
    target_api: 'api_ameli_droits_cnam',
    tagline:
      'Accédez aux droits d’un individu ou d’une famille (enfants rattachés), gérés par le régime général de l’Assurance Maladie',
    path: 'les-api/api_ameli_droits_cnam',
    logo: 'images/api-logo/cnam.jpg',
  },
  {
    title: 'API Fichier des Comptes Bancaires et Assimilés (FICOBA)',
    target_api: 'api_comptes_bancaires_ficoba',
    tagline:
      'Accédez aux coordonnées bancaires d’un usager connues de l’administration fiscale (DGFIP) et transmises par les établissements bancaires',
    path: 'les-api/api_comptes_bancaires_ficoba',
    logo: 'images/api-logo/logo-dgfip.jpg',
  },
  {
    title: 'API Recherche des personnes physiques (R2P)',
    target_api: 'api_r2p',
    tagline:
      'Récupérez les données connues par l’administration fiscale (DGFIP) sur une personne physique (état civil, adresse, identifiant fiscal)',
    path: 'les-api/api_r2p',
    logo: 'images/api-logo/logo-dgfip.jpg',
  },
  {
    title: 'FranceConnect et les API FranceConnectées',
    target_api: 'franceconnect',
    tagline:
      'Identifier les utilisateurs de votre site internet et accéder à certaines données d’identité certifiées. Accéder à des données supplémentaires via les API FranceConnectées',
    path: 'les-api/franceconnect',
    logo: 'images/api-logo/dinum.png',
  },
  {
    title: 'API Impôt particulier',
    target_api: 'impot_particulier',
    tagline:
      'Raccordez-vous directement à la DGFiP pour récupérer les éléments fiscaux nécessaires à vos téléservices, éliminez le traitement et le stockage des pièces justificatives',
    path: 'les-api/impot-particulier',
    logo: 'images/api-logo/logo-dgfip.jpg',
  },
  {
    title: 'le.taxi',
    target_api: 'le_taxi',
    tagline: 'Un clic, un taxi',
    path: 'les-api/le-taxi',
    logo: 'images/api-logo/dinum.png',
  },
  {
    title: 'API Impôt particulier via FranceConnect',
    target_api: 'impot_particulier_fc_sandbox',
    tagline:
      'Raccordez-vous directement à la DGFiP pour récupérer les éléments fiscaux nécessaires à vos téléservices, éliminez le traitement et le stockage des pièces justificatives',
    path: 'les-api/impot-particulier',
    logo: 'images/api-logo/logo-dgfip.jpg',
  },
];

export const DataProviderListApi = () => {
  const { goBackToList } = useListItemNavigation();

  return (
    <main className="list-page">
      <ListHeader title="Demander une nouvelle habilitation" />

      <div className="page-container list-container">
        <div className="list-title">
          <Button onClick={() => goBackToList()} secondary icon="arrow-left">
            retour
          </Button>
        </div>
        {DataProvidersApis.map(({ title, target_api, tagline, path, logo }) => (
          <DataProviderCard
            key={target_api}
            label={title ?? ''}
            iconPath={`${API_GOUV_HOST}/${logo}`}
            passPath={`${API_GOUV_HOST}/${target_api}`}
            description={tagline}
            aboutLink={`${API_GOUV_HOST}/${path}`}
          />
        ))}
      </div>
    </main>
  );
};

export default DataProviderListApi;
