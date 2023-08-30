import fs from 'fs';

// Typage pour la structure de demarches.json basé sur l'exemple que vous avez fourni précédemment.
type Demarche = {
  label: string;
  about?: string;
  state: {
    intitule?: string;
    description?: string;
    fondement_juridique_title?: string;
    fondement_juridique_url?: string;
    data_retention_period?: string;
    data_recipients?: string;
    scopes: { [key: string]: boolean };
    [key: string]: any; // pour permettre des clés supplémentaires
  };
  team_members?: {
    responsable_technique?: {
      given_name: string;
      family_name: string;
      email: string;
      phone_number: string;
    };
    contact_metier?: {
      given_name: string;
      family_name: string;
      email: string;
      phone_number: string;
    };
  };
  [key: string]: any; // pour permettre des clés supplémentaires
};

type Demarches = { [directory: string]: Demarche };

const getDemarchesFiles = function (
  dir: string,
  demarches: Demarches = {},
  directory = ''
): Demarches {
  const files = fs.readdirSync(dir);
  files.forEach(function (file) {
    if (fs.statSync(dir + file).isDirectory()) {
      getDemarchesFiles(dir + file + '/', demarches, file);
    } else {
      if (file === 'demarches.json') {
        const demarche = fs.readFileSync(dir + file, { encoding: 'utf-8' });
        demarches[directory] = JSON.parse(demarche);
      }
    }
  });
  return demarches;
};

// Vos tests restent les mêmes

describe('demarches', () => {
  const allDemarches = getDemarchesFiles('./src/pages/');
  describe('Sanity checks on demarches object', () => {
    it('should have several demarches', () => {
      expect(Object.keys(allDemarches).length).toBeGreaterThan(0);
    });

    const compulsoryFields = ['state', 'label'];

    compulsoryFields.forEach((fieldName) => {
      it(`should have a defined ${fieldName} field`, async () => {
        Object.entries(allDemarches).forEach((apiDemarcheskVp) => {
          let hasField = true;
          Object.entries(apiDemarcheskVp[1]).forEach((keyValue) => {
            //@ts-ignore
            if (keyValue[1][fieldName] === undefined) {
              console.log(
                `demarche ${keyValue[0]} of ${apiDemarcheskVp[0]} has no ${fieldName}`
              );
              hasField = false;
            }
          });
          expect(hasField).toEqual(true);
        });
      });
    });
  });

  Object.entries(allDemarches).forEach((apiDemarcheskVp) => {
    it(`should have unique id for API ${apiDemarcheskVp[0]}`, () => {
      const demarcheIds = Object.keys(apiDemarcheskVp[1]);
      const uniqueDemarcheIds = [...new Set(demarcheIds)];
      expect(uniqueDemarcheIds.length).toEqual(demarcheIds.length);
    });
  });

  Object.entries(allDemarches).forEach((apiDemarcheskVp) => {
    it(`should have a default demarche in ${apiDemarcheskVp[0]}`, () => {
      expect(apiDemarcheskVp[1]['default']).toBeDefined();
    });
  });

  Object.entries(allDemarches).forEach((apiDemarcheskVp) => {
    const defaultDemarche = apiDemarcheskVp[1]['default'];

    it(`default demarche' state should contain every fields that appear in other demarches ${apiDemarcheskVp[0]}`, () => {
      let everyFields = true;
      Object.entries(apiDemarcheskVp[1]).forEach((keyValue) => {
        Object.keys(keyValue[1].state).forEach((field) => {
          if (
            defaultDemarche.state[field] === undefined &&
            !['technical_team_type', 'technical_team_value'].includes(field)
          ) {
            console.log(
              `field ${field} not present in default demarche of ${apiDemarcheskVp[0]}`
            );
            everyFields = false;
          }
        });
      });
      expect(everyFields).toEqual(true);
    });
  });

  Object.entries(allDemarches).forEach((apiDemarcheskVp) => {
    const defaultDemarche = apiDemarcheskVp[1]['default'];

    it(`default demarche' scope should contain every scope's field that appear in other demarches ${apiDemarcheskVp[0]}`, () => {
      let everyScopeFields = true;
      Object.entries(apiDemarcheskVp[1]).forEach((keyValue) => {
        Object.keys(keyValue[1].state.scopes || []).forEach((field) => {
          if (defaultDemarche.state.scopes[field] === undefined) {
            console.log(
              `field ${field} not present in default demarche's scope of ${apiDemarcheskVp[0]}`
            );
            everyScopeFields = false;
          }
        });
      });
      expect(everyScopeFields).toEqual(true);
    });
  });
});
