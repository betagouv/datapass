import React from 'react';
import PropTypes from 'prop-types';

import Form from '../../components/templates/Form';
import DgfipRgpdAgreement from '../../components/organisms/form-sections/deprecated/DonneesSection/DgfipRgpdAgreement';
import TextSection from '../../components/organisms/form-sections/TextSection';
import DescriptionSection from '../../components/organisms/form-sections/deprecated/DescriptionSection';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import DonneesSection from '../../components/organisms/form-sections/deprecated/DonneesSection';
import CguSection from '../../components/organisms/form-sections/deprecated/CguSection';
import MiseEnOeuvreSection from '../../components/organisms/form-sections/deprecated/MiseEnOeuvreSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/deprecated/CadreJuridiqueSection';
import DemarcheSection from '../../components/organisms/form-sections/deprecated/DemarcheSection';
import {
  contacts,
  DonneesDescription,
  SuiteDescription,
} from '../../components/organisms/form-sections/deprecated/dgfip-sections/common';
import { DATA_PROVIDER_CONTACT_EMAILS } from '../../config/data-provider-emails';

DgfipRgpdAgreement.propTypes = {
  additional_content: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

const availableScopes = [
  {
    value: 'dgfip_acces_etat_civil',
    label:
      'Recherche par état civil complet - Restitution de l’état civil complet, de l’adresse et de l’identifiant fiscal (SPI)',
  },
  {
    value: 'dgfip_acces_spi',
    label:
      'Recherche par identifiant fiscal (SPI) - Restitution de l’état civil complet, de l’adresse et de l’identifiant fiscal (SPI)',
  },
  {
    value: 'dgfip_acces_etat_civil_et_adresse',
    label:
      'Recherche par état civil dégradé et éléments d’adresse - Restitution de l’état civil complet, de l’adresse et de l’identifiant fiscal (SPI)',
  },
  {
    value: 'dgfip_acces_etat_civil_restitution_spi',
    label:
      'Recherche par état civil complet - Restitution de l’identifiant fiscal (SPI)',
  },
];

const demarches = {
  default: {
    label: 'Demande Libre',
    state: {
      intitule: '',
      description: '',
      data_recipients: '',
      data_retention_period: '',
      fondement_juridique_title: '',
      fondement_juridique_url: '',
      scopes: {
        dgfip_acces_etat_civil: false,
        dgfip_acces_spi: false,
        dgfip_acces_etat_civil_et_adresse: false,
        dgfip_acces_etat_civil_restitution_spi: false,
      },
      contacts: {},
    },
  },
  ordonnateur: {
    label: 'Ordonnateur (fiabilisation des bases tiers des collectivités)',
    state: {
      scopes: {
        dgfip_acces_etat_civil: true,
        dgfip_acces_spi: true,
        dgfip_acces_etat_civil_et_adresse: true,
      },
    },
  },
  appel_api_impot_particulier: {
    label:
      'Restitution du numéro fiscal (SPI) pour appel de l’API Impôt particulier',
    state: {
      scopes: {
        dgfip_acces_etat_civil_restitution_spi: true,
      },
    },
  },
};

const target_api = 'api_r2p_sandbox';
const steps = [target_api, 'api_r2p_production'];

const ApiR2PSandbox = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api={target_api}
    steps={steps}
    demarches={demarches}
    documentationUrl="https://api.gouv.fr/les-api/api_r2p"
    contactInformation={[
      {
        email: DATA_PROVIDER_CONTACT_EMAILS.dgfip,
        label: 'Nous contacter',
        subject: 'Contact%20via%20datapass.api.gouv.fr',
      },
    ]}
  >
    <OrganisationSection />
    <DemarcheSection />
    <DescriptionSection />
    <MiseEnOeuvreSection initialContacts={contacts} />
    <DonneesSection
      availableScopes={availableScopes}
      scopesLabel="Liste des données restituées en fonction des modalités d’accès :"
      AdditionalRgpdAgreement={DgfipRgpdAgreement}
      DonneesDescription={DonneesDescription}
    />
    <CadreJuridiqueSection />
    <CguSection cguLink="/docs/cgu_api_r2p_bac_a_sable_septembre2020_v2.6.pdf" />
    <TextSection title="" id="next-steps-description">
      <SuiteDescription />
    </TextSection>
  </Form>
);

ApiR2PSandbox.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

ApiR2PSandbox.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default ApiR2PSandbox;
