import React from 'react';
import PropTypes from 'prop-types';

import Form from '../../components/templates/Form';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import DemarcheSection from '../../components/organisms/form-sections/deprecated/DemarcheSection';
import DescriptionSection from '../../components/organisms/form-sections/deprecated/DescriptionSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/deprecated/CadreJuridiqueSection';
import CguSection from '../../components/organisms/form-sections/deprecated/CguSection';
import DonneesPersonnellesSection from '../../components/organisms/form-sections/deprecated/DonneesPersonnellesSection';
import MiseEnOeuvreSection from '../../components/organisms/form-sections/deprecated/MiseEnOeuvreSection';
import demarches from './demarches.json';

const ApiServiceNational = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api="api_service_national"
    demarches={demarches}
  >
    <OrganisationSection />
    <DemarcheSection />
    <DescriptionSection />
    <CadreJuridiqueSection />
    <DonneesPersonnellesSection />
    <MiseEnOeuvreSection />
    <CguSection cguLink="https://presaje.sga.defense.gouv.fr/cgu-dln1f" />
  </Form>
);

ApiServiceNational.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

ApiServiceNational.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default ApiServiceNational;
