import React, { ReactNode } from 'react';

export enum ScopeWarningModalType {
  rgpd = 'rgpd',
  fc_incomplete = 'fc_incomplete',
  apientreprise_sensitive = 'apientreprise_sensitive',
}

export type ScopeWarningModalConfiguration = {
  title: string;
  body: string | ReactNode;
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
};

export default ScopeWarningModalConfigurations;
