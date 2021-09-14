import {
  chain,
  isBoolean,
  isEmpty,
  isInteger,
  isObject,
  isString,
  mapKeys,
  mapValues,
  mergeWith,
  omitBy,
  forOwn,
  slice,
} from 'lodash';
import flatten from 'flat';

export function getErrorMessages(error) {
  if (!isEmpty(error.response) && isObject(error.response.data)) {
    return chain(error.response.data).values().flatten().value();
  }

  const errorMessageEnd =
    'Merci de réessayer ultérieurement. ' +
    'Vous pouvez également nous signaler cette erreur par mail à contact@api.gouv.fr.';

  if (!isEmpty(error.response)) {
    return [
      `Une erreur est survenue. Le code de l’erreur est ${error.response.status} (${error.response.statusText}). ${errorMessageEnd}`,
    ];
  }

  if (error.message === 'Network Error') {
    return [
      'Une erreur de connection au serveur est survenue. ' +
        'Merci de vérifier que vous êtes bien connecté à internet. ' +
        'Si vous utilisez un réseau d’entreprise, merci de signaler cette erreur à ' +
        'l’administrateur de votre réseau informatique. ' +
        'Si le problème persiste, vous pouvez nous contacter par mail à ' +
        'contact@api.gouv.fr.',
    ];
  }

  console.error(error);
  return [`Une erreur inconnue est survenue. ${errorMessageEnd}`];
}

const publicServicesNAFCodes = [
  '84', // SERVICES D’ADMINISTRATION PUBLIQUE ET DE DÉFENSE ; SERVICES DE SÉCURITÉ SOCIALE OBLIGATOIRE
  '85', // ENSEIGNEMENT
  '86', // ACTIVITÉS POUR LA SANTÉ HUMAINE
  '88', // Action sociale sans hébergement
];

const validNAFCode = {
  api_particulier: publicServicesNAFCodes,
  hubee: ['84.11Z'], // Administration publique générale
};

export function isValidNAFCode(provider, NAFcode) {
  if (!isString(NAFcode)) {
    return false;
  }

  if (isEmpty(validNAFCode[provider])) {
    return true;
  }

  if (!validNAFCode[provider].some((code) => NAFcode.startsWith(code))) {
    return false;
  }

  return true;
}

const diffFieldLabels = {
  cgu_approved: 'de l’approbation des CGU',
  data_recipients: 'des destinataires des données',
  data_retention_period: 'de la durée de conservation des données',
  data_retention_comment:
    'de la justification de la durée de conservation des données',
  description: 'de la description',
  fondement_juridique_title: 'de la référence du cadre juridique',
  fondement_juridique_url: 'de l’url du cadre juridique',
  intitule: 'de l’intitulé',
  dpo_family_name: 'du nom du DPD',
  dpo_id: 'de l’identifiant du DPD',
  dpo_phone_number: 'du numéro de téléphone du DPD',
  responsable_traitement_family_name: 'du nom du responsable de traitement',
  responsable_traitement_id: 'de l’identifiant du responsable de traitement',
  responsable_traitement_phone_number:
    'du numéro de téléphone du responsable de traitement',
  'contacts.0.nom': 'du nom du contact 1',
  'contacts.0.email': 'de l’email du contact 1',
  'contacts.0.phone_number': 'du numéro de téléphone du contact 1',
  'contacts.1.nom': 'du nom du contact 2',
  'contacts.1.email': 'de l’email du contact 2',
  'contacts.1.phone_number': 'du numéro de téléphone du contact 2',
};

function flattenDiffTransformer(accumulatorObject, fullObjectDiff, objectKey) {
  if (!isObject(fullObjectDiff[0])) {
    accumulatorObject[objectKey] = fullObjectDiff;

    return accumulatorObject;
  }
  // {contacts: [[{'name': 'c', email: 'd'}], [{'name': 'e', email: 'd'}]]}
  const objectBefore = flatten(fullObjectDiff[0], objectKey);
  const objectAfter = flatten(fullObjectDiff[1], objectKey);
  const objectDiff = mergeWith(
    objectBefore,
    objectAfter,
    (valueBefore, valueAfter) => [valueBefore, valueAfter]
  );
  // {0.name: ['c', 'e'], 0.email: ['d', 'd']}
  const objectDiffNoUnchanged = omitBy(
    objectDiff,
    (value) => value[0] === value[1]
  );
  // {0.name: ['c', 'e']}
  const objectDiffPrefixedKey = mapKeys(
    objectDiffNoUnchanged,
    (value, flatKey) => `${objectKey}.${flatKey}`
  );
  // {contacts.0.name: ['c', 'e']}
  Object.assign(accumulatorObject, objectDiffPrefixedKey);

  return accumulatorObject;
}

function changelogFormatTransformer(
  accumulatorArray,
  [valueBefore, valueAfter],
  key
) {
  const label = diffFieldLabels[key] ? diffFieldLabels[key] : 'du champ ' + key;
  const displayedValueBefore = isBoolean(valueBefore)
    ? valueBefore
      ? 'coché'
      : 'décoché'
    : valueBefore;
  const displayedValueAfter = isBoolean(valueAfter)
    ? valueAfter
      ? 'coché'
      : 'décoché'
    : valueAfter;

  const separator =
    (displayedValueBefore || '').toString().length < 120 ? '"' : '\n\n';

  accumulatorArray.push(
    `Changement ${label} de ${separator}${displayedValueBefore}${separator} en ${separator}${displayedValueAfter}${separator}`
  );

  return accumulatorArray;
}

