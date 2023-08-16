import React from 'react';
import Form from '../components/templates/Form';
import ArchivedSection from '../components/organisms/form-sections/ArchivedSection';

const CartoBio = () => (
  <Form
    target_api="cartobio"
    contactEmail="cartobio@beta.gouv.fr"
    documentationUrl="https://api.gouv.fr/les-api/api_cartobio_territoires"
  >
    <ArchivedSection />
  </Form>
);

export default CartoBio;
