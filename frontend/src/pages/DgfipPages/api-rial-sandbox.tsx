import React from 'react';
import Form from '../../components/templates/Form';
import DescriptionSection from '../../components/organisms/form-sections/DescriptionSection';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import ÉquipeSection from '../../components/organisms/form-sections/ÉquipeSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import { additionalTermsOfUse, DataAreInTermsOfUseDescription } from './common';
import DonneesSection from '../../components/organisms/form-sections/DonneesSection';
import { DATA_PROVIDER_CONFIGURATIONS } from '../../config/data-provider-configurations';
import PreviousEnrollmentSection from '../../components/organisms/form-sections/PreviousEnrollmentSection';
import ApiRialDocumentationAlert from '../../components/molecules/ApiRialDocumentationAlert';
import { accessModes } from './api-impot-particulier-common';

const target_api = 'api_rial_sandbox';
const steps = [target_api, 'api_rial_production'];

export const demarches = {
  default: {
    label: 'Demande libre',
    state: {
      intitule: '',
      description: '',
      data_recipients: '',
      fondement_juridique_title: '',
    },
  },
  recherche_local_identifiant: {
    label: 'Recherche d’un local par son identifiant fiscal',
    state: {
      intitule: 'Recherche d’un local par son identifiant fiscal',
      description: '',
      data_recipients: '',
      fondement_juridique_title: '',
    },
  },
  recherche_locaux_parcelle_cadastre: {
    label: 'Recherche de locaux par une parcelle cadastrale',
    state: {
      intitule: 'Recherche de locaux par une parcelle cadastrale',
      description: '',
      data_recipients: '',
      fondement_juridique_title: '',
    },
  },
  recherche_locaux_adresse: {
    label: 'Recherche de locaux par une adresse',
    state: {
      intitule: 'Recherche de locaux par une adresse',
      description: '',
      data_recipients: '',
      fondement_juridique_title: '',
    },
  },
};

export const accessModes = [
  {
    id: 'recherche_local_identifiant',
    label: 'Recherche d’un local par son identifiant fiscal',
  },
  {
    id: 'recherche_locaux_parcelle_cadastre',
    label: 'Recherche de locaux par une parcelle cadastrale',
  },
  {
    id: 'recherche_locaux_adresse',
    label: 'Recherche de locaux par une adresse',
  },
];

const ApiRialSandbox = () => (
  <Form
    target_api={target_api}
    demarches={demarches}
    contactEmail={DATA_PROVIDER_CONFIGURATIONS[target_api]?.email}
    documentationUrl="https://api.gouv.fr/producteurs/dgfip"
  >
    <PreviousEnrollmentSection steps={steps} />
    <OrganisationSection />
    <DescriptionSection />
    <DonneesSection
      ScopesDescription={DataAreInTermsOfUseDescription}
      DonneesDocumentation={ApiRialDocumentationAlert}
      accessModes={accessModes}
    />
    <CadreJuridiqueSection />
    <ÉquipeSection />
    <CguSection
      cguLink="/docs/cgu_bas_api_rial_v2024-11.pdf"
      additionalTermsOfUse={additionalTermsOfUse}
    />
  </Form>
);

export default ApiRialSandbox;
