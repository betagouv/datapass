import React from 'react';
import Form from '../../components/templates/Form';
import DescriptionSection from '../../components/organisms/form-sections/DescriptionSection';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import DemarcheSection from '../../components/organisms/form-sections/DemarcheSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import ÉquipeSection from '../../components/organisms/form-sections/ÉquipeSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import HomologationSecuriteSection from '../../components/organisms/form-sections/dgfip-sections/HomologationSecuriteSection';
import VolumetrieSection from '../../components/organisms/form-sections/dgfip-sections/VolumetrieSection';
import {
  demarches,
  scopesConfiguration,
  groups,
  DonneesDescription,
} from './api-impot-particulier-common';
import DonneesSection from '../../components/organisms/form-sections/DonneesSection';
import { DATA_PROVIDER_CONFIGURATIONS } from '../../config/data-provider-configurations';
import PreviousEnrollmentSection from '../../components/organisms/form-sections/PreviousEnrollmentSection';

export const CadreJuridiqueDescription = () => (
  <>
    <p>
      Pour pouvoir bénéficier du raccordement à l’API Impôt particulier, le
      cadre légal et réglementaire des fournisseurs de service doit permettre à
      la DGFiP de transmettre des données fiscales à votre entité
      administrative.
    </p>
    <p>
      Conformément au Code des relations entre le public et l’administration,
      l’échange de données s’impose aux administrations dès lors que :
    </p>
    <ul>
      <li>
        ces données sont nécessaires au traitement d’une demande présentée par
        un usager ;
      </li>
      <li>
        l’administration destinataire est habilitée à connaître ces données dans
        le cadre de ses missions. (Article L114-8 1er alinéa modifié par LOI
        n°2016-1321 du 7 octobre 2016 - art. 91 )
      </li>
    </ul>
  </>
);

const target_api = 'api_impot_particulier_fc_unique';
const steps = ['franceconnect', target_api];

const ApiImpotParticulierFcUnique = () => (
  <Form
    target_api={target_api}
    demarches={demarches}
    contactEmail={DATA_PROVIDER_CONFIGURATIONS[target_api]?.email}
    documentationUrl="https://api.gouv.fr/les-api/impot-particulier"
  >
    <PreviousEnrollmentSection steps={steps} />
    <OrganisationSection />
    <DemarcheSection scopesConfiguration={scopesConfiguration} />
    <DescriptionSection />
    <DonneesSection
      DonneesDescription={DonneesDescription}
      scopesConfiguration={scopesConfiguration}
      groups={groups}
      enableFileSubmissionForScopeSelection={true}
    />
    <CadreJuridiqueSection
      CadreJuridiqueDescription={CadreJuridiqueDescription}
    />
    <ÉquipeSection />
    <HomologationSecuriteSection />
    <VolumetrieSection />
    <CguSection cguLink="/docs/cgu_api_impot_particulier_production_connexion_fc_septembre2020_v5.5.pdf" />
  </Form>
);

export default ApiImpotParticulierFcUnique;
