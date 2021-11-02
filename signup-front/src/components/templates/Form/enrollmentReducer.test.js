import enrollmentReducerFactory from './enrollmentReducer';

describe('enrollmentReducerFactory', () => {
  const previousEnrollment = {
    acl: {
      update: true,
      send_application: true,
    },
    status: 'pending',
    target_api: 'api_particulier',
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
  describe('enrollmentReducer with no demarches', () => {
    const enrollmentReducer = enrollmentReducerFactory(null);

    it('should return previous enrollment if second argument is not an object', () => {
      expect(enrollmentReducer(previousEnrollment, 'not_an_object')).toEqual(
        previousEnrollment
      );
    });

    it('should return updated enrollment when second argument is an event from input text', () => {
      const newIntitule =
        'Calcul de la tarification pour la facturation des services périscolaires';
      const event = {
        currentTarget: null,
        target: {
          accept: '',
          checked: false,
          name: 'intitule',
          type: 'text',
          value: newIntitule,
        },
      };

      expect(enrollmentReducer(previousEnrollment, event).intitule).toEqual(
        newIntitule
      );
    });

    it('should return updated enrollment when second argument is an event from checkbox', () => {
      const event = {
        currentTarget: null,
        target: {
          accept: '',
          checked: true,
          name: 'scopes.dgfip_declarant1_nom',
          type: 'checkbox',
          value: 'on',
        },
      };

      expect(
        enrollmentReducer(previousEnrollment, event).scopes.dgfip_declarant1_nom
      ).toEqual(true);
    });

    it('should return updated enrollment when second argument is an event from input text in nested object', () => {
      const newEmail = 'tech@yopmail.com';
      const event = {
        currentTarget: null,
        target: {
          accept: '',
          checked: false,
          name: 'team_members[1].email',
          type: 'email',
          value: newEmail,
        },
      };

      // we clone the previousEnrollment as updating a collection mutate the collection in the original enrollment
      expect(enrollmentReducer(previousEnrollment, event).team_members).toEqual(
        [
          {
            type: 'demandeur',
            tmp_id: 'tmp_31',
            email: 'datapass@yopmail.com',
          },
          {
            type: 'responsable_technique',
            tmp_id: 'tmp_34',
            email: newEmail,
          },
        ]
      );
    });

    it('should return updated enrollment when second argument is not an event', () => {
      const savedEnrollment = {
        acl: {
          update: true,
          send_application: true,
          show: true,
          create: true,
          destroy: true,
          notify: false,
          get_email_templates: true,
          copy: false,
          validate_application: false,
          review_application: false,
          refuse_application: false,
          index: false,
        },
        cgu_approved: null,
        demarches: null,
        status: 'pending',
        target_api: 'api_particulier',
        scopes: {
          dgfip_declarant1_nom: false,
          cnaf_quotient_familial: false,
        },
        updated_at: '2021-11-02T10:25:15.468Z',
        created_at: '2021-11-02T10:25:15.468Z',
        id: 1058510693,
        team_members: [
          {
            id: 525,
            type: 'demandeur',
            email: 'datapass@yopmail.com',
          },
          {
            id: 528,
            type: 'responsable_technique',
            email: null,
          },
        ],
        intitule:
          'Calcul de la tarification pour la facturation des services périscolaires',
      };

      const newEnrollment = { ...savedEnrollment };
      delete newEnrollment.demarches;
      delete newEnrollment.cgu_approved;
      newEnrollment.team_members = [
        {
          id: 525,
          type: 'demandeur',
          email: 'datapass@yopmail.com',
          tmp_id: 'tmp_31',
        },
        {
          id: 528,
          type: 'responsable_technique',
          email: null,
          tmp_id: 'tmp_34',
        },
      ];

      expect(enrollmentReducer(previousEnrollment, savedEnrollment)).toEqual(
        newEnrollment
      );
    });
  });

  describe('enrollmentReducer with demarches', function () {
    const demarches = {
      default: {
        label: 'Demande Libre',
        about: 'https://api.gouv.fr/les-api/api-particulier',
        state: {
          intitule: '',
          scopes: {
            dgfip_declarant1_nom: false,
            cnaf_quotient_familial: false,
          },
          team_members: [
            {
              type: 'responsable_technique',
              tmp_id: 'tmp_technique',
              email: '',
            },
          ],
        },
      },
      waigeo: {
        label:
          "Tarification des services liés à l'enfance avec la solution MyPérischool de l'éditeur Waigéo",
        about:
          'https://api.gouv.fr/guides/portail-famille-tarif-activite-periscolaire',
        state: {
          intitule:
            'Calcul de la tarification pour la facturation des services périscolaires, restauration scolaire et des accueils de loisirs.',
          scopes: {
            cnaf_quotient_familial: true,
          },
          team_members: [
            {
              type: 'responsable_technique',
              tmp_id: 'tmp_technique',
              email: 'technique@waigeo.fr',
            },
          ],
        },
      },
    };

    const enrollmentReducer = enrollmentReducerFactory(demarches);

    describe('when a demarche is selected', () => {
      const event = {
        currentTarget: null,
        target: {
          name: 'demarche',
          value: 'waigeo',
        },
      };
      it('should return an updated intitule', () => {
        expect(enrollmentReducer(previousEnrollment, event).intitule).toEqual(
          'Calcul de la tarification pour la facturation des services périscolaires, restauration scolaire et des accueils de loisirs.'
        );
      });
      it('should return updated objects', () => {
        expect(enrollmentReducer(previousEnrollment, event).scopes).toEqual({
          dgfip_declarant1_nom: false,
          cnaf_quotient_familial: true,
        });
      });
      it('should return updated collections', () => {
        expect(
          enrollmentReducer(previousEnrollment, event).team_members
        ).toEqual([
          {
            type: 'demandeur',
            email: 'datapass@yopmail.com',
            tmp_id: 'tmp_31',
          },
          {
            type: 'responsable_technique',
            email: 'technique@waigeo.fr',
            tmp_id: 'tmp_34',
          },
        ]);
      });
    });
  });
});
