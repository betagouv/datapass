import React from 'react';
import PropTypes from 'prop-types';

import Form from '../components/templates/Form';
import OrganisationSection from '../components/organisms/form-sections/OrganisationSection';
import DescriptionSection from '../components/organisms/form-sections/deprecated/DescriptionSection';
import DonneesPersonnellesSection from '../components/organisms/form-sections/deprecated/DonneesPersonnellesSection';
import MiseEnOeuvreSection from '../components/organisms/form-sections/deprecated/MiseEnOeuvreSection';
import CguSection from '../components/organisms/form-sections/deprecated/CguSection';
import SolutionLogicielleSection from '../components/organisms/form-sections/le-taxi-sections/SolutionLogicielleSection';
import Quote from '../components/atoms/inputs/Quote';

const DemarcheDescription = () => (
  <div className="notification grey">
    <p>
      Remplissez ce formulaire pour vous inscrire au Registre de disponibilité
      des Taxis.
    </p>
  </div>
);

const contact = {
  contact_metier: {
    heading: 'Personne en charge du suivi',
    description: (
      <Quote>
        <p>
          Cette personne sera notre point d’entrée dans votre entreprise. Si la
          solution logicielle que votre groupement ou centrale utilise est
          développée en interne, les codes d’accès à l’API seront envoyées à
          cette personne.
        </p>
      </Quote>
    ),
    email: '',
  },
};

const LeTaxiChauffeurs = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api="le_taxi_chauffeurs"
    DemarcheDescription={DemarcheDescription}
    documentationUrl="https://api.gouv.fr/les-api/le-taxi"
    contactInformation={[
      {
        email: 'equipe@le.taxi',
        label: 'Nous contacter',
        subject: 'Contact%20via%20datapass.api.gouv.fr',
      },
    ]}
  >
    <OrganisationSection />
    <DescriptionSection />
    <SolutionLogicielleSection />
    <DonneesPersonnellesSection />
    <MiseEnOeuvreSection initialContacts={contact} />
    <CguSection cguLink="https://le.taxi/assets/documents/CGU.pdf" />
  </Form>
);

LeTaxiChauffeurs.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

LeTaxiChauffeurs.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default LeTaxiChauffeurs;
