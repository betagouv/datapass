import React from 'react';
import Form from '../../components/templates/Form';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import DescriptionSection from '../../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../../components/organisms/form-sections/DonneesSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import ÉquipeSection from '../../components/organisms/form-sections/ÉquipeSection';
import PiecesJustificativesSection from '../../components/organisms/form-sections/urssaf-sections/PiecesJustificativesSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import { DATA_PROVIDER_CONFIGURATIONS } from '../../config/data-provider-configurations';
import { getDefaultDocumentationUrl } from '../../components/organisms/Nav';

const target_api = 'api_tiers_de_prestation';

const scopesConfiguration = [
  {
    value: 'id_client',
    label: 'Identifiant du client du tiers de prestation',
    required: true,
  },
  {
    value: 'id_demande_paiement',
    label: 'Identifiant de la demande de paiement',
    required: true,
  },
  {
    value: 'demande_paiement',
    label: 'Informations sur la demande de paiement (montant, acompte, ...)',
    required: true,
  },
  {
    value: 'num_facture_tiers',
    label: 'Numéro de la facture',
    required: true,
  },
  {
    value: 'statut',
    label: 'Statut de la demande de paiement',
    required: true,
  },
  {
    value: 'info_rejet',
    label:
      'Dans le cadre d’un rejet, les informations complémentaires sur le rejet',
    required: true,
  },
  {
    value: 'info_virement',
    label:
      'Contient des informations complémentaires sur le virement lors que cela est disponible',
    required: true,
  },
];

const CadreJuridiqueDescription = () => (
  <p>
    L’Urssaf concède à titre gratuit au demandeur et sur condition d’octroi de
    l’habilitation, une licence d’utilisation non exclusive du présent service.
  </p>
);

const initialContacts = {
  comptable: {
    header: 'Contact comptable',
    description: (
      <>
        <b>Le contact comptable</b> sera contacté pour tous les échanges
        relatifs aux différents versements.
      </>
    ),
  },
};

const ApiTiersDePrestation = () => (
  <Form
    target_api={target_api}
    contactEmail={DATA_PROVIDER_CONFIGURATIONS[target_api]?.email}
    documentationUrl={getDefaultDocumentationUrl(target_api)}
  >
    <OrganisationSection />
    <DescriptionSection />
    <DonneesSection scopesConfiguration={scopesConfiguration} />
    <CadreJuridiqueSection
      CadreJuridiqueDescription={CadreJuridiqueDescription}
      defaultFondementJuridiqueTitle="Contrat de licence"
      defaultFondementJuridiqueUrl="non applicable"
    />
    <ÉquipeSection
      initialContacts={initialContacts}
      responsableTechniqueNeedsMobilePhone={true}
    />
    <PiecesJustificativesSection />
    <CguSection cguLink="/docs/cgu_api_tiers_de_prestation_v1_3.pdf" />
  </Form>
);

export default ApiTiersDePrestation;
