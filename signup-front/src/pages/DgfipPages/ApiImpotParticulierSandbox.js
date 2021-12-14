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
import {
  demarches as fcAvailableDemarches,
  availableScopes as fcAvailableScopes,
  CguDescription,
  DemarcheDescription,
  DonneesFootnote,
} from './api-impot-particulier-common';
import {
  contacts,
  DonneesDescription,
  SuiteDescription,
} from '../../components/organisms/form-sections/deprecated/dgfip-sections/common';
import Quote from '../../components/atoms/inputs/Quote';
import DemarcheSection from '../../components/organisms/form-sections/deprecated/DemarcheSection';
import { DATA_PROVIDER_CONTACT_EMAILS } from '../../config/data-provider-parameters';

export const CadreJuridiqueDescription = () => (
  <Quote>
    <p>
      Pour pouvoir bénéficier du raccordement à l’API Impôt particulier, le
      cadre légal et réglementaire des fournisseurs de service doit permettre à
      la DGFiP de transmettre des données fiscales à son futur partenaire
      conventionné.
    </p>
    <p>
      Conformément au Code des relations entre le public et l’administration,
      l’échange de données s’impose aux partenaires conventionnés
      (administration, collectivité, établissement bancaire…) dès lors que :
    </p>
    <ul>
      <li>
        ces données sont nécessaires au traitement d’une demande présentée par
        un usager ;
      </li>
      <li>
        le partenaire conventionné destinataire est habilité à connaître ces
        données dans le cadre de ses missions (Article L114-8 1er alinéa modifié
        par LOI n°2016-1321 du 7 octobre 2016 - art. 91 ou tout texte législatif
        ou réglementaire permettant de justifier que le partenaire ait accès aux
        données).
      </li>
    </ul>
  </Quote>
);

const target_api = 'api_impot_particulier_sandbox';
const steps = [target_api, 'api_impot_particulier_production'];

const groupTitle = 'Sélectionnez les modalités d’accès à l’API';

const availableScopes = [
  ...fcAvailableScopes,
  {
    value: 'dgfip_IndLep',
    label: 'Indicateur d’éligibilité au LEP',
    helper:
      'Actuellement, accès à l’avant-dernière année de revenus. Accès aux dernière et avant-avant-dernière années d’ici le 7 avril 2021.',
    groupTitle:
      'Éligibilité Livret d’Épargne Populaire - établissements bancaires uniquement',
  },
  {
    value: 'dgfip_acces_spi',
    label: 'via le Numéro fiscal (SPI)',
    groupTitle,
  },
  {
    value: 'dgfip_acces_etat_civil',
    label: 'via l’état civil',
    helper: 'Merci de remplir une demande de souscription à l’API R2P.',
    groupTitle,
  },
];

const demarches = {
  ...fcAvailableDemarches,
  eligibilite_lep: {
    label: 'Vérification de l’éligibilité au Livret d’épargne populaire (LEP)',
    state: {
      scopes: {
        dgfip_IndLep: true,
        dgfip_annee_n_moins_1: true,
        dgfip_annee_n_moins_2: true,
        dgfip_acces_spi: true,
        dgfip_acces_etat_civil: true,
      },
    },
  },
};

const ApiImpotParticulierSandbox = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api={target_api}
    steps={steps}
    DemarcheDescription={DemarcheDescription}
    documentationUrl="https://api.gouv.fr/les-api/impot-particulier"
    demarches={demarches}
    contactInformation={[
      {
        email: DATA_PROVIDER_CONTACT_EMAILS.dgfip,
        label: 'Nous contacter',
        subject: 'Contact%20via%20datapass.api.gouv.fr',
      },
    ]}
  >
    <OrganisationSection />
    <DemarcheSection availableScopes={availableScopes} />
    <DescriptionSection />
    <MiseEnOeuvreSection initialContacts={contacts} />
    <DonneesSection
      availableScopes={availableScopes}
      AdditionalRgpdAgreement={DgfipRgpdAgreement}
      DonneesDescription={DonneesDescription}
      DonneesFootnote={DonneesFootnote}
    />
    <CadreJuridiqueSection
      CadreJuridiqueDescription={CadreJuridiqueDescription}
    />
    <CguSection
      cguLink="/docs/cgu_api_impot_particulier_bac_a_sable_connexion_hors_fc_septembre2020_v2.6.pdf"
      CguDescription={CguDescription}
    />
    <TextSection title="" id="next-steps-description">
      <SuiteDescription />
    </TextSection>
  </Form>
);

ApiImpotParticulierSandbox.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

ApiImpotParticulierSandbox.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default ApiImpotParticulierSandbox;
