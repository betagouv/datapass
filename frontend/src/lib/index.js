import {
  chain,
  forOwn,
  isArray,
  isBoolean,
  isEmpty,
  isEqual,
  isInteger,
  isObject,
  isString,
  isUndefined,
  mapKeys,
  mapValues,
  mergeWith,
  omitBy,
  slice,
  transform,
} from 'lodash';
import flatten from 'flat';

export function getErrorMessages(error) {
  if (!isEmpty(error.response) && isObject(error.response.data)) {
    return chain(error.response.data).values().flatten().value();
  }

  const errorMessageEnd =
    'Merci de réessayer ultérieurement. ' +
    'Vous pouvez également nous signaler cette erreur par mail à contact@api.gouv.fr.';

  if (!isEmpty(error.response) && error.message !== 'Network Error') {
    return [
      `Une erreur est survenue. Le code de l’erreur est ${error.response.status} (${error.response.statusText}). ${errorMessageEnd}`,
    ];
  }

  if (error.message === 'Network Error') {
    return [
      'Une erreur de connexion au serveur est survenue. ' +
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
  hubee_portail: ['84.11Z'], // Administration publique générale
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

function flattenDiffTransformer(accumulatorObject, fullObjectDiff, objectKey) {
  if (!isObject(fullObjectDiff[0])) {
    accumulatorObject[objectKey] = fullObjectDiff;

    return accumulatorObject;
  }
  // {contacts: [[{'name': 'c', email: 'd', work_email: 'a'}], [{'name': 'e', email: 'd'}]]}
  const objectBefore = flatten(fullObjectDiff[0], objectKey);
  const objectAfter = flatten(fullObjectDiff[1], objectKey);
  const objectDiff = mergeWith(
    objectBefore,
    objectAfter,
    (valueBefore, valueAfter) => [valueBefore, valueAfter]
  );
  // {0.name: ['c', 'e'], 0.email: ['d', 'd'], 0.work_email: 'a'}
  const objectDiffNoUnchangedNoDeprecated = omitBy(
    objectDiff,
    (value) => !isArray(value) || value[0] === value[1]
  );
  // {0.name: ['c', 'e']}
  const objectDiffPrefixedKey = mapKeys(
    objectDiffNoUnchangedNoDeprecated,
    (value, flatKey) => `${objectKey}.${flatKey}`
  );
  // {contacts.0.name: ['c', 'e']}
  Object.assign(accumulatorObject, objectDiffPrefixedKey);

  return accumulatorObject;
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
  'team_members.0.given_name': 'du prénom du demandeur',
  'team_members.0.family_name': 'du nom du demandeur',
  'team_members.0.phone_number': 'du numéro de téléphone du demandeur',
  'team_members.0.email': 'de l’email du demandeur',
  'team_members.0.job': 'du poste du demandeur',
  'team_members.1.given_name': 'du prénom du deuxième contact',
  'team_members.1.family_name': 'du nom du deuxième contact',
  'team_members.1.phone_number': 'du numéro de téléphone du deuxième contact',
  'team_members.1.email': 'de l’email du deuxième contact',
  'team_members.1.job': 'du poste du deuxième contact',
  'team_members.2.given_name': 'du prénom du troisième contact',
  'team_members.2.family_name': 'du nom du troisième contact',
  'team_members.2.phone_number': 'du numéro de téléphone du troisième contact',
  'team_members.2.email': 'de l’email du troisième contact',
  'team_members.2.job': 'du poste du troisième contact',
  'team_members.3.given_name': 'du prénom du quatrième contact',
  'team_members.3.family_name': 'du nom du quatrième contact',
  'team_members.3.phone_number': 'du numéro de téléphone du quatrième contact',
  'team_members.3.email': 'de l’email du quatrième contact',
  'team_members.3.job': 'du poste du quatrième contact',
  dpo_is_informed: 'de la case "le DPD est informé de ma demande"',
};

const getLabel = (key) => {
  if (diffFieldLabels[key]) {
    return diffFieldLabels[key];
  }

  if (key.startsWith('scopes.')) {
    return `du périmètre de données "${key.replace('scopes.', '')}"`;
  }

  return `du champ "${key}"`;
};

const getDisplayValue = (rawValue) => {
  if (isBoolean(rawValue)) {
    return rawValue ? 'coché' : 'décoché';
  }

  if (isUndefined(rawValue)) {
    return 'non renseigné';
  }

  return rawValue;
};

function changelogFormatTransformer(accumulatorArray, changes, key) {
  let valueBefore, valueAfter;
  if (changes.length === 2) [valueBefore, valueAfter] = changes;
  if (changes.length === 1) [valueAfter] = changes;

  const label = getLabel(key);
  let displayedValueBefore = getDisplayValue(valueBefore);
  const displayedValueAfter = getDisplayValue(valueAfter);

  if (isBoolean(valueAfter) && isUndefined(valueBefore)) {
    displayedValueBefore = getDisplayValue(false);
  }

  const separator =
    (displayedValueBefore || '').toString().length < 120 ? '"' : '\n\n';

  accumulatorArray.push(
    `Changement ${label} de ${separator}${displayedValueBefore}${separator} en ${separator}${displayedValueAfter}${separator}`
  );

  return accumulatorArray;
}

const getChangelogV1 = (diff) =>
  chain(diff)
    // { intitule: ['a', 'b'], contacts: [[{'name': 'c', email: 'd'}], [{'name': 'e', email: 'd'}]] }
    .omit(['updated_at'])
    .transform(flattenDiffTransformer, {})
    // { intitule: ['a', 'b'], contacts.0.name: ['c', 'e'] }
    .transform(changelogFormatTransformer, [])
    // ['changement d’intitule de "a" en "b"', 'changement du nom du DPD de "c" en "d"']
    .value();

export const flattenDiffTransformerV2Factory =
  (keyPrefix = null) =>
  (accumulatorObject, objectValue, objectKey) => {
    const key = [keyPrefix, objectKey].filter((e) => e).join('.');

    if (isArray(objectValue)) {
      accumulatorObject[key] = objectValue;
    }

    // { scope: { nom: [false, true] } }
    if (isObject(objectValue)) {
      transform(
        objectValue,
        flattenDiffTransformerV2Factory(key),
        accumulatorObject
      );
    }

    return accumulatorObject;
  };

const getChangelogV2 = (diff) =>
  chain(diff)
    // { intitule: ['a', 'b'], team_members: { "_t": "a", "0": { 'name': ['c','e'], email: ['d'] } } }
    .transform(flattenDiffTransformerV2Factory(), {})
    // { intitule: ['a', 'b'], team_members.0.name: ['c', 'e'] , team_members.0.email: ['d'] }
    .transform(changelogFormatTransformer, [])
    // ['changement d’intitule de "a" en "b"', ...]
    .value();

export function getChangelog(diff) {
  try {
    return diff?.['_v'] === '2' ? getChangelogV2(diff) : getChangelogV1(diff);
  } catch (e) {
    // There is a lot of operation involved in this function.
    // We rather fail silently than causing the entire page not to render.
    console.error(e);
    return [];
  }
}

export function hashToQueryParams(hash, initialSearchParams) {
  const urlParams = new URLSearchParams(initialSearchParams);

  forOwn(hash, (value, key) =>
    urlParams.set(key, isObject(value) ? JSON.stringify(value) : value)
  );

  forOwn(hash, (value, key) => {
    if (isObject(value) ? isEmpty(value) : !value) {
      urlParams.delete(key);
    }
  });

  return isEmpty(urlParams.toString()) ? '' : `?${urlParams.toString()}`;
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
      !isEmpty(value) &&
      !isEqual(initialValue, value)
    ) {
      modified.push(key);
    }
  });
  return modified;
};

