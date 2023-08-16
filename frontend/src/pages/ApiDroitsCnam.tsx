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
    value: 'droits_assurance_maladie',
    label: 'Droits Assurance Maladie',
    required: true,
  },
];

const demarches = {
  default: {
    label: 'Demande Libre',
    state: {},
  },
  etablissement_de_soin: {
    label: 'Établissement de soin',
    state: {},
  },
  organisme_complementaire: {
    label: 'Organisme complémentaire',
    state: {},
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
