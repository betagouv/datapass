import React from 'react';
import PropTypes from 'prop-types';

import Form from '../../components/templates/Form';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import DemarcheSection from '../../components/organisms/form-sections/deprecated/DemarcheSection';
import DescriptionSection from '../../components/organisms/form-sections/deprecated/DescriptionSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/deprecated/CadreJuridiqueSection';
import CguSection from '../../components/organisms/form-sections/deprecated/CguSection';
import MiseEnOeuvreSection from '../../components/organisms/form-sections/deprecated/MiseEnOeuvreSection';
import demarches from './demarches.json';
import Helper from '../../components/atoms/Helper';
import { SolutionLogicielleSection } from '../../components/organisms/form-sections/hubee-sections/SolutionLogicielleSection';
import ExpandableQuote from '../../components/atoms/inputs/ExpandableQuote';
import { DATA_PROVIDER_CONTACT_EMAILS } from '../../config/data-provider-parameters';

const DemarcheDescription = () => (
  <>
    <div className="notification grey">
      <p>
        <b>Le Hub d’Échange de l’État (HubEE)</b>, sous la responsabilité de la
        Direction Interministérielle du numérique (DINUM), assure la
        transmission des démarches accessibles depuis « service-public.fr » ou
        depuis une application métier
        <Helper
          title={
            'La démarche en ligne « CertDc » assurant la transmission du volet ' +
            'administratif du certificat de décès est réalisée depuis ' +
            'l’application Web CertDc mise à disposition des médecins par la ' +
            'Direction Générale de la Santé (DGS).'
          }
        />
        vers les communes en charge de leurs instructions.
      </p>
      <p>
        Ce service est accessible sur abonnement des communes. Il est gratuit et
        sa mise en œuvre est simple et rapide.
      </p>
      <p>
        Pour l’utiliser, vous devez vous engager à traiter la bonne donnée par
        le bon agent de votre administration et informer correctement l’usager.
      </p>
    </div>
    <ExpandableQuote title="Plus d’info" large>
      <p>
        La direction interministérielle du numérique (DINUM) est en charge de la
        transformation numérique de l’État au bénéfice du citoyen comme de
        l’agent, sous tous ses aspects : modernisation du système d’information
        de l’État, qualité des services publics numériques, création de services
        innovants pour les citoyens, outils numériques de travail collaboratif
        pour les agents…
      </p>
      <p>
        Le <b>Hub d’Échange de l’État (HubEE)</b> est un de ces services
        innovants. En assurant le transport sécurisé
        <Helper
          title={
            'Ce transport est actuellement majoritairement assuré par la plateforme' +
            'd’échange et de confiance mise à disposition par la direction de l’information' +
            'légale et administrative (DILA). Le Hub d’Échange de l’État (HubEE) va remplacer' +
            'progressivement cette plateforme dont l’arrêt est prévu à l’été 2022.'
          }
        />
        des demandes issues des démarches en ligne accessibles depuis un service
        Web ou une application métier vers le service en charge de leurs
        instructions, il est un accélérateur de la digitalisation de
        l’administration au bénéfice de tous. Il est ainsi possible, à ce jour,
        de dématérialiser des démarches issues :
      </p>
      <ul>
        <li>du site « service-public.fr »</li>
        <li>
          de l’application métier relative à la Certification électronique des
          Décès (CertDc)
        </li>
        <li>
          des applications métiers de la Caisse Nationale des Allocations
          Familiales (CNAF)
        </li>
        <li>
          du Service National d’Accueil Téléphonique pour l’Enfance en Danger
          (SNATED)
        </li>
      </ul>
      <p>
        Plusieurs de ces démarches sont dévolues aux échanges avec les communes
        et plus de 9 500 communes, de toute taille et réparties sur l’ensemble
        du territoire, sont abonnées à au moins une des démarches suivantes :
      </p>
      <ul>
        <li>Acte d’État Civil (AEC)</li>
        <li>Recensement citoyen obligatoire (RCO)</li>
        <li>Déclaration de changement de coordonnées (JCC)</li>
        <li>Dépôt de dossier PACS (DDPACS)</li>
        <li>Déclaration d’ouverture de chantier (DOC)</li>
        <li>Déclaration d’un hébergement de tourisme (DHTOUR)</li>
        <li>Certificat de décès (CertDc)</li>
      </ul>
      <p>
        L’abonnement des communes à ces démarches est simple, gratuit et rapide.
        Pour ce faire la DINUM met à votre disposition ce formulaire
        « DataPass » dédié à la mise en relation entre fournisseurs de données
        (les sites proposant des démarches en ligne) et consommateurs (les
        services instructeurs, soit dans le cas présent les communes). Il a été
        mis en place dans le cadre de l’article L114-8 du code des relations
        entre public et l’administration (CRPA).
      </p>
    </ExpandableQuote>
    <br />
  </>
);

