import React from 'react';
import PropTypes from 'prop-types';

import Form from '../../components/templates/Form';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import DescriptionSection from '../../components/organisms/form-sections/deprecated/DescriptionSection';
import DonneesPersonnellesSection from '../../components/organisms/form-sections/deprecated/DonneesPersonnellesSection';
import MiseEnOeuvreSection from '../../components/organisms/form-sections/deprecated/MiseEnOeuvreSection';
import PiecesJustificativesSection from '../../components/organisms/form-sections/urssaf-sections/PiecesJustificativesSection';
import ContratDeLicenceSection from '../../components/organisms/form-sections/urssaf-sections/ContratDeLicenceSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/urssaf-sections/CadreJuridiqueSection';
import { contacts, DemarcheDescriptionCommon } from './common';

const DemarcheDescription = () => (
  <div className="notification grey">
    <p>
      L’API Tiers de prestation permet pour le compte d’un particulier et en
      qualité de tiers de prestation (prestataire ou mandataire de services à la
      personne) d’inscrire le particulier au dispositif et de transmettre à
      l’Urssaf la facturation de ce particulier afin qu’il bénéficie de l’avance
      immédiate de crédit d’impôt SAP.
    </p>
    <DemarcheDescriptionCommon />
  </div>
);

const target_api = 'api_tiers_de_prestation';

const ApiTiersDePrestation = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api={target_api}
    DemarcheDescription={DemarcheDescription}
    documentationUrl="https://api.gouv.fr/producteurs/urssaf"
  >
    <OrganisationSection />
    <DescriptionSection />
    <CadreJuridiqueSection />
    <DonneesPersonnellesSection />
    <MiseEnOeuvreSection
      MiseEnOeuvreDescription={() => null}
      initialContacts={contacts}
    />
    <PiecesJustificativesSection showHabilitationServiceDomicile />
    <ContratDeLicenceSection />
  </Form>
);

ApiTiersDePrestation.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

ApiTiersDePrestation.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default ApiTiersDePrestation;
