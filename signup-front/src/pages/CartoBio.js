import React from 'react';
import PropTypes from 'prop-types';

import Form from '../components/templates/Form';
import OrganisationSection from '../components/organisms/form-sections/OrganisationSection';
import DescriptionSection from '../components/organisms/form-sections/deprecated/DescriptionSection';
import MiseEnOeuvreSection from '../components/organisms/form-sections/deprecated/MiseEnOeuvreSection';
import DonneesSection from '../components/organisms/form-sections/cartobio-sections/DonneesSection';
import CguSection from '../components/organisms/form-sections/cartobio-sections/CguSection';

const CartoBio = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api="cartobio"
    documentationUrl="https://api.gouv.fr/les-api/api_cartobio_territoires"
    contactInformation={[
      {
        email: 'cartobio@beta.gouv.fr',
        label: 'Nous contacter',
        subject: 'Contact%20via%20datapass.api.gouv.fr',
      },
    ]}
  >
    <OrganisationSection />
    <DescriptionSection descriptionHelper="Dites-nous en quoi les données géographiques vous permettent de réaliser vos missions ? Quelle sont-elles ?" />
    <DonneesSection />
    <MiseEnOeuvreSection />
    <CguSection />
  </Form>
);

CartoBio.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

CartoBio.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default CartoBio;
