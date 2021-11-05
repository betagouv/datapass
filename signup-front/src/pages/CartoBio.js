import React from 'react';
import PropTypes from 'prop-types';

import Form from '../components/templates/Form';
import ArchivedSection from '../components/organisms/form-sections/ArchivedSection';

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
    <ArchivedSection />
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