export function getChangelog(diff) {
  try {
    return (
      chain(diff)
        // { intitule: ['a', 'b'], contacts: [[{'name': 'c', email: 'd'}], [{'name': 'e', email: 'd'}]] }
        .omit(['updated_at'])
        .transform(flattenDiffTransformer, {})
        // { intitule: ['a', 'b'], contacts.0.name: ['c', 'e'] }
        .transform(changelogFormatTransformer, [])
        // ['changement d’intitule de "a" en "b"', 'changement du nom du DPD de "c" en "d"']
        .value()
    );
  } catch (e) {
    // There is a lot of operation involved in this function.
    // We rather fail silently than causing the entire page not to render.
    console.error(e);
    return [];
  }
}

export function hashToQueryParams(hash, initialSearchParams) {
  const hashWithoutNullValue = omitBy(hash, (e) =>
    isObject(e) ? isEmpty(e) : !e
  );

  const urlParams = new URLSearchParams(initialSearchParams);

  forOwn(hashWithoutNullValue, (value, key) =>
    urlParams.set(key, isObject(value) ? JSON.stringify(value) : value)
  );

  return isEmpty(hashWithoutNullValue) ? '' : `?${urlParams.toString()}`;
}

export function collectionWithKeyToObject(collection) {
  return (
    chain(collection)
      // [{ id: 'a', attr1: 'a1', attr2: 'a2' }, { id: 'b', attr1: 'b1', attr2: 'b2' }]
      .map(({ id, ...attributes }) => [id, attributes])
      // [[ 'a', { attr1: 'a1', attr2: 'a2' }], ['b', { attr1: 'b1', attr2: 'b2' }]]
      .fromPairs()
      // { a: { attr1: 'a1', attr2: 'a2' },  b: { attr1: 'b1', attr2: 'b2' }}
      .value()
  );
}

export function openLink(e, history, targetUrl) {
  if (e.ctrlKey || e.metaKey) {
    // metaKey is cmd on mac
    window.open(targetUrl); // open in new tab
  } else {
    const previousPath = `${window.location.path || '/'}${
      window.location.search
    }`;
    history.push(targetUrl, { previousPath });
  }
}

export function goBack(history) {
  if (
    isObject(history.location.state) &&
    !isEmpty(history.location.state.previousPath)
  ) {
    return history.push(history.location.state.previousPath);
  }

  return history.push('/');
}

export const getStateFromUrlParams = (defaultState = {}) => {
  const urlParams = new URLSearchParams(window.location.search);

  return mapValues(defaultState, (value, key) => {
    if (!urlParams.has(key)) {
      return value;
    }

    const param = urlParams.getAll(key);

    if (isObject(value)) {
      return JSON.parse(param[0]);
    }

    if (isInteger(value)) {
      return parseInt(param[0]) || value;
    }

    if (isBoolean(value)) {
      return param[0] === 'true';
    }

    return param[0];
  });
};

export const setUrlParamsFromState = (state = {}) => {
  const newQueryString = hashToQueryParams(state, window.location.search);

  window.history.replaceState(
    window.history.state,
    '',
    `${window.location.pathname}${newQueryString}`
  );
};

export const findModifiedFields = (
  demarcheState = {},
  enrollmentState = {}
) => {
  const modified = [];
  Object.keys(demarcheState).forEach((key) => {
    const initialValue = demarcheState[key];
    const value = enrollmentState[key];
    if (
      !isEmpty(initialValue) &&
      JSON.stringify(initialValue) !== JSON.stringify(value)
    ) {
      modified.push(key);
    }
  });
  return modified;
};

export const isValidPhoneNumber = (phoneNumber) => {
  if (!isString(phoneNumber)) {
    return false;
  }

  // loose homemade regexp to match large amount of phone number
  const phone_number_regex = /^\+?(?:[0-9][ -]?){6,14}[0-9]$/;

  return !!phoneNumber.match(phone_number_regex);
};

export const isValidMobilePhoneNumber = (phoneNumber) => {
  if (!isValidPhoneNumber(phoneNumber)) {
    return false;
  }

  const mobile_phone_prefix_regexp = /^(\+33|0)\s*[6-7].*/;
  return !!phoneNumber.match(mobile_phone_prefix_regexp);
};

export const stackLowUseAndUnpublishedApi = (
  publishedApis,
  enrollmentByTargetApi,
  maxApiToDisplay = 13
) => {
  const publishedEnrollmentByTargetApi = enrollmentByTargetApi.filter(
    ({ name }) => publishedApis.includes(name)
  );

  const filteredEnrollmentByTargetApi = slice(
    publishedEnrollmentByTargetApi,
    0,
    maxApiToDisplay
  );

  let otherCount = enrollmentByTargetApi
    .filter(({ name }) => !publishedApis.includes(name))
    .reduce((accumulator, { count }) => accumulator + count, 0);

  otherCount = slice(publishedEnrollmentByTargetApi, maxApiToDisplay).reduce(
    (accumulator, { count }) => accumulator + count,
    otherCount
  );

  if (otherCount > 0) {
    filteredEnrollmentByTargetApi.push({ name: 'others', count: otherCount });
  }

  return filteredEnrollmentByTargetApi;
};
