import React from 'react';
import PropTypes from 'prop-types';

import Form from '../../components/templates/Form';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import DescriptionSection from '../../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../../components/organisms/form-sections/DonneesSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import ÉquipeSection from '../../components/organisms/form-sections/ÉquipeSection';
import PiecesJustificativesSection from '../../components/organisms/form-sections/urssaf-sections/PiecesJustificativesSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import { DATA_PROVIDER_CONTACT_EMAILS } from '../../config/data-provider-parameters';
import { getDefaultDocumentationUrl } from '../../components/organisms/Nav';

const target_api = 'api_tiers_de_prestation';

const availableScopes = [
  {
    value: 'id_client',
    label: 'Identifiant du client du tiers de prestation',
    mandatory: true,
  },
  {
    value: 'id_demande_paiement',
    label: 'Identifiant de la demande de paiement',
    mandatory: true,
  },
  {
    value: 'demande_paiement',
    label: 'Informations sur la demande de paiement (montant, acompte, ...)',
    mandatory: true,
  },
  {
    value: 'num_facture_tiers',
    label: 'Numéro de la facture',
    mandatory: true,
  },
  {
    value: 'statut',
    label: 'Statut de la demande de paiement',
    mandatory: true,
  },
  {
    value: 'info_rejet',
    label:
      'Dans le cadre d’un rejet, les informations complémentaires sur le rejet',
    mandatory: true,
  },
  {
    value: 'info_virement',
    label:
      'Contient des informations complémentaires sur le virement lors que cela est disponible',
    mandatory: true,
  },
];

const CadreJuridiqueDescription = () => (
  <p>
    L’Urssaf concède à titre gratuit au demandeur et sur condition d’octroi de
    l’habilitation, une licence d’utilisation non exclusive du présent service.
  </p>
);

const ApiTiersDePrestation = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api={target_api}
    contactEmail={DATA_PROVIDER_CONTACT_EMAILS.urssaf}
    documentationUrl={getDefaultDocumentationUrl(target_api)}
  >
    <OrganisationSection />
    <DescriptionSection />
    <DonneesSection availableScopes={availableScopes} />
    <CadreJuridiqueSection
      CadreJuridiqueDescription={CadreJuridiqueDescription}
      defaultFondementJuridiqueTitle="Contrat de licence"
      defaultFondementJuridiqueUrl="non applicable"
    />
    <ÉquipeSection responsableTechniqueNeedsMobilePhone={true} />
    <PiecesJustificativesSection />
    <CguSection cguLink="/docs/cgu_api_tiers_de_prestation_v1.pdf" />
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
