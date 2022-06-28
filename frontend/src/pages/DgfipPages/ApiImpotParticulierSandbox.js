import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import DemarcheSection from '../../components/organisms/form-sections/DemarcheSection';
import DescriptionSection from '../../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../../components/organisms/form-sections/DonneesSection';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import PreviousEnrollmentSection from '../../components/organisms/form-sections/PreviousEnrollmentSection';
import ÉquipeSection from '../../components/organisms/form-sections/ÉquipeSection';
import Form from '../../components/templates/Form';
import { DATA_PROVIDER_PARAMETERS } from '../../config/data-provider-parameters';
import { editorList } from '../ApiParticulier';
import {
  availableScopes as fcAvailableScopes,
  demarches as fcAvailableDemarches,
  DonneesDescription,
} from './api-impot-particulier-common';
import { additionalTermsOfUse } from './common';

const demarches = {
  ...JSON.parse(JSON.stringify(fcAvailableDemarches)),
  eligibilite_lep: {
    label: 'Vérification de l’éligibilité au Livret d’épargne populaire (LEP)',
    state: {
      scopes: {
        dgfip_IndLep: true,
        dgfip_annee_n_moins_1: true,
        dgfip_annee_n_moins_2: true,
        dgfip_acces_spi: true,
        dgfip_acces_etat_civil: true,
      },
    },
  },
};

demarches.default.state.scopes['dgfip_IndLep'] = false;

const availableScopes = [
  ...fcAvailableScopes,
  {
    value: 'dgfip_IndLep',
    label: 'Indicateur d’éligibilité au LEP',
    groupTitle:
      'Éligibilité Livret d’Épargne Populaire - établissements bancaires uniquement',
  },
];

const accessModes = [
  {
    id: 'acces_spi',
    label: 'via le Numéro fiscal (SPI)',
  },
  {
    id: 'acces_etat_civil',
    label: 'via l’état civil',
  },
];

export const CadreJuridiqueDescription = () => (
  <>
    <p>
      Pour pouvoir bénéficier du raccordement à l’API Impôt particulier, le
      cadre légal et réglementaire des fournisseurs de service doit permettre à
      la DGFiP de transmettre des données fiscales à son futur partenaire
      conventionné.
    </p>
    <p>
      Conformément au Code des relations entre le public et l’administration,
      l’échange de données s’impose aux partenaires conventionnés
      (administration, collectivité, établissement bancaire…) dès lors que :
    </p>
    <ul>
      <li>
        ces données sont nécessaires au traitement d’une demande présentée par
        un usager ;
      </li>
      <li>
        le partenaire conventionné destinataire est habilité à connaître ces
        données dans le cadre de ses missions (Article L114-8 1er alinéa modifié
        par LOI n°2016-1321 du 7 octobre 2016 - art. 91 ou tout texte législatif
        ou réglementaire permettant de justifier que le partenaire ait accès aux
        données).
      </li>
    </ul>
  </>
);

const target_api = 'api_impot_particulier_sandbox';
const steps = [target_api, 'api_impot_particulier_production'];

const ApiImpotParticulierSandbox = () => (
  <Form
    target_api={target_api}
    demarches={demarches}
    contactEmail={DATA_PROVIDER_PARAMETERS[target_api]?.email}
    documentationUrl="https://api.gouv.fr/les-api/impot-particulier"
  >
    <PreviousEnrollmentSection steps={steps} />
    <OrganisationSection editorList={editorList} />
    <DemarcheSection availableScopes={availableScopes} />
    <DescriptionSection />
    <DonneesSection
      DonneesDescription={DonneesDescription}
      availableScopes={availableScopes}
      accessModes={accessModes}
      enableFileSubmissionForScopeSelection={true}
    />
    <CadreJuridiqueSection
      CadreJuridiqueDescription={CadreJuridiqueDescription}
    />
    <ÉquipeSection />
    <CguSection
      cguLink="/docs/cgu_api_impot_particulier_bac_a_sable_connexion_hors_fc_septembre2020_v2.6.pdf"
      additionalTermsOfUse={additionalTermsOfUse}
    />
  </Form>
);

export default ApiImpotParticulierSandbox;
