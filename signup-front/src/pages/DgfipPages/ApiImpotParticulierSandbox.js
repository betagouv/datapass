import React from 'react';
import PropTypes from 'prop-types';

import Form from '../../components/templates/Form';
import DescriptionSection from '../../components/organisms/form-sections/DescriptionSection';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import DemarcheSection from '../../components/organisms/form-sections/DemarcheSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import ÉquipeSection from '../../components/organisms/form-sections/ÉquipeSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import HasNextEnrollmentsNotification from '../../components/templates/Form/HasNextEnrollmentsNotification';
import { additionalTermsOfUse } from './common';
import {
  demarches as fcAvailableDemarches,
  availableScopes as fcAvailableScopes,
  DonneesDescription,
} from './api-impot-particulier-common';
import DonneesSection from '../../components/organisms/form-sections/DonneesSection';
import { DATA_PROVIDER_CONTACT_EMAILS } from '../../config/data-provider-parameters';

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
];

const accessModes = [
  {
    id: 'acces_spi',
    label: 'via le Numéro fiscal (SPI)',
  },
  {
    id: 'acces_etat_civil',
    label: 'via l’état civil',
  },
];

export const CadreJuridiqueDescription = () => (
  <>
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
  </>
);

const target_api = 'api_impot_particulier_sandbox';
const steps = [target_api, 'api_impot_particulier_production'];

const ApiImpotParticulierSandbox = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api={target_api}
    steps={steps}
    demarches={demarches}
    contactEmail={DATA_PROVIDER_CONTACT_EMAILS.dgfip}
    documentationUrl="https://api.gouv.fr/les-api/impot-particulier"
  >
    <HasNextEnrollmentsNotification enrollmentId={enrollmentId} />
    <OrganisationSection />
    <DemarcheSection availableScopes={availableScopes} />
    <DescriptionSection />
    <DonneesSection
      DonneesDescription={DonneesDescription}
      availableScopes={availableScopes}
      accessModes={accessModes}
      enableFileSubmissionForScopeSelection={true}
    />
    <CadreJuridiqueSection
      CadreJuridiqueDescription={CadreJuridiqueDescription}
    />
    <ÉquipeSection />
    <CguSection
      cguLink="/docs/cgu_api_impot_particulier_bac_a_sable_connexion_hors_fc_septembre2020_v2.6.pdf"
      additionalTermsOfUse={additionalTermsOfUse}
    />
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
