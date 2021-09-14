import React from 'react';
import PropTypes from 'prop-types';

import Form from '../components/templates/Form';
import OrganisationSection from '../components/organisms/form-sections/OrganisationSection';
import DescriptionSection from '../components/organisms/form-sections/deprecated/DescriptionSection';
import CadreJuridiqueSection from '../components/organisms/form-sections/deprecated/CadreJuridiqueSection';
import CguSection from '../components/organisms/form-sections/deprecated/CguSection';
import MiseEnOeuvreSection from '../components/organisms/form-sections/deprecated/MiseEnOeuvreSection';
import IpSection from '../components/organisms/form-sections/agence-bio-sections/IpSection';

const AgenceBio = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form enrollmentId={enrollmentId} target_api="agence_bio">
    <OrganisationSection />
    <DescriptionSection />
    <CadreJuridiqueSection />
    <IpSection />
    <MiseEnOeuvreSection />
    <CguSection cguLink="" />
  </Form>
);

AgenceBio.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

AgenceBio.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default AgenceBio;