export const findModifiedScopes = (
  demarcheState = {},
  enrollmentState = {}
) => {
  if (!findModifiedFields(demarcheState, enrollmentState).includes('scopes')) {
    return {};
  }

  return omitBy(enrollmentState.scopes, function (v, k) {
    return (
      isUndefined(demarcheState.scopes[k]) || demarcheState.scopes[k] === v
    );
  });
};

/*
 * duplicated from : api-auth/src/services/security.js
 */
export const isEmailValid = (email) => {
  if (!isString(email) || isEmpty(email)) {
    return false;
  }

  const parts = email.split('@').filter((part) => part);

  // The email address contains two parts, separated with an @ symbol.
  // => these parts are non empty strings
  // => there are two and only two parts
  if (parts.length !== 2) {
    return false;
  }

  // The email address does not contain dangerous characters
  // => the postgres connector is taking care of this

  // The domain part contains only letters, numbers, hyphens (-) and periods (.)
  const domain = parts[1];
  if (domain.match(/^[a-zA-Z0-9.-]*$/) === null) {
    return false;
  }

  // The local part (before the @) should be no more than 63 characters.
  const localPart = parts[0];
  if (localPart.length > 63) {
    return false;
  }

  // The total length should be no more than 254 characters.
  if (email.length > 254) {
    return false;
  }

  return true;
};

export const isIndividualEmailAddress = (email) => {
  if (!isEmailValid(email)) {
    return false;
  }

  const firstEmailPart = email.split('@')[0];
  const forbiddenEmailWords = [
    'mairie',
    'contact',
    'ville',
    'bibliotheque',
    'direction',
    'services',
    'ccas',
    'social',
    'office',
    'aidants',
    'directrice',
    'msap',
    'coordination',
    'famille',
    'accueil',
    'info',
    'numerique',
    'urbanisme',
    'mediatheque',
    'evs',
    'emploi',
    'coordinateur',
    'centre',
    'commune',
    'mjc',
    'welcome',
    'sg',
    'asf',
    'police',
    'maire',
    'mds',
    'espace',
    'pole',
    'vielocale',
    'dgs',
    'secretariat',
    'admin',
  ];

  return !forbiddenEmailWords.some((w) => firstEmailPart.includes(w));
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

export const dataProviderConfigurationsToContactInfo = (parameters) =>
  chain(parameters)
    .map(({ label, ...rest }) =>
      label.endsWith(' (Bac à sable)')
        ? { label: label.replace(' (Bac à sable)', ''), ...rest }
        : { label, ...rest }
    )
    .reject(({ email }) => !email)
    .reject(({ label }) => label.endsWith(' (Production)'))
    .reject(({ label }) => label.endsWith(' (FC)'))
    .groupBy(({ email }) => email)
    .mapValues((params) => {
      let labels = params.map(({ label }) => label);
      if (labels.length > 4) {
        labels = labels.slice(0, 4);
        labels.push('etc.');
      }

      return labels.join(', ');
    })
    .toPairs()
    .map(([email, label]) => ({ email, label }))
    .value();

export const getScopesFromEnrollments = (enrollments) =>
  chain(enrollments)
    .map(({ scopes }) =>
      chain(scopes)
        .omitBy((v) => !v)
        .keys()
        .value()
    )
    .flatten()
    .uniq()
    .value();

export const isUserADemandeur = ({ team_members = [], user_email }) =>
  team_members
    .filter(({ type }) => type === 'demandeur')
    .map(({ email }) => email)
    .includes(user_email);
