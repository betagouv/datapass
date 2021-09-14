import React from 'react';
import PropTypes from 'prop-types';

import Form from '../components/templates/Form';
import OrganisationSection from '../components/organisms/form-sections/OrganisationSection';
import DescriptionSection from '../components/organisms/form-sections/deprecated/DescriptionSection';
import DonneesSection from '../components/organisms/form-sections/deprecated/DonneesSection';
import CguSection from '../components/organisms/form-sections/deprecated/CguSection';
import MiseEnOeuvreSection from '../components/organisms/form-sections/deprecated/MiseEnOeuvreSection';
import Quote from '../components/atoms/inputs/Quote';
import TextSection from '../components/organisms/form-sections/TextSection';

const availableScopes = [
  {
    value: 'idnat',
    label: 'Identifiant national',
  },
  {
    value: 'donnees_sectorielles',
    label: 'Données sectorielles',
  },
];

const target_api = 'api_pro_sante_connect';

const ApiProSanteConnect = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form enrollmentId={enrollmentId} target_api={target_api}>
    <OrganisationSection />
    <DescriptionSection />
    <DonneesSection availableScopes={availableScopes} />
    <TextSection title="Le cadre juridique vous autorisant à traiter les données">
      <Quote>
        <p>
          Seules les administrations et les éditeurs de logiciels français qui
          s’adressent aux professionnels de la santé peuvent avoir accès à l’API
          Pro Santé Connect.
        </p>
      </Quote>
    </TextSection>
    <MiseEnOeuvreSection
      title="Coordonnées du référent de votre structure"
      MiseEnOeuvreDescription={() => null}
    />
    <CguSection cguLink="https://integrateurs-cps.asipsante.fr/pages/cgu-psc" />
  </Form>
);

ApiProSanteConnect.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

ApiProSanteConnect.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default ApiProSanteConnect;
