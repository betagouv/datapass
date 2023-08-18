import {
  NetworkError,
  collectionWithKeyToObject,
  dataProviderConfigurationsToContactInfo,
  findModifiedFields,
  findModifiedScopes,
  flattenDiffTransformerV2Factory,
  getChangelog,
  getErrorMessages,
  getScopesFromEnrollments,
  getStateFromUrlParams,
  hashToQueryParams,
  isEmailValid,
  isIndividualEmailAddress,
  isValidMobilePhoneNumber,
  isValidNAFCode,
  isValidPhoneNumber,
  stackLowUseAndUnpublishedApi,
} from './index';
import groupEmailAddresses from '../../mock/group_email_addresses_samples.json';
import { transform } from 'lodash';

describe('utils', () => {
  describe('getErrorMessages', () => {
    it('should return proper error message for error from nginx', () => {
      const errorObject: NetworkError = {
        response: {
          data: '<html>\r\n<head><title>502 Bad Gateway</title></head>\r\n<body bgcolor="white">\r\n<center><h1>502 Bad Gateway</h1></center>\r\n<hr><center>nginx/1.10.3 (Ubuntu)</center>\r\n</body>\r\n</html>\r\n<!-- a padding to disable MSIE and Chrome friendly error page -->\r\n<!-- a padding to disable MSIE and Chrome friendly error page -->\r\n<!-- a padding to disable MSIE and Chrome friendly error page -->\r\n<!-- a padding to disable MSIE and Chrome friendly error page -->\r\n<!-- a padding to disable MSIE and Chrome friendly error page -->\r\n<!-- a padding to disable MSIE and Chrome friendly error page -->\r\n',
          status: 502,
          statusText: 'Bad Gateway',
        },
      };

      expect(getErrorMessages(errorObject)).toEqual([
        'Une erreur est survenue. Le code de l’erreur est 502 (Bad Gateway). Merci de réessayer ultérieurement. Vous pouvez également nous signaler cette erreur par mail à datapass@api.gouv.fr.',
      ]);
    });

    it('should return proper error message for 422 error from backend', () => {
      const errorObject = {
        response: {
          data: {
            description: [
              'Vous devez renseigner la description de la démarche avant de continuer',
            ],
            contacts: [
              'Vous devez renseigner un prénom pour le contact technique avant de continuer',
              'Vous devez renseigner un nom pour le contact technique avant de continuer',
            ],
          },
          status: 422,
          statusText: 'Unprocessable Entity',
        },
      };

      expect(getErrorMessages(errorObject)).toEqual([
        'Vous devez renseigner la description de la démarche avant de continuer',
        'Vous devez renseigner un prénom pour le contact technique avant de continuer',
        'Vous devez renseigner un nom pour le contact technique avant de continuer',
      ]);
    });

    it('should return proper message for network error', () => {
      const errorObject = {
        message: 'Network Error',
      };

      expect(getErrorMessages(errorObject)).toEqual([
        'Une erreur de connexion au serveur est survenue. Merci de vérifier que vous êtes bien connecté à internet. Si vous utilisez un réseau d’entreprise, merci de signaler cette erreur à l’administrateur de votre réseau informatique. Si le problème persiste, vous pouvez nous contacter par mail à datapass@api.gouv.fr.',
      ]);
    });

    it('should return proper error message for copying error from backend', () => {
      const errorObject = {
        response: {
          data: {
            message:
              'La validation a échoué : Copied from enrollment n’est pas disponible',
          },
          status: 422,
          statusText: 'Unprocessable Entity',
        },
      };

      expect(getErrorMessages(errorObject)).toEqual([
        'La validation a échoué : Copied from enrollment n’est pas disponible',
      ]);
    });

    it('should return proper error message for 403 error from backend', () => {
      const errorObject = {
        response: {
          data: {
            message: 'Vous n’êtes pas autorisé à modifier cette ressource',
          },
          status: 403,
          statusText: 'Forbidden',
        },
      };

      expect(getErrorMessages(errorObject)).toEqual([
        'Vous n’êtes pas autorisé à modifier cette ressource',
      ]);
    });

    it('should return proper error message for 401 error from backend', () => {
      const errorObject = {
        response: {
          data: {
            message:
              'Vous devez vous connecter ou vous inscrire pour continuer.',
          },
          status: 401,
          statusText: 'Unauthorized',
        },
      };

      expect(getErrorMessages(errorObject)).toEqual([
        'Vous devez vous connecter ou vous inscrire pour continuer.',
      ]);
    });
  });

  describe('isValidNAFCode', () => {
    it('should return true for COMMUNE D HEM', () => {
      expect(isValidNAFCode('api_particulier', '84.11Z')).toBe(true);
    });
    it('should return true for ASSISTANCE PUBLIQUE HOPITAUX DE PARIS', () => {
      expect(isValidNAFCode('api_particulier', '86.10Z')).toBe(true);
    });
    it('should return false for RED NEEDLES', () => {
      expect(isValidNAFCode('api_particulier', '62.02A')).toBe(false);
    });
    it('should return true if provider does not filter on NAF code', () => {
      expect(isValidNAFCode('dgfip', '62.02A')).toBe(true);
    });
    it('should return true for Commune de bresse vallons', () => {
      expect(isValidNAFCode('hubee_portail', '84.11Z')).toBe(true);
    });
    it('should return false for Cpam de loire atlantique (cpam)', () => {
      expect(isValidNAFCode('hubee_portail', '84.30A')).toBe(false);
    });
  });

  describe('getChangelog', () => {
    const diff = {
      data_retention_period: [12, 11],
      fondement_juridique_url: [
        null,
        'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037611479/',
      ],
      fondement_juridique_title: [
        'Convention d\'accès à "Mon compte partenaire" - Ville de Hem / CAF du Nord - Contrat de service pris en application de la convention d\'accès à "Mon Compte Partenaire" (mode gestion déléguée) signés le 11 mai 2017.',
        'Convention d\'accès à "Mon compte partenaire" - Ville de Hem / CAF du Nord - Contrat de service pris en application de la convention d\'accès à "Mon Compte Partenaire" (mode gestion déléguée) signés le 11 mai 2017',
      ],
      updated_at: ['2019-05-13T16:35:19.742Z', '2019-05-14T09:30:54.304Z'],
      contacts: [
        [
          {
            email: 'raphael.dubigny@beta.gouv.fr',
            heading: 'Délégué à la protection des données',
            id: 'dpo',
            nom: 'Raphaël Dubigny2',
            phone_number: '0123456789',
          },
          {
            email: 'raphael.dubigny@beta.gouv.fr',
            heading: 'Responsable de traitement',
            id: 'responsable_traitement',
            nom: 'Raphaël Dubigny',
            phone_number: '0123456789',
          },
          {
            email: 'raphael.dubigny@beta.gouv.fr',
            heading: 'Responsable technique',
            id: 'responsable_technique',
            nom: 'Raphaël Dubigny',
            phone_number: '0123456789',
          },
        ],
        [
          {
            email: 'raphael.dubigny@beta.gouv.fr',
            heading: 'Délégué à la protection des données',
            id: 'dpo',
            nom: 'Raphaël Dubigny',
            phone_number: '0123456789',
          },
          {
            email: 'raphael.dubigny@beta.gouv.fr',
            heading: 'Responsable de traitement',
            id: 'responsable_traitement',
            nom: 'Raphaël Dubigny',
            phone_number: '0123456789',
          },
          {
            email: 'raphael.dubigny@beta.gouv.fr',
            heading: 'Responsable technique',
            id: 'responsable_technique',
            nom: 'Raphaël Dubigny',
            phone_number: '0123456789',
          },
        ],
      ],
      scopes: [
        {
          birthcountry: true,
          birthdate: false,
          birthplace: true,
          email: true,
          family_name: true,
          gender: false,
          given_name: true,
          openid: true,
          deprecated_scope: null,
        },
        {
          birthcountry: false,
          birthdate: true,
          birthplace: true,
          email: true,
          family_name: true,
          gender: false,
          given_name: true,
          openid: true,
          preferred_username: true,
        },
      ],
      additional_content: [
        {
          has_alternative_authentication_methods: true,
        },
        {
          eidas_level: '1',
          has_alternative_authentication_methods: true,
        },
      ],
    };

    const changelog = [
      'Changement de la durée de conservation des données de "12" en "11"',
      'Changement de l’url du cadre juridique de "null" en "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037611479/"',
      'Changement de la référence du cadre juridique de \n\nConvention d\'accès à "Mon compte ' +
        'partenaire" - Ville de Hem / CAF du Nord - Contrat de service pris en application de la ' +
        'convention d\'accès à "Mon Compte Partenaire" (mode gestion déléguée) signés le 11 mai ' +
        '2017.\n\n en \n\nConvention d\'accès à "Mon compte partenaire" - Ville de Hem / CAF du Nord - ' +
        'Contrat de service pris en application de la convention d\'accès à "Mon Compte ' +
        'Partenaire" (mode gestion déléguée) signés le 11 mai 2017\n\n',
      'Changement du nom du contact 1 de "Raphaël Dubigny2" en "Raphaël Dubigny"',
      'Changement du périmètre de données "birthcountry" de "coché" en "décoché"',
      'Changement du périmètre de données "birthdate" de "décoché" en "coché"',
      'Changement du périmètre de données "preferred_username" de "décoché" en "coché"',
      'Changement du champ "additional_content.eidas_level" de "non renseigné" en "1"',
    ];

    it('should return changelog for simple string field', () => {
      expect(getChangelog(diff)[0]).toEqual(changelog[0]);
    });
    it('should return changelog for simple string field with initial null value', () => {
      expect(getChangelog(diff)[1]).toEqual(changelog[1]);
    });
    it('should return changelog for several simple field', () => {
      expect(getChangelog(diff)[2]).toEqual(changelog[2]);
    });
    it('should return changelog for contact field', () => {
      expect(getChangelog(diff)[3]).toEqual(changelog[3]);
    });
    it('should return changelog for scopes', () => {
      expect(getChangelog(diff)).toEqual(changelog);
    });

    it('should return empty changelog for modified', () => {
      const diff = {
        updated_at: ['2021-12-28T15:51:35.552Z', '2021-12-28T15:51:35.565Z'],
      };
      const changelog = [];
      expect(getChangelog(diff)).toEqual(changelog);
    });
  });

  describe('flattenDiffTransformerV2Factory', () => {
    it('should return flattened diff', () => {
      const diff = { intitule: ['a', 'b'] };
      expect(transform(diff, flattenDiffTransformerV2Factory(), {})).toEqual({
        intitule: ['a', 'b'],
      });
    });
    it('should return flattened diff', () => {
      const diff = { _v: '2' };
      expect(transform(diff, flattenDiffTransformerV2Factory(), {})).toEqual(
        {}
      );
    });
    it('should return flattened diff', () => {
      const diff = { scope: { nom: [false, true], prenom: { a: ['a', 'b'] } } };
      expect(transform(diff, flattenDiffTransformerV2Factory(), {})).toEqual({
        'scope.nom': [false, true],
        'scope.prenom.a': ['a', 'b'],
      });
    });
    it('should return flattened diff', () => {
      const diff = {
        team_members: { _t: 'a', 3: { prenom: { a: ['a', 'b'] } } },
      };
      expect(transform(diff, flattenDiffTransformerV2Factory(), {})).toEqual({
        'team_members.3.prenom.a': ['a', 'b'],
      });
    });
  });

  describe('getChangelog v2 & v3', () => {
    ['2', '3'].forEach((version) => {
      it('should return changelog for simple string field', () => {
        const diff = {
          _v: version,
          data_retention_period: [12, 11],
        };
        expect(getChangelog(diff)).toEqual([
          'Changement de la durée de conservation des données de "12" en "11"',
        ]);
      });
    });

    ['2', '3'].forEach((version) => {
      it('should return changelog for simple string field with initial null value', () => {
        const diff = {
          _v: version,
          fondement_juridique_url: [
            'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037611479/',
          ],
        };
        expect(getChangelog(diff)).toEqual([
          'Changement de l’url du cadre juridique de "non renseigné" en "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037611479/"',
        ]);
      });
    });

    ['2', '3'].forEach((version) => {
      it('should return changelog for several simple field', () => {
        const diff = {
          _v: version,
          fondement_juridique_title: [
            'Convention d\'accès à "Mon compte partenaire" - Ville de Hem / CAF du Nord - Contrat de service pris en application de la convention d\'accès à "Mon Compte Partenaire" (mode gestion déléguée) signés le 11 mai 2017.',
            'Convention d\'accès à "Mon compte partenaire" - Ville de Hem / CAF du Nord - Contrat de service pris en application de la convention d\'accès à "Mon Compte Partenaire" (mode gestion déléguée) signés le 11 mai 2017',
          ],
        };
        expect(getChangelog(diff)).toEqual([
          'Changement de la référence du cadre juridique de \n\nConvention d\'accès à "Mon compte ' +
            'partenaire" - Ville de Hem / CAF du Nord - Contrat de service pris en application de la ' +
            'convention d\'accès à "Mon Compte Partenaire" (mode gestion déléguée) signés le 11 mai ' +
            '2017.\n\n en \n\nConvention d\'accès à "Mon compte partenaire" - Ville de Hem / CAF du Nord - ' +
            'Contrat de service pris en application de la convention d\'accès à "Mon Compte ' +
            'Partenaire" (mode gestion déléguée) signés le 11 mai 2017\n\n',
        ]);
      });
    });

    ['2', '3'].forEach((version) => {
      it('should return changelog for contact field', () => {
        const diff = {
          _v: version,
          team_members: {
            0: {
              family_name: ['Dubigny', 'Dubigny2'],
            },
          },
        };
        expect(getChangelog(diff)).toEqual([
          'Changement du nom du demandeur de "Dubigny" en "Dubigny2"',
        ]);
      });
    });

    ['2', '3'].forEach((version) => {
      it('should return changelog for adding team_member or document', () => {
        const diff = {
          _v: version,
          team_members: {
            1: {
              job: ['Chef'],
              email: ['datapass@yopmail.com'],
              user_id: [417269330],
              given_name: ['Administrator'],
              family_name: ['Test'],
              phone_number: ['0000000000'],
            },
            _t: 'a',
          },
          documents: {
            0: {
              id: [195],
              type: ['Document::LegalBasis'],
              attachment: [
                'A06_-_Mode_d_emploi_-_avance_imme_diate_de_cre_dit_d_impo_t.pdf',
              ],
              attachable_id: [1058510802],
              attachable_type: ['Enrollment'],
            },
          },
        };
        expect(getChangelog(diff)).toEqual([
          'Changement du poste du deuxième contact de "non renseigné" en "Chef"',
          'Changement de l’email du deuxième contact de "non renseigné" en "datapass@yopmail.com"',
          'Changement du champ "team_members.1.user_id" de "non renseigné" en "417269330"',
          'Changement du prénom du deuxième contact de "non renseigné" en "Administrator"',
          'Changement du nom du deuxième contact de "non renseigné" en "Test"',
          'Changement du numéro de téléphone du deuxième contact de "non renseigné" en "0000000000"',
          'Changement du champ "documents.0.id" de "non renseigné" en "195"',
          'Changement du champ "documents.0.type" de "non renseigné" en "Document::LegalBasis"',
          'Changement du champ "documents.0.attachment" de "non renseigné" en "A06_-_Mode_d_emploi_-_avance_imme_diate_de_cre_dit_d_impo_t.pdf"',
          'Changement du champ "documents.0.attachable_id" de "non renseigné" en "1058510802"',
          'Changement du champ "documents.0.attachable_type" de "non renseigné" en "Enrollment"',
        ]);
      });
    });

    const scopeChangelog = [
      'Changement du périmètre de données "birthcountry" de "coché" en "décoché"',
      'Changement du périmètre de données "birthdate" de "décoché" en "coché"',
      'Changement du champ "additional_content.eidas_level" de "non renseigné" en "1"',
    ];
    it('should return changelog for scopes in v2', () => {
      const diff = {
        _v: '2',
        scopes: {
          birthcountry: [true, false],
          birthdate: [false, true],
        },
        additional_content: {
          eidas_level: ['1'],
        },
      };
      expect(getChangelog(diff)).toEqual(scopeChangelog);
    });

    it('should return changelog for scopes in v3', () => {
      const diff = {
        _v: '3',
        scopes: [
          ['birthcountry', 'gender'],
          ['birthdate', 'gender'],
        ],
        additional_content: {
          eidas_level: ['1'],
        },
      };
      expect(getChangelog(diff)).toEqual(scopeChangelog);
    });
  });

  describe('hashToQueryParams', () => {
    it('should return a query params string', () => {
      expect(hashToQueryParams({ a: 1, b: true, c: false, d: [] })).toBe(
        '?a=1&b=true'
      );
    });

    it('should return a query params string with one argument', () => {
      expect(hashToQueryParams({ a: 1 })).toBe('?a=1');
    });

    it('should return an empty query params string', () => {
      expect(hashToQueryParams({})).toBe('');
    });

    it('should return an empty query params string', () => {
      expect(hashToQueryParams(null)).toBe('');
    });

    it('should return an serialized json object', () => {
      expect(hashToQueryParams({ o: [{ id: 'a', value: 'b' }] })).toBe(
        '?o=%5B%7B%22id%22%3A%22a%22%2C%22value%22%3A%22b%22%7D%5D'
      );
    });

    it('should return an serialized json object', () => {
      const state = { demarche: 'ccas' };

      expect(hashToQueryParams(state)).toBe('?demarche=ccas');
    });

    it('should override value when new value is null', () => {
      expect(hashToQueryParams({ a: 0, b: 2 }, 'a=1')).toBe('?b=2');
    });
  });

  describe('collectionWithKeyToObject', () => {
    it('should return empty object for empty array', () => {
      expect(collectionWithKeyToObject([])).toStrictEqual({});
    });

    it('should return empty object for undefined', () => {
      expect(collectionWithKeyToObject(undefined)).toStrictEqual({});
    });

    it('should turn collection with key into object', () => {
      const collectionWithKey = [
        { id: 'a', attr1: 'a1', attr2: 'a2' },
        { id: 'b', attr1: 'b1', attr2: 'b2' },
      ];
      expect(collectionWithKeyToObject(collectionWithKey)).toStrictEqual({
        a: { attr1: 'a1', attr2: 'a2' },
        b: { attr1: 'b1', attr2: 'b2' },
      });
    });
  });

  describe('getStateFromUrlParams', () => {
    let location = null;

    beforeEach(() => {
      location = global.window.location;
      delete global.window.location;
      global.window = Object.create(window);
      global.window.location = {
        protocol: 'http:',
        hostname: 'localhost',
      };
    });

    afterEach(() => {
      global.window.location = location;
      location = null;
    });

    it('should return a hash from filtered enrollment list url', () => {
      global.window.location.search =
        '?page=0' +
        '&sorted=%5B%7B"id"%3A"updated_at"%2C"desc"%3Atrue%7D%5D' +
        '&filtered=%5B%7B"id"%3A"nom_raison_sociale"%2C"value"%3A"te"%7D%2C%7B"id"%3A"user.email"%2C"value"%3A"france"%7D%2C%7B"id"%3A"target_api"%2C"value"%3A%5B"franceconnect"%5D%7D%2C%7B"id"%3A"status"%2C"value"%3A%5B""%5D%7D%5D';

      const expectedResult = {
        page: 0,
        sorted: [{ id: 'updated_at', desc: true }],
        filtered: [
          { id: 'nom_raison_sociale', value: 'te' },
          { id: 'user.email', value: 'france' },
          { id: 'target_api', value: ['franceconnect'] },
          { id: 'status', value: [''] },
        ],
      };

      expect(
        getStateFromUrlParams({ page: 0, sorted: [], filtered: [] })
      ).toEqual(expectedResult);
    });

    it('should ignore null value', () => {
      global.window.location.search = '?a=&b&d=1';

      const expectedResult = { a: '', b: '', c: '' };

      expect(getStateFromUrlParams({ a: '', b: '', c: '' })).toEqual(
        expectedResult
      );
    });

    it('should process boolean value', () => {
      global.window.location.search = '?a=true&b=false';

      const expectedResult = { a: true, b: false, c: false };

      expect(getStateFromUrlParams({ a: false, b: true, c: false })).toEqual(
        expectedResult
      );
    });

    it('should return a hash from preset enrollment demarche form url', () => {
      global.window.location.search = '?demarche=ccas';

      const expectedResult = { demarche: 'ccas' };

      expect(
        getStateFromUrlParams({
          demarche: '',
        })
      ).toEqual(expectedResult);
    });

    it('should process nested array value', () => {
      global.window.location.search =
        '?filtered=%5B%7B%22id%22%3A%22target_api%22%2C%22value%22%3A%5B%22api_particulier%22%2C%22api_entreprise%22%5D%7D%2C%7B%22id%22%3A%22nom_raison_sociale%22%2C%22value%22%3A%22a%22%7D%5D';

      const expectedResult = {
        filtered: [
          {
            id: 'target_api',
            value: ['api_particulier', 'api_entreprise'],
          },
          { id: 'nom_raison_sociale', value: 'a' },
        ],
      };

      expect(getStateFromUrlParams({ filtered: [] })).toEqual(expectedResult);
    });

    it('should be the inverse fonction of hashToQueryParams', () => {
      const hash = {
        filtered: [
          {
            id: 'target_api',
            value: ['api_particulier', 'api_entreprise'],
          },
          { id: 'nom_raison_sociale', value: 'a' },
        ],
      };

      global.window.location.search = hashToQueryParams(hash);

      expect(getStateFromUrlParams({ filtered: [] })).toEqual(hash);
    });
  });

  describe('findModifiedFields', () => {
    it('should return null when only empty field are modified', () => {
      expect(
        findModifiedFields(
          {
            fondement_juridique_title: '',
          },
          {
            fondement_juridique_title:
              'Article L114-6 du code du service national',
          }
        )
      ).toStrictEqual([]);
    });

    it('should return an array with modified field(s)', () => {
      const demarcheState = {
        intitule:
          'Calcul de la tarification pour la facturation des services périscolaires, restauration scolaire et des accueils de loisirs.',
        description: 'description',
        scopes: {
          cnaf_quotient_familial: false,
          dgfip_declarant1_nom: false,
        },
      };
      const enrollmentState = {
        acl: {
          update: true,
          submit: true,
        },
        status: 'pending',
        target_api: 'api_particulier',
        intitule: 'Mon intitulé',
        scopes: {
          dgfip_declarant1_nom: false,
          cnaf_quotient_familial: false,
        },
        team_members: [
          {
            type: 'demandeur',
            tmp_id: 'tmp_31',
            email: 'datapass@yopmail.com',
          },
          {
            type: 'responsable_technique',
            tmp_id: 'tmp_34',
          },
        ],
      };
      expect(findModifiedFields(demarcheState, enrollmentState)).toStrictEqual([
        'intitule',
      ]);
    });
  });

  describe('findModifiedScopes', () => {
    it('should return an object containing modified scopes', () => {
      const demarcheState = {
        scopes: {
          dgfip_declarant1_nom: true,
          cnaf_quotient_familial: true,
        },
      };
      const enrollmentState = {
        scopes: {
          dgfip_declarant1_nom: true,
          cnaf_quotient_familial: false,
        },
      };
      expect(findModifiedScopes(demarcheState, enrollmentState)).toStrictEqual({
        cnaf_quotient_familial: false,
      });
    });

    it('should not return scopes that have been removed', () => {
      const demarcheState = {
        scopes: {
          dgfip_declarant1_nom: true,
        },
      };
      const enrollmentState = {
        scopes: {
          dgfip_declarant1_nom: true,
          entreprise: false,
        },
      };
      expect(findModifiedScopes(demarcheState, enrollmentState)).toStrictEqual(
        {}
      );
    });

    it('should not return scopes that have been added', () => {
      const demarcheState = {
        scopes: {
          dgfip_declarant1_nom: true,
          entreprise: false,
        },
      };
      const enrollmentState = {
        scopes: {
          dgfip_declarant1_nom: true,
        },
      };
      expect(findModifiedScopes(demarcheState, enrollmentState)).toStrictEqual(
        {}
      );
    });
  });

  /*
   * duplicated from : moncomptepro/test/security.test.js
   */
  describe('isEmailValid', () => {
    it('should return false for undefined value', () => {
      expect(isEmailValid(undefined)).toStrictEqual(false);
    });

    it('should return false for empty string', () => {
      expect(isEmailValid('')).toStrictEqual(false);
    });

    it('should return false if no @ is present', () => {
      expect(isEmailValid('test')).toStrictEqual(false);
    });

    it('should return false if no domain is present', () => {
      expect(isEmailValid('test@')).toStrictEqual(false);
    });

    it('should return false if two @ are present', () => {
      expect(isEmailValid('test@test@test')).toStrictEqual(false);
    });

    it('should return false if domains contain other than letters, numbers, hyphens (-) and periods (.)', () => {
      expect(isEmailValid('test@test_test')).toStrictEqual(false);
    });

    it('should return false if local part is longer than 63 characters', () => {
      expect(
        isEmailValid(
          '1234567890123456789012345678901234567890123456789012345678901234@test'
        )
      ).toStrictEqual(false);
    });

    it('should return false if total length is longer than 254 characters', () => {
      expect(
        isEmailValid(
          'test@1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890'
        )
      ).toStrictEqual(false);
    });

    // this test cases have been taken from
    // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript/32686261#32686261
    const validEmailAddresses = [
      'prettyandsimple@example.com',
      'very.common@example.com',
      'disposable.style.email.with+symbol@example.com',
      'other.email-with-dash@example.com',
      "#!$%&'*+-/=?^_`{}|~@example.org",
      '"()[]:,;\\"!#$%&\'*+-/=?^_`{}| ~.a"@example.org',
      '" "@example.org', // space between the quotes
      'üñîçøðé@example.com', // Unicode characters in local part
      'Pelé@example.com', // Latin
    ];

    validEmailAddresses.forEach((validEmailAddress) => {
      it('should return true for valid email address', () => {
        expect(isEmailValid(validEmailAddress)).toStrictEqual(true);
      });
    });
  });

  describe('isValidPhoneNumber', () => {
    it('should return false for empty phone number', () => {
      expect(isValidPhoneNumber()).toStrictEqual(false);
    });
    it('should return false for non string value', () => {
      expect(isValidPhoneNumber([])).toStrictEqual(false);
    });
    it('should return true for valid phone number no spaces', () => {
      expect(isValidPhoneNumber('0123456789')).toStrictEqual(true);
    });
    it('should return true for valid phone number with spaces', () => {
      expect(isValidPhoneNumber('01 23 45 67 89')).toStrictEqual(true);
    });
    it('should return true for valid phone number with country indicator', () => {
      expect(isValidPhoneNumber('+33 1 23 45 67 89')).toStrictEqual(true);
    });
  });

  describe('isIndividualEmailAddress', () => {
    it('should return false for empty phone number', () => {
      expect(isIndividualEmailAddress()).toStrictEqual(false);
    });
    it('should return false for non string value', () => {
      expect(isIndividualEmailAddress([])).toStrictEqual(false);
    });
    it('should return true for individual email address', () => {
      expect(
        isIndividualEmailAddress('michel.michel-evm@orange.fr')
      ).toStrictEqual(true);
    });
    [
      'michel-michel.centre-social@orange.fr',
      'i-services.michel@orange.fr',
    ].forEach((email) => {
      it(`should return true for ${email}`, () => {
        expect(isIndividualEmailAddress(email)).toStrictEqual(false);
      });
    });
    groupEmailAddresses.forEach((email) => {
      it(`should return false for ${email}`, () => {
        expect(isIndividualEmailAddress(email)).toStrictEqual(false);
      });
    });
  });

  describe('isValidMobilePhoneNumber', () => {
    it('should return false for empty phone number', () => {
      expect(isValidMobilePhoneNumber()).toStrictEqual(false);
    });
    it('should return false for non string value', () => {
      expect(isValidMobilePhoneNumber([])).toStrictEqual(false);
    });
    it('should return false for valid phone number no spaces', () => {
      expect(isValidMobilePhoneNumber('0123456789')).toStrictEqual(false);
    });
    it('should return false for valid phone number with spaces', () => {
      expect(isValidMobilePhoneNumber('01 23 45 67 89')).toStrictEqual(false);
    });
    it('should return false for valid phone number with country indicator', () => {
      expect(isValidMobilePhoneNumber('+33 1 73 45 67 89')).toStrictEqual(
        false
      );
    });
    it('should return true for valid mobile phone number no spaces 06', () => {
      expect(isValidMobilePhoneNumber('0623456789')).toStrictEqual(true);
    });
    it('should return true for valid mobile phone number no spaces 07', () => {
      expect(isValidMobilePhoneNumber('0623456789')).toStrictEqual(true);
    });
    it('should return true for valid mobile phone number with spaces 06', () => {
      expect(isValidMobilePhoneNumber('06 23 45 67 89')).toStrictEqual(true);
    });
    it('should return true for valid mobile phone number with country indicator 07', () => {
      expect(isValidMobilePhoneNumber('+33 7 23 45 67 89')).toStrictEqual(true);
    });
  });

  describe('stackLowUseAndUnpublishedApi', () => {
    it('should return anonymised count by api collection', () => {
      const enrollment_by_target_api = [
        {
          name: 'published_1',
          count: 5,
        },
        {
          name: 'not_published',
          count: 4,
        },
        {
          name: 'published_2',
          count: 3,
        },
        {
          name: 'published_3',
          count: 2,
        },
        {
          name: 'not_published',
          count: 1,
        },
        {
          name: 'published_4',
          count: 1,
        },
      ];

      const publishedApis = [
        'published_1',
        'published_2',
        'published_3',
        'published_4',
      ];

      expect(
        stackLowUseAndUnpublishedApi(publishedApis, enrollment_by_target_api, 3)
      ).toStrictEqual([
        {
          name: 'published_1',
          count: 5,
        },
        {
          name: 'published_2',
          count: 3,
        },
        {
          name: 'published_3',
          count: 2,
        },
        {
          name: 'others',
          count: 6,
        },
      ]);
    });
  });

  describe('dataProviderParametersToContactInfo', () => {
    it('should return stacked contact info', () => {
      const parameters = [
        { label: 'API 1', email: 'contact@api1.fr' },
        { label: 'API 2', email: 'contact@api2.fr' },
        { label: 'API 3', email: 'contact@api1.fr' },
        { label: 'API 4', email: null },
      ];

      const expected = [
        { label: 'API 1, API 3', email: 'contact@api1.fr' },
        { label: 'API 2', email: 'contact@api2.fr' },
      ];

      const result = dataProviderConfigurationsToContactInfo(parameters);

      expect(result).toStrictEqual(expected);
    });

    it('should manage data provider with many api', () => {
      const parameters = [
        { label: 'API 1 (Bac à sable)', email: 'contact@api1.fr' },
        { label: 'API 1 (Production)', email: 'contact@api1.fr' },
        { label: 'API 1 (FC) (Bac à sable)', email: 'contact@api1.fr' },
        { label: 'API 1 (FC) (Production)', email: 'contact@api1.fr' },
        { label: 'API 2 (Bac à sable)', email: 'contact@api1.fr' },
        { label: 'API 2 (Production)', email: 'contact@api1.fr' },
        { label: 'API 3 (Bac à sable)', email: 'contact@api1.fr' },
        { label: 'API 3 (Production)', email: 'contact@api1.fr' },
        { label: 'API 4 (Bac à sable)', email: 'contact@api1.fr' },
        { label: 'API 4 (Production)', email: 'contact@api1.fr' },
        { label: 'API 5 (Bac à sable)', email: 'contact@api1.fr' },
        { label: 'API 5 (Production)', email: 'contact@api1.fr' },
        { label: 'API 6 (Bac à sable)', email: 'contact@api1.fr' },
        { label: 'API 6 (Production)', email: 'contact@api1.fr' },
      ];

      const expected = [
        { label: 'API 1, API 2, API 3, API 4, etc.', email: 'contact@api1.fr' },
      ];

      const result = dataProviderConfigurationsToContactInfo(parameters);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('getScopesFromEnrollments', () => {
    it('should return scopes', () => {
      const enrollments = [
        {
          id: 1058510684,
          scopes: {
            scope1: true,
            scope2: false,
          },
        },
        {
          id: 1058510632,
          scopes: {
            scope3: true,
          },
        },
        {
          id: 1058510631,
          scopes: {
            scope1: true,
          },
        },
      ];

      const result = getScopesFromEnrollments(enrollments);

      expect(result).toStrictEqual(['scope1', 'scope3']);
    });
  });
});
