import React from 'react';
import Form from '../components/templates/Form';
import OrganisationSection from '../components/organisms/form-sections/OrganisationSection';
import DemarcheEnLigneSection from '../components/organisms/form-sections/hubee-sections/DemarcheEnLigneSection';
import ÉquipeSection from '../components/organisms/form-sections/ÉquipeSection';
import CguSection from '../components/organisms/form-sections/CguSection';
import { DATA_PROVIDER_PARAMETERS } from '../config/data-provider-parameters';
import IntituleInitializerSection from '../components/organisms/form-sections/hubee-sections/IntituleInitializerSection';

const initialContacts = {
  demandeur: {
    header: 'Demandeur',
    description: (
      <>
        <b>Le demandeur</b>, c’est vous, dépose la demande d’abonnement.
      </>
    ),
    forceDisable: true,
  },
  responsable_metier: {
    header: 'Responsable d’abonnement',
    description: (
      <>
        <b>Le responsable d’abonnement</b> disposera des droits d’administration
        sur le portail HubEE : gestion des abonnements et gestion des
        utilisateurs.
      </>
    ),
    displayIndividualEmailLabel: true,
  },
  responsable_traitement: null,
  delegue_protection_donnees: null,
  responsable_technique: null,
};

const demarchesHubee = [
  {
    id: 'EtatCivil',
    label: 'AEC - Acte d’Etat Civil',
    description: (
      <>
        Ce service donne la possibilité aux usagers d’effectuer sur internet
        leurs demandes d’actes de naissance, de mariage, de décès.
      </>
    ),
  },
  {
    id: 'depotDossierPACS',
    label:
      'DDPACS - Démarche en ligne de préparation à la conclusion d’un Pacs',
    description: (
      <>
        Ce service permet à des usagers souhaitant se pacser de compléter en
        ligne les informations nécessaires à cette union (actuellement contenues
        dans les Cerfa) et de télécharger leurs pièces justificatives (actes de
        naissance convention spécifique de PACS le cas échéant). L’ensemble est
        envoyé à la commune chargée de conclure le PACS (à savoir la mairie de
        résidence commune des partenaires).
      </>
    ),
  },
  {
    id: 'recensementCitoyen',
    label: 'RCO - Recensement Citoyen Obligatoire',
    description: (
      <>
        Ce service permet à un jeune de transmettre son dossier en ligne à la
        mairie, sans déplacement et à tout moment de la journée. La commune peut
        en retour envoyer l’attestation de recensement vers le porte-documents
        sécurisé sur le compte personnel de l’usager. Tout français âgé de 16
        ans doit spontanément se faire recenser auprès de sa mairie (ou auprès
        de son Consulat, lorsqu’il réside à l’étranger) en vue de participer à
        la Journée Défense et Citoyenneté (JDC). Tous les jeunes français,
        garçons et filles, sont concernés. Cette formalité est obligatoire pour
        avoir le droit de se présenter aux concours et examens publics
        (Baccalauréat, permis de conduire, etc.).
      </>
    ),
  },
  {
    id: 'HebergementTourisme',
    label: 'DHTOUR - Déclaration d’hébergement touristique',
    description: (
      <>
        Ce service permet aux particuliers et professionnels de déclarer en
        ligne un meublé de tourisme ou une chambre d’hôtes. Ce service peut être
        proposé par les municipalités qui collectent la taxe de séjour
        uniquement (métropoles de droit commun).
      </>
    ),
  },
  {
    id: 'JeChangeDeCoordonnees',
    label: 'JCC - Déclaration de Changement de Coordonnées',
    description: (
      <>
        Ce service permet à un usager de déclarer rapidement et facilement un
        changement d’adresse postale lors d’un déménagement ou d’une
        modification administrative. Via ce service, l’usager peut également
        procéder à la mise à jour de son adresse électronique, ses numéros de
        téléphone fixe et de portable. Il peut ainsi signaler à sa commune son
        changement de coordonnées. Tout nouvel arrivant a par ailleurs la
        possibilité de préciser la composition de son foyer (nombre d’adultes et
        d’enfants, âge des enfants). Tout opérateur de service, public ou privé
        (téléphonie, énergie, etc.), peut faire une demande d’abonnement auprès
        de la direction de l’information légale et administrative (DILA) qui en
        étudiera la faisabilité juridique (demande réalisée via le portail du
        Hub d’Échange de l’État).
      </>
    ),
  },
];
const target_api = 'hubee_portail_dila';

const HubeePortailDila = () => (
  <Form
    target_api={target_api}
    contactEmail={DATA_PROVIDER_PARAMETERS[target_api]?.email}
    documentationUrl="https://www.numerique.gouv.fr/dinum/"
  >
    <OrganisationSection />
    <IntituleInitializerSection value="Abonnement au portail HubEE" />
    <DemarcheEnLigneSection demarchesHubee={demarchesHubee} />
    <ÉquipeSection initialContacts={initialContacts} />
    <CguSection cguLink="/docs/20210212_dinum_hubee_cgu_v2_1_0_version_site.pdf" />
  </Form>
);

export default HubeePortailDila;
