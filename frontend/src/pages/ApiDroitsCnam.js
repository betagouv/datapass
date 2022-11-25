import React from 'react';
import Form from '../components/templates/Form';
import OrganisationSection from '../components/organisms/form-sections/OrganisationSection';
import DemarcheSection from '../components/organisms/form-sections/DemarcheSection';
import DescriptionSection from '../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../components/organisms/form-sections/DonneesSection';
import CadreJuridiqueSection from '../components/organisms/form-sections/CadreJuridiqueSection';
import CguSection from '../components/organisms/form-sections/CguSection';
import ÉquipeSection from '../components/organisms/form-sections/ÉquipeSection';
import { DATA_PROVIDER_CONFIGURATIONS } from '../config/data-provider-configurations';
import PreviousEnrollmentSection from '../components/organisms/form-sections/PreviousEnrollmentSection';

const scopesConfiguration = [
  {
    value: 'cnam_beneficiaires',
    label: 'Liste des ayant-droits',
  },
  {
    value: 'cnam_contrats',
    label: 'Droits de base',
  },
  {
    value: 'cnam_caisse',
    label: 'Caisse gestionnaire',
  },
  {
    value: 'cnam_exonerations',
    label: 'Exonérations ou modulations éventuelles',
  },
  {
    value: 'cnam_medecin_traitant',
    label: 'Médecin traitant',
  },
  {
    value: 'cnam_presence_medecin_traitant',
    label: 'Présence d’un médecin traitant',
  },
];

const demarches = {
  default: {
    label: 'Demande Libre',
    state: {
      scopes: {
        cnam_beneficiaires: false,
        cnam_contrats: false,
        cnam_caisse: false,
        cnam_exonerations: false,
        cnam_medecin_traitant: false,
        cnam_presence_medecin_traitant: false,
      },
    },
  },
  etablissement_de_soin: {
    label: 'Établissement de soin',
    state: {
      scopes: {
        cnam_beneficiaires: true,
        cnam_caisse: true,
        cnam_contrats: true,
        cnam_exonerations: true,
        cnam_medecin_traitant: true,
      },
    },
  },
  organisme_complementaire: {
    label: 'Organisme complémentaire',
    state: {
      scopes: {
        cnam_beneficiaires: true,
        cnam_caisse: true,
        cnam_contrats: true,
        cnam_presence_medecin_traitant: true,
      },
    },
  },
};

const target_api = 'api_droits_cnam';

const steps = ['franceconnect', target_api];

const ApiDroitsCnam = () => (
  <Form
    target_api={target_api}
    demarches={demarches}
    contactEmail={DATA_PROVIDER_CONFIGURATIONS[target_api]?.email}
    documentationUrl="https://api.gouv.fr/les-api/api_ameli_droits_cnam"
  >
    <PreviousEnrollmentSection steps={steps} />
    <OrganisationSection />
    <DemarcheSection scopesConfiguration={scopesConfiguration} />
    <DescriptionSection />
    <DonneesSection scopesConfiguration={scopesConfiguration} />
    <CadreJuridiqueSection />
    <ÉquipeSection />
    <CguSection cguLink="/docs/API_Droits_CNAM_CGU_20181210.pdf" />
  </Form>
);

export default ApiDroitsCnam;