const contacts = {
  contact_metier: {
    heading: 'Responsable abonnement',
    // set a key to avoid « each key should have a unique key property »
    // error when including multiple elements
    description: (
      <ExpandableQuote title="À quoi servent ces informations ?" large>
        <p key="p1">
          Cette personne disposera des droits d’accès à la gestion des
          abonnements au sein du Hub d’Échange de l’État. Elle sera contactée en
          cas de problème technique.
        </p>
        <p key="p2">
          Le responsable de l’abonnement disposera des droits « d’administrateur
          local » au sein du Hub d'Échange de l’État. À ce titre, il sera en
          charge :
        </p>
        <ul key="u1">
          <li key="l1">
            de la gestion des abonnements : choix de la date d’activation de
            l’abonnement, choix du mode d’accès (API ou Portail), choix des
            paramètres de notification (activation, fréquence)
          </li>
          <li key="l2">
            de la gestion des utilisateurs lorsque le mode d’accès Portail a été
            sélectionné : création des comptes utilisateurs et sélection des
            démarches autorisées.
          </li>
          <li key="l3">
            de la gestion du compte « délégué technique » lorsque le mode
            d’accès API a été sélectionné. Le délégué technique peut être une
            personne au sein de votre commune ou une personne au sein de la
            société éditrice de votre solution logicielle. Il disposera aussi
            des droits de gestion sur les abonnements mais pas des droits de
            création des utilisateurs.
          </li>
          <li key="l4">
            de la supervision des flux et des statistiques d’usage.
          </li>
        </ul>
        <br key="br1" />
      </ExpandableQuote>
    ),
    family_name: '',
    given_name: '',
    email: '',
    phone_number: '',
    job: '',
  },
  responsable_technique: {
    heading: 'Délégué(e) technique',
    // set a key to avoid « each key should have a unique key property »
    // error when including multiple elements
    description: (
      <ExpandableQuote title="À quoi servent ces informations ?" large>
        <p key="p1">
          Ce rôle n’est à définir que si vous optez pour un mode d’accès aux
          démarches via les API.
        </p>
        <p key="p2">
          Le mode d’accès API doit être choisi si vous souhaitez pouvoir
          intégrer directement les données issues des démarches en ligne au sein
          de vos progiciels métiers. Ce choix impose de disposer de solutions
          métiers adaptées.
        </p>
        <p key="p3">
          <b key="b1">Avant de faire ce choix</b>, nous vous remercions de
          <b key="b2">prendre contact avec votre ou vos éditeurs</b> pour vous
          assurer que
          <b key="b3">
            l’intégration de l’API du Hub d'Échange de l'État est opérationnelle
            pour votre commune. Si ce n’est pas le cas, les données de vos
            usagers seront perdues.
          </b>
        </p>
        <p key="p4">
          Cette personne disposera des droits d’accès à la gestion des
          abonnements au sein du Hub d’Échange de l’État. Elle pourra également
          être contactée en cas de problème technique.
        </p>
      </ExpandableQuote>
    ),
    family_name: '',
    given_name: '',
    email: '',
    phone_number: '',
    job: '',
  },
};

const CadreJuridiqueDescription = () => (
  <ExpandableQuote title="Comment remplir votre cadre juridique ?">
    <p>
      La loi n° 78-17 du 6 janvier 1978 relative à l’informatique, aux fichiers
      et aux libertés définit les principes à respecter lors de la collecte, du
      traitement et de la conservation de données personnelles.
    </p>
    <p>
      Pour pouvoir bénéficier de l’abonnement aux démarches en ligne, le cadre
      légal et réglementaire doit permettre la transmission des données
      personnelles issues des démarches en ligne à votre commune.
    </p>
    <p>
      Attention cette base légale ne concerne que les communes en charge de
      l’instruction des démarches de « service-public.fr ». Si vous n’êtes pas
      concerné par ce cas, veuillez préciser votre base légale.
    </p>
  </ExpandableQuote>
);

const target_api = 'hubee';

const Hubee = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api={target_api}
    contactInformation={[
      {
        email: DATA_PROVIDER_CONTACT_EMAILS.hubee,
        label: 'Nous contacter',
        subject: 'Contact%20via%20datapass.api.gouv.fr',
      },
    ]}
    title="Demande d’abonnement à une démarche en ligne"
    DemarcheDescription={DemarcheDescription}
    demarches={demarches}
    documentationUrl="https://www.numerique.gouv.fr/dinum/"
  >
    <OrganisationSection />
    <DemarcheSection
      title="Les démarches en ligne auxquelles vous souhaitez abonner votre commune"
      body="Sélectionnez les démarches en lignes auxquelles vous souhaitez abonner votre commune :"
    />
    <DescriptionSection
      title="Description du téléservice"
      intituleLabel="Nom du téléservice"
    />
    <CadreJuridiqueSection
      CadreJuridiqueDescription={CadreJuridiqueDescription}
    />
    <MiseEnOeuvreSection
      title={'L’équipe en charge du téléservice'}
      MiseEnOeuvreDescription={() => null}
      initialContacts={contacts}
    />
    <SolutionLogicielleSection />
    <CguSection cguLink="/docs/20210212_dinum_hubee_cgu_v2_1_0_version_site.pdf" />
  </Form>
);

Hubee.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

Hubee.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default Hubee;
