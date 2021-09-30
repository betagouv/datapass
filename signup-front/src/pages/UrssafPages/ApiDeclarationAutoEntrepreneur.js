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
import { DATA_PROVIDER_CONTACT_EMAILS } from '../../config/data-provider-emails';

const DemarcheDescription = () => (
  <div className="notification grey">
    <p>
      L'API de Tierce Déclaration Auto-Entrepreneur (TDAE) permet à une
      plateforme collaborative d’intervenir en tant que tiers déclarant pour le
      compte de ses utilisateurs autoentrepreneurs et ainsi de réaliser la
      déclaration et d’ordonnancer le paiement (uniquement via télépaiement) des
      cotisations pour le compte de ces derniers.
    </p>
    <DemarcheDescriptionCommon />
  </div>
);

const target_api = 'api_declaration_auto_entrepreneur';

const ApiDeclarationAutoEntrepreneur = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api={target_api}
    DemarcheDescription={DemarcheDescription}
    contactInformation={[
      {
        email: DATA_PROVIDER_CONTACT_EMAILS.urssaf,
        label: 'Nous contacter',
        subject: 'Contact%20via%20datapass.api.gouv.fr',
      },
    ]}
  >
    <OrganisationSection />
    <DescriptionSection />
    <CadreJuridiqueSection />
    <DonneesPersonnellesSection />
    <MiseEnOeuvreSection
      MiseEnOeuvreDescription={() => null}
      initialContacts={contacts}
    />
    <PiecesJustificativesSection />
    <ContratDeLicenceSection />
  </Form>
);

ApiDeclarationAutoEntrepreneur.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

ApiDeclarationAutoEntrepreneur.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default ApiDeclarationAutoEntrepreneur;
