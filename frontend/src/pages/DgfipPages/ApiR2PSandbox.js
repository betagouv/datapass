import React from 'react';
import Form from '../../components/templates/Form';
import DescriptionSection from '../../components/organisms/form-sections/DescriptionSection';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import DonneesSection from '../../components/organisms/form-sections/DonneesSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import DemarcheSection from '../../components/organisms/form-sections/DemarcheSection';
import { additionalTermsOfUse, DonneesDescription } from './common';
import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import ÉquipeSection from '../../components/organisms/form-sections/ÉquipeSection';
import { DATA_PROVIDER_CONFIGURATIONS } from '../../config/data-provider-configurations';
import PreviousEnrollmentSection from '../../components/organisms/form-sections/PreviousEnrollmentSection';

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
      additional_content: {
        acces_etat_civil: false,
        acces_spi: false,
        acces_etat_civil_et_adresse: false,
        acces_etat_civil_restitution_spi: false,
      },
      contacts: {},
    },
  },
  ordonnateur: {
    label: 'Ordonnateur (fiabilisation des bases tiers des collectivités)',
    state: {
      intitule: 'Ordonnateur (fiabilisation des bases tiers des collectivités)',
      fondement_juridique_title:
        'Décret n° 2022-814 du 16 mai 2022 relatif aux conditions dans lesquelles les collectivités territoriales, les établissements publics qui leur sont rattachés et les établissements publics sociaux et médico-sociaux peuvent obtenir communication des éléments d’identification de leurs débiteurs en application de l’article L. 135 ZN du livre des procédures fiscales.',
      fondement_juridique_url:
        'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000045802934',
      additional_content: {
        acces_etat_civil: true,
        acces_spi: true,
        acces_etat_civil_et_adresse: true,
      },
    },
  },
  appel_api_impot_particulier: {
    label:
      'Restitution du numéro fiscal (SPI) pour appel de l’API Impôt particulier',
    state: {
      intitule:
        'Restitution du numéro fiscal (SPI) pour appel de l’API Impôt particulier',
      additional_content: {
        acces_etat_civil_restitution_spi: true,
      },
    },
  },
};

export const DataAreInAccessModes = () => (
  <>
    <p>
      Les données restituées par l’API sont dépendantes des modalités d’accès.
    </p>
  </>
);

const accessModes = [
  {
    id: 'acces_etat_civil',
    label:
      'Recherche par état civil complet - Restitution de l’état civil complet, de l’adresse et de l’identifiant fiscal (SPI)',
  },
  {
    id: 'acces_spi',
    label:
      'Recherche par identifiant fiscal (SPI) - Restitution de l’état civil complet, de l’adresse et de l’identifiant fiscal (SPI)',
  },
  {
    id: 'acces_etat_civil_et_adresse',
    label:
      'Recherche par état civil dégradé et éléments d’adresse - Restitution de l’état civil complet, de l’adresse et de l’identifiant fiscal (SPI)',
  },
  {
    id: 'acces_etat_civil_restitution_spi',
    label:
      'Recherche par état civil complet - Restitution de l’identifiant fiscal (SPI)',
  },
];

const target_api = 'api_r2p_sandbox';
const steps = [target_api, 'api_r2p_production'];

const ApiR2PSandbox = () => (
  <Form
    target_api={target_api}
    demarches={demarches}
    contactEmail={DATA_PROVIDER_CONFIGURATIONS[target_api]?.email}
    documentationUrl="https://api.gouv.fr/les-api/api_r2p"
  >
    <PreviousEnrollmentSection steps={steps} />
    <OrganisationSection />
    <DemarcheSection />
    <DescriptionSection />
    <DonneesSection
      DonneesDescription={DonneesDescription}
      AvailableScopesDescription={DataAreInAccessModes}
      accessModes={accessModes}
    />
    <CadreJuridiqueSection />
    <ÉquipeSection />
    <CguSection
      cguLink="/docs/cgu_api_r2p_bac_a_sable_septembre2020_v2.6.pdf"
      additionalTermsOfUse={additionalTermsOfUse}
    />
  </Form>
);

export default ApiR2PSandbox;
