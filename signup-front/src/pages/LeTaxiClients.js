import React from 'react';
import PropTypes from 'prop-types';

import Form from '../components/templates/Form';
import OrganisationSection from '../components/organisms/form-sections/OrganisationSection';
import DescriptionSection from '../components/organisms/form-sections/deprecated/DescriptionSection';
import DonneesPersonnellesSection from '../components/organisms/form-sections/deprecated/DonneesPersonnellesSection';
import MiseEnOeuvreSection from '../components/organisms/form-sections/deprecated/MiseEnOeuvreSection';
import CguSection from '../components/organisms/form-sections/deprecated/CguSection';
import { DATA_PROVIDER_CONTACT_EMAILS } from '../config/data-provider-parameters';

const DemarcheDescription = () => (
  <div className="notification grey">
    <p>
      Remplissez ce formulaire pour vous inscrire au Registre de disponibilité
      des Taxis.
    </p>
  </div>
);

const LeTaxiClients = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api="le_taxi_clients"
    DemarcheDescription={DemarcheDescription}
    documentationUrl="https://api.gouv.fr/les-api/le-taxi"
    contactInformation={[
      {
        email: DATA_PROVIDER_CONTACT_EMAILS.le_taxi,
        label: 'Nous contacter',
        subject: 'Contact%20via%20datapass.api.gouv.fr',
      },
    ]}
  >
    <OrganisationSection />
    <DescriptionSection />
    <DonneesPersonnellesSection />
    <MiseEnOeuvreSection />
    <CguSection cguLink="https://le.taxi/assets/documents/CGU.pdf" />
  </Form>
);

LeTaxiClients.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

LeTaxiClients.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default LeTaxiClients;
