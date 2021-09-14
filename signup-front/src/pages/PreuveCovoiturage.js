import React from 'react';
import PropTypes from 'prop-types';

import Form from '../components/templates/Form';
import OrganisationSection from '../components/organisms/form-sections/OrganisationSection';
import DescriptionSection from '../components/organisms/form-sections/deprecated/DescriptionSection';
import DonneesSection from '../components/organisms/form-sections/deprecated/DonneesSection';
import CadreJuridiqueSection from '../components/organisms/form-sections/deprecated/CadreJuridiqueSection';
import DonneesPersonnellesSection from '../components/organisms/form-sections/deprecated/DonneesPersonnellesSection';
import MiseEnOeuvreSection from '../components/organisms/form-sections/deprecated/MiseEnOeuvreSection';
import CguSection from '../components/organisms/form-sections/deprecated/CguSection';

const DemarcheDescription = () => (
  <div className="notification grey">
    <p>
      L’accès au Registre de preuve de covoiturage est disponible pour les
      opérateurs de covoiturage et les autorités organisatrices de mobilité
      (AOM).
    </p>
    <p>
      Décrivez brièvement votre service ainsi que l’utilisation prévue des
      données transmises. C'est la raison pour laquelle vous traitez ces données
      qui peuvent inclure des données à caractère personnel.
    </p>
  </div>
);

const availableScopes = [
  {
    value: 'operator',
    label: 'Opérateur de covoiturage',
  },
  {
    value: 'territory',
    label: 'Autorités organisatrices de mobilité (AOM)',
  },
];

const PreuveCovoiturage = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api="preuve_covoiturage"
    DemarcheDescription={DemarcheDescription}
    contactInformation={[
      {
        email: 'contact@covoiturage.beta.gouv.fr',
        label: 'Nous contacter',
        subject: 'Contact%20via%20datapass.api.gouv.fr',
      },
    ]}
  >
    <OrganisationSection />
    <DescriptionSection />
    <DonneesSection availableScopes={availableScopes} />
    <CadreJuridiqueSection />
    <DonneesPersonnellesSection />
    <MiseEnOeuvreSection />
    <CguSection cguLink="https://registre-preuve-de-covoiturage.gitbook.io/produit/cgu" />
  </Form>
);

PreuveCovoiturage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

PreuveCovoiturage.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default PreuveCovoiturage;
