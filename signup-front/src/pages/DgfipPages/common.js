import React from 'react';
import Quote from '../../components/atoms/inputs/Quote';

export const contacts = {
  responsable_technique: {
    heading: 'Responsable technique',
    description: (
      <Quote>
        <p>
          Cette personne recevra les accès techniques par mail. Elle pourra
          également être contactée par téléphone pour faciliter le raccordement
          à l’API. Le responsable technique peut être le contact technique de
          votre prestataire.
        </p>
      </Quote>
    ),
    family_name: '',
    given_name: '',
    email: '',
    phone_number: '',
  },
};

export const DonneesDescription = () => (
  <Quote>
    <p>
      La loi informatique et libertés définit les principes à respecter lors de
      la collecte, du traitement et de la conservation de données personnelles.
    </p>
    <p>L’article 6 précise :</p>
    <ul>
      <li>
        3° [les données] sont adéquates, pertinentes et non excessives au regard
        des finalités pour lesquelles elles sont collectées et de leurs
        traitements ultérieurs ;
      </li>
      <li>
        4° Elles sont exactes, complètes et, si nécessaire, mises à jour ; les
        mesures appropriées doivent être prises pour que les données inexactes
        ou incomplètes au regard des finalités pour lesquelles elles sont
        collectées ou traitées soient effacées ou rectifiées ;
      </li>
    </ul>
    <p>
      Nous vous remercions de sélectionner uniquement les données strictement
      nécessaires à votre téléservice.
    </p>
    <p>
      Le non-respect du principe de proportionnalité vous expose vis à vis de la
      CNIL.
    </p>
  </Quote>
);

export const SuiteDescription = () => (
  <Quote>
    <p>
      Après avoir cliqué sur « Soumettre la demande », les prochaines étapes
      sont :
    </p>
    <ol>
      <li>Le fournisseur de données de l’API va instruire la demande.</li>
      <li>
        En cours d’instruction, le fournisseur de données pourra vous demander
        par courriel des informations supplémentaires.
      </li>
      <li>
        Après instruction, vous serez informé par courriel de l’acceptation ou
        du refus de votre demande.
      </li>
    </ol>
    <p>En cas d’acceptation de votre demande :</p>
    <ul>
      <li>
        Le contact technique recevra par courriel les informations nécessaires
        pour accéder à l’environnement de test (bac à sable) de l’API.
      </li>
      <li>
        Vous recevrez par courriel un lien vers un deuxième formulaire à remplir
        afin d’accéder à l’environnement de production de l’API.
      </li>
    </ul>
  </Quote>
);

export const DemarcheDescriptionProduction = () => (
  <div className="notification grey">
    <p>
      Votre demande d’habilitation pour accéder à l’API « bac à sable » a été
      acceptée, vous pouvez maintenant construire votre démarche/téléservice en
      utilisant l’API exposée dans un environnement bac à sable. Parallèlement
      au développement, vous devez remplir les informations ci-dessous. Elles
      sont nécessaires pour obtenir l’habilitation de l’accès à l’API de
      production.
    </p>
  </div>
);

export const PreviousEnrollmentDescription = () => (
  <Quote>
    <p>
      Vous devez tout d’abord sélectionner la démarche que vous souhaitez
      poursuivre.
    </p>
  </Quote>
);
