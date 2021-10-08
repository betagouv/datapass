import React from 'react';
import PropTypes from 'prop-types';

import Form from '../../components/templates/Form';
import DgfipRgpdAgreement from '../../components/organisms/form-sections/deprecated/DonneesSection/DgfipRgpdAgreement';
import TextSection from '../../components/organisms/form-sections/TextSection';
import DescriptionSection from '../../components/organisms/form-sections/deprecated/DescriptionSection';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import DonneesSection from '../../components/organisms/form-sections/deprecated/DonneesSection';
import CguSection from '../../components/organisms/form-sections/deprecated/CguSection';
import MiseEnOeuvreSection from '../../components/organisms/form-sections/deprecated/MiseEnOeuvreSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/deprecated/CadreJuridiqueSection';
import {
  demarches,
  availableScopes,
  CadreJuridiqueDescription,
  CguDescription,
  DemarcheDescription,
  DonneesFootnote,
} from './api-impot-particulier-common';
import {
  contacts,
  DonneesDescription,
  SuiteDescription,
} from '../../components/organisms/form-sections/deprecated/dgfip-sections/common';
import DemarcheSection from '../../components/organisms/form-sections/deprecated/DemarcheSection';
import { DATA_PROVIDER_CONTACT_EMAILS } from '../../config/data-provider-parameters';

const target_api = 'api_impot_particulier_fc_sandbox';
const steps = [
  'franceconnect',
  target_api,
  'api_impot_particulier_fc_production',
];

const ApiImpotParticulierFcSandbox = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api={target_api}
    steps={steps}
    DemarcheDescription={DemarcheDescription}
    demarches={demarches}
    documentationUrl="https://api.gouv.fr/les-api/impot-particulier"
    contactInformation={[
      {
        email: DATA_PROVIDER_CONTACT_EMAILS.dgfip,
        label: 'Nous contacter',
        subject: 'Contact%20via%20datapass.api.gouv.fr',
      },
    ]}
  >
    <OrganisationSection />
    <DemarcheSection />
    <DescriptionSection />
    <MiseEnOeuvreSection initialContacts={contacts} />
    <DonneesSection
      availableScopes={availableScopes}
      AdditionalRgpdAgreement={DgfipRgpdAgreement}
      DonneesDescription={DonneesDescription}
      DonneesFootnote={DonneesFootnote}
    />
    <CadreJuridiqueSection
      CadreJuridiqueDescription={CadreJuridiqueDescription}
    />
    <CguSection
      cguLink="/docs/cgu_api_impot_particulier_bac_a_sable_connexion_fc_septembre2020_v2.6.pdf"
      CguDescription={CguDescription}
    />
    <TextSection title="" id="next-steps-description">
      <SuiteDescription />
    </TextSection>
  </Form>
);

ApiImpotParticulierFcSandbox.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

ApiImpotParticulierFcSandbox.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default ApiImpotParticulierFcSandbox;
