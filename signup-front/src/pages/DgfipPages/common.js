import React from 'react';

export const DataAreInTermsOfUseDescription = () => (
  <>
    <p>
      Les données restituées par l’API sont décrites dans les CGU attachées à
      cette demande.
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
