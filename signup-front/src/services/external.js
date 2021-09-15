import httpClient from '../lib/http-client';
import { memoize } from 'lodash';
import rateLimit from 'axios-rate-limit';

const BACK_HOST = process.env.VITE_BACK_HOST;

const rateLimitedHttpClient = rateLimit(httpClient, {
  maxRequests: 2,
  perMilliseconds: 300,
});

function getOrganizationActivityDetails(NafCode) {
  return httpClient
    .get(`${BACK_HOST}/api/insee/code_naf/${NafCode}`, {
      headers: { 'Content-type': 'application/json' },
    })
    .then(({ data }) => data);
}

export const getCachedOrganizationActivityDetails = memoize(
  getOrganizationActivityDetails
);

const getOrganizationInformation = async (siret) => {
  const {
    data: {
      etablissement: {
        numero_voie,
        indice_repetition,
        type_voie,
        libelle_voie,
        code_postal,
        libelle_commune,
        activite_principale,
        denomination_usuelle,
        etat_administratif,
        unite_legale: {
          denomination,
          nom,
          prenom_1,
          prenom_2,
          prenom_3,
          prenom_4,
        },
      },
    },
  } = await rateLimitedHttpClient.get(
    `https://entreprise.data.gouv.fr/api/sirene/v3/etablissements/${siret}`
  );

  const adresse = [numero_voie, indice_repetition, type_voie, libelle_voie]
    .filter((e) => e)
    .join(' ');

  const prenom_nom = [prenom_1, prenom_2, prenom_3, prenom_4, nom]
    .filter((e) => e)
    .join(' ');

  return {
    title: denomination || denomination_usuelle || prenom_nom,
    activite: `${activite_principale}`,
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
