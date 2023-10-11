import React from 'react';
import Form from '../../components/templates/Form';
import DescriptionSection from '../../components/organisms/form-sections/DescriptionSection';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import DemarcheSection from '../../components/organisms/form-sections/DemarcheSection';
import ÉquipeSection from '../../components/organisms/form-sections/ÉquipeSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import { additionalTermsOfUse, DataAreInTermsOfUseDescription } from './common';
import DonneesSection from '../../components/organisms/form-sections/DonneesSection';
import { DATA_PROVIDER_CONFIGURATIONS } from '../../config/data-provider-configurations';
import PreviousEnrollmentSection from '../../components/organisms/form-sections/PreviousEnrollmentSection';

export const demarches = {
  default: {
    label: 'Demande Libre',
    state: {
      intitule: '',
      description: '',
      data_recipients: '',
      data_retention_period: '',
      fondement_juridique_title: '',
      fondement_juridique_url: '',
      contacts: {},
    },
  },
  envoi_ecritures: {
    label: 'Envoi automatisé des écritures',
    state: {
      intitule: 'Infinoe',
      description:
        'LʼAPI Infinoé permet à chaque organisme public national de transmettre les écritures budgétaires, comptables et financières à lʼapplication Infinoé (Informations Financières des Organismes de l’État) développée par la Direction Générale des Finances Publiques.',
      data_recipients:
        'La DGFIP est destinataire des données budgétaires, comptables et référentielles',
      data_retention_period: '0',
      fondement_juridique_title:
        'Décret n°2012-1246 du 7 novembre 2012 relatif à la gestion budgétaire et comptable publique',
      fondement_juridique_url:
        'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000026597003/',
    },
  },
};

const target_api = 'api_infinoe_sandbox';
const steps = [target_api, 'api_infinoe_production'];

const ApiInfinoeSandbox = () => (
  <Form
    target_api={target_api}
    demarches={demarches}
    contactEmail={DATA_PROVIDER_CONFIGURATIONS[target_api]?.email}
    documentationUrl="https://api.gouv.fr/producteurs/dgfip"
  >
    <PreviousEnrollmentSection steps={steps} />
    <OrganisationSection />
    <DemarcheSection />
    <DescriptionSection />
    <DonneesSection ScopesDescription={DataAreInTermsOfUseDescription} />
    <CadreJuridiqueSection />
    <ÉquipeSection />
    <CguSection
      cguLink="/docs/cgu_infinoe_bac_a_sable_v_2023_10.pdf"
      additionalTermsOfUse={additionalTermsOfUse}
    />
  </Form>
);

export default ApiInfinoeSandbox;
