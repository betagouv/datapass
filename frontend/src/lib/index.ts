import {
  chain,
  difference,
  forOwn,
  intersection,
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
import { AxiosError, AxiosResponse } from 'axios';
import {
  Enrollment,
  TeamMember,
} from '../components/templates/InstructorEnrollmentList';
import { DataProviderConfiguration } from '../config/data-provider-configurations';

interface ExtendedData {
  title?: string;
  message?: string;
}

interface ExtendedAxiosResponse extends AxiosResponse {
  data: ExtendedData | any;
}

export interface NetworkError extends AxiosError {
  response?: ExtendedAxiosResponse;
}

export function getErrorMessages(error: NetworkError) {
  if (!isEmpty(error.response) && isObject(error.response.data)) {
    if (
      (error.response?.data as ExtendedData).title &&
      (error.response?.data as ExtendedData).message
    ) {
      return [
        `${(error.response?.data as ExtendedData).title} : ${
          (error.response?.data as ExtendedData).message
        }`,
      ];
    }
    return (chain(error.response.data).values().flatten() as any).value();
  }

  const errorMessageEnd =
    'Merci de réessayer ultérieurement. ' +
    'Vous pouvez également nous signaler cette erreur par mail à datapass@api.gouv.fr.';

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
        'datapass@api.gouv.fr.',
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

const validNAFCode: Record<string, string[]> = {
  api_particulier: publicServicesNAFCodes,
  hubee_portail: ['84.11Z'], // Administration publique générale
};

export function isValidNAFCode(target_api: string, NAFcode: string): boolean {
  if (!isString(NAFcode)) {
    return false;
  }

  const validCodes = validNAFCode[target_api];

  if (isEmpty(validCodes)) {
    return true;
  }

  if (!validCodes) {
    console.warn(`No NAF codes found for target_api: ${target_api}`);
    return false;
  }

  return validCodes.some((code) => NAFcode.startsWith(code));
}

function flattenDiffTransformer(
  accumulatorObject: DiffObject,
  fullObjectDiff: any[],
  objectKey: string
): DiffObject {
  if (!isObject(fullObjectDiff[0])) {
    accumulatorObject[objectKey] = fullObjectDiff;

    return accumulatorObject;
  }

  const objectBefore = flatten(fullObjectDiff[0], objectKey as any);
  const objectAfter = flatten(fullObjectDiff[1], objectKey as any);
  const objectDiff = mergeWith(
    objectBefore,
    objectAfter,
    (valueBefore: any, valueAfter: any) => [valueBefore, valueAfter]
  ) as DiffObject;

  const objectDiffNoUnchangedNoDeprecated = omitBy(
    objectDiff,
    (value: any) => !isArray(value) || value[0] === value[1]
  );

  const objectDiffPrefixedKey = mapKeys(
    objectDiffNoUnchangedNoDeprecated,
    (value: any, flatKey: string) => `${objectKey}.${flatKey}`
  );

  Object.assign(accumulatorObject, objectDiffPrefixedKey);

  return accumulatorObject;
}

const diffFieldLabels: Record<string, string> = {
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

const getLabel = (key: string) => {
  if (diffFieldLabels[key]) {
    return diffFieldLabels[key];
  }

  if (key.startsWith('scopes.')) {
    return `du périmètre de données "${key.replace('scopes.', '')}"`;
  }

  return `du champ "${key}"`;
};

const getDisplayValue = (rawValue: any) => {
  if (isBoolean(rawValue)) {
    return rawValue ? 'coché' : 'décoché';
  }

  if (isUndefined(rawValue)) {
    return 'non renseigné';
  }

  return rawValue;
};

type DiffObject = { [key: string]: any };
type ChangeValue = any;
type AccumulatorArray = Array<string>;
type ChangesArray = Array<ChangeValue>;

function changelogFormatTransformer(
  accumulatorArray: AccumulatorArray,
  changes: ChangesArray,
  key: string
): AccumulatorArray {
  let valueBefore: ChangeValue, valueAfter: ChangeValue;
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

const getChangelogV1 = (diff: DiffObject): AccumulatorArray =>
  chain(diff)
    .omit(['updated_at'])
    .transform(flattenDiffTransformer, {})
    .transform(changelogFormatTransformer, [])
    .value();

export const flattenDiffTransformerV2Factory =
  (keyPrefix: string | null = null) =>
  (
    accumulatorObject: DiffObject,
    objectValue: any,
    objectKey: string
  ): DiffObject => {
    const key = [keyPrefix, objectKey].filter((e) => e).join('.');

    if (isArray(objectValue)) {
      accumulatorObject[key] = objectValue;
    }

    if (isObject(objectValue)) {
      transform(
        objectValue,
        flattenDiffTransformerV2Factory(key),
        accumulatorObject
      );
    }

    return accumulatorObject;
  };

const getChangelogV2 = (diff: DiffObject): AccumulatorArray =>
  chain(diff)
    .transform(flattenDiffTransformerV2Factory(), {})
    .transform(changelogFormatTransformer, [])
    .value();

const turnV3ToV2Scopes = (
  accumulatorObject: DiffObject,
  objectValue: any,
  objectKey: string
): DiffObject => {
  if (objectKey === 'scopes') {
    const [previousScopes, newScopes] = objectValue as [string[], string[]];
    const commonScopes = intersection(previousScopes, newScopes);
    const removedScopes = difference(previousScopes, commonScopes) as string[];
    const addedScopes = difference(newScopes, commonScopes) as string[];
    const scopes: { [key: string]: [boolean, boolean] } = {};
    removedScopes.forEach(
      (removedScope) => (scopes[removedScope] = [true, false])
    );
    addedScopes.forEach((addedScope) => (scopes[addedScope] = [false, true]));
    accumulatorObject['scopes'] = scopes;
  } else {
    accumulatorObject[objectKey] = objectValue;
  }
  return accumulatorObject;
};

const getChangelogV3 = (diff: DiffObject): AccumulatorArray =>
  chain(diff)
    .transform(turnV3ToV2Scopes, {})
    .transform(flattenDiffTransformerV2Factory(), {})
    .transform(changelogFormatTransformer, [])
    .value();

export function getChangelog(diff: DiffObject): AccumulatorArray {
  try {
    return diff?.['_v'] === '3'
      ? getChangelogV3(diff)
      : diff?.['_v'] === '2'
      ? getChangelogV2(diff)
      : getChangelogV1(diff);
  } catch (e) {
    console.error(e);
    return [];
  }
}

export function hashToQueryParams(hash: any, initialSearchParams?: string) {
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
type CollectionItem = {
  id: string;
  [key: string]: any;
};

export function collectionWithKeyToObject(
  collection: CollectionItem[]
): Record<string, Omit<CollectionItem, 'id'>> {
  return chain(collection)
    .map(({ id, ...attributes }) => [id, attributes])
    .fromPairs()
    .value();
}

export function getStateFromUrlParams(
  defaultState: Record<string, any>
): Record<string, any> {
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
}

export const setUrlParamsFromState = (state = {}) => {
  const newQueryString = hashToQueryParams(state, window.location.search);

  window.history.replaceState(
    window.history.state,
    '',
    `${window.location.pathname}${newQueryString}`
  );
};

export const findModifiedFields = (
  demarcheState: Record<string, any> = {},
  enrollmentState: Record<string, any> = {}
): string[] => {
  const modified: string[] = [];
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
  demarcheState: Record<string, any> = {},
  enrollmentState: Record<string, any> = {}
) => {
  if (!findModifiedFields(demarcheState, enrollmentState).includes('scopes')) {
    return {};
  }

  return omitBy(enrollmentState?.scopes, function (v, k) {
    return (
      isUndefined(demarcheState.scopes[k]) || demarcheState.scopes[k] === v
    );
  });
};

/*
 * duplicated from : moncomptepro/src/services/security.js
 */
export const isEmailValid = (email: string) => {
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

export const isIndividualEmailAddress = (email: string) => {
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

export const isValidPhoneNumber = (phoneNumber: string) => {
  if (!isString(phoneNumber)) {
    return false;
  }

  // loose homemade regexp to match large amount of phone number
  const phone_number_regex = /^\+?(?:[0-9][ -]?){6,14}[0-9]$/;

  return !!phoneNumber.match(phone_number_regex);
};

export const isValidMobilePhoneNumber = (phoneNumber: string) => {
  if (!isValidPhoneNumber(phoneNumber)) {
    return false;
  }

  const mobile_phone_prefix_regexp = /^(\+33|0)\s*[6-7].*/;
  return !!phoneNumber.match(mobile_phone_prefix_regexp);
};

export const stackLowUseAndUnpublishedApi = (
  publishedApis: string[],
  enrollmentByTargetApi: { name: string; count: number }[],
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

export const dataProviderConfigurationsToContactInfo = (
  parameters: { [k: string]: DataProviderConfiguration } | null
) =>
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

export const getScopesFromEnrollments = (enrollments: Enrollment[]) =>
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

export const isUserADemandeur = ({
  team_members = [],
  user_email,
}: {
  team_members: TeamMember[];
  user_email: string;
}) =>
  team_members
    .filter(({ type }) => type === 'demandeur')
    .map(({ email }) => email)
    .includes(user_email);
