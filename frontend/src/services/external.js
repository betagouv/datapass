import httpClient from '../lib/http-client';
import { memoize } from 'lodash';
import { RateLimiter } from 'limiter';
import MatomoTracker from '@datapunt/matomo-tracker-js';
import matomoConfiguration from '../config/matomo-configuration';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

const tracker = new MatomoTracker(matomoConfiguration);

const limiter = new RateLimiter({ tokensPerInterval: 2, interval: 300 });

const getOrganizationInformation = async (siret) => {
  await limiter.removeTokens(1);
  tracker.trackEvent({
    category: 'get-organization-information',
    action: 'on-call',
  });

  const {
    etablissement: {
      nom_raison_sociale,
      adresse,
      code_postal,
      libelle_commune,
      activite_principale,
      activite_principale_label,
      etat_administratif,
    },
  } = await httpClient
    .get(`${BACK_HOST}/api/insee/etablissement/${siret}`, {
      headers: { 'Content-type': 'application/json' },
    })
    .then(({ data }) => data);

  return {
    title: nom_raison_sociale,
    activite: activite_principale,
    activite_label: activite_principale_label,
    adresse,
    code_postal,
    ville: libelle_commune,
    etat_administratif,
    siret,
  };
};

export const getCachedOrganizationInformation = memoize(
  getOrganizationInformation
);

export const getCachedOrganizationInformationPool = async (sirets) => {
  const promises = sirets.map((siret) =>
    getCachedOrganizationInformation(siret)
  );

  return await Promise.all(promises);
};
