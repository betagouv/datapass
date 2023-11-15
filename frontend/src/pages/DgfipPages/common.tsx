import React from 'react';

export const DataAreInTermsOfUseDescription = () => (
  <>
    <p>
      Les données restituées par l’API sont décrites dans les CGU attachées à
      cette habilitation.
    </p>
  </>
);

export const additionalTermsOfUse = [
  {
    id: 'rgpd_general_agreement',
    label: (
      <>
        J’atteste que mon organisation devra déclarer à la DGFiP
        l’accomplissement des formalités en matière de protection des données à
        caractère personnel et qu’elle veillera à procéder à l’homologation de
        sécurité de son projet.
      </>
    ),
  },
];

export const DonneesDescription = () => (
  <>
    <p>
      La loi informatique et libertés définit les principes à respecter lors de
      la collecte, du traitement et de la conservation de données personnelles.
    </p>
    <p>L’article 4 précise :</p>
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
      nécessaires à votre téléservice. Le non-respect du principe de
      proportionnalité vous expose vis à vis de la CNIL.
    </p>
  </>
);
