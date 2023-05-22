import React, { ReactNode } from 'react';

export enum ScopeWarningModalType {
  rgpd = 'rgpd',
  fc_incomplete = 'fc_incomplete',
  apientreprise_sensitive = 'apientreprise_sensitive',
  apientreprise_sensitive_effectifs = 'apientreprise_sensitive_effectifs',
}

export type ScopeWarningModalConfiguration = {
  title: string;
  body: ReactNode;
};

export const ScopeWarningModalConfigurations: {
  [key in ScopeWarningModalType]: ScopeWarningModalConfiguration;
} = {
  rgpd: {
    title: 'Vous souhaitez ajouter des données',
    body: (
      <>
        <p>
          Afin de respecter le principe <b>RGPD</b> de minimisation de la
          circulation des données personnelles, nous effectuons un contrôle de
          cohérence entre les données demandées et l’usage décrit.
        </p>
        <p>
          <b>
            Une demande d’habilitation non conforme fera l’objet d’un retour
            pour rectification, et donc d’un délai supplémentaire.
          </b>
        </p>
      </>
    ),
  },
  fc_incomplete: {
    title: 'Cette donnée n’est pas vérifiée',
    body: 'Elle ne sera transmise que si elle est disponible chez le fournisseur d’identité.',
  },
  apientreprise_sensitive: {
    title: 'Avez-vous vraiment besoin de cette donnée ?',
    body:
      "Cette donnée est particulièrement sensible, elle n'est pas autorisée dans le cadre des " +
      '"marchés publics" et "pré-remplissage". Elle peut être autorisée pour certaines ' +
      '"aides et subventions publiques". ' +
      "Pour que votre demande d'accès à cette donnée aboutisse, vous devez justifier dans ce formulaire " +
      "d'un cadre légal adéquat et d'un contexte d'usage attestant de l'utilité de cette donnée pour votre service.",
  },
  apientreprise_sensitive_effectifs: {
    title: 'Avez-vous vraiment besoin de cette donnée ?',
    body:
      'Cette donnée est particulièrement sensible. ' +
      "Pour que votre demande d'accès à cette donnée aboutisse, " +
      "vous devez justifier dans ce formulaire d'un cadre légal adéquat et d'un contexte d'usage attestant de l'utilité de cette donnée pour votre service. " +
      'Une donnée moins précise est disponible avec les API "Données de référence d’une entité - INSEE & Infogreffe" ' +
      'et "Données de référence d\'un établissement - INSEE & Infogreffe" (premières API cochables dans la liste). ' +
      "Il s'agit des tranches d’effectifs au sens de l’INSEE . Si vous n’avez pas besoin de l’effectif exact, ces API sont suffisantes.",
  },
};

export default ScopeWarningModalConfigurations;
