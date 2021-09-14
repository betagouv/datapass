import React from 'react';
import PropTypes from 'prop-types';

import Form from '../../components/templates/Form';
import DgfipRgpdAgreement from '../../components/organisms/form-sections/deprecated/DonneesSection/DgfipRgpdAgreement';
import TextSection from '../../components/organisms/form-sections/TextSection';
import DescriptionSection from '../../components/organisms/form-sections/deprecated/DescriptionSection';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import CguSection from '../../components/organisms/form-sections/deprecated/CguSection';
import MiseEnOeuvreSection from '../../components/organisms/form-sections/deprecated/MiseEnOeuvreSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/deprecated/CadreJuridiqueSection';
import { contacts, SuiteDescription } from './common';
import Quote from '../../components/atoms/inputs/Quote';

DgfipRgpdAgreement.propTypes = {
  additional_content: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

const target_api = 'api_opale_sandbox';
const steps = [target_api, 'api_opale_production'];

const ApiOpaleSandbox = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api={target_api}
    steps={steps}
    documentationUrl="https://api.gouv.fr/producteurs/dgfip"
  >
    <OrganisationSection />
    <DescriptionSection />
    <MiseEnOeuvreSection initialContacts={contacts} />
    <TextSection title="Les données dont vous avez besoin" id="donnees">
      <Quote>
        <p>
          Les données échangées par l’API sont décrites dans les CGU attachées à
          cette demande.
        </p>
      </Quote>
    </TextSection>
    <CadreJuridiqueSection />
    <CguSection cguLink="/docs/cgu_api_hermes_bac_a_sable_v1_4_05-05-2021_cdc.pdf" />
    <TextSection title="" id="next-steps-description">
      <SuiteDescription />
    </TextSection>
  </Form>
);

ApiOpaleSandbox.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

ApiOpaleSandbox.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default ApiOpaleSandbox;
