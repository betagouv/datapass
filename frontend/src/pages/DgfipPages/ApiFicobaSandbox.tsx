import React from 'react';
import Form from '../../components/templates/Form';
import DescriptionSection from '../../components/organisms/form-sections/DescriptionSection';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import ÉquipeSection from '../../components/organisms/form-sections/ÉquipeSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import { additionalTermsOfUse } from './common';
import DonneesSection from '../../components/organisms/form-sections/DonneesSection';
import { DATA_PROVIDER_CONFIGURATIONS } from '../../config/data-provider-configurations';
import PreviousEnrollmentSection from '../../components/organisms/form-sections/PreviousEnrollmentSection';

export const scopesConfiguration = [
  {
    value: 'dgfip_ficoba_etat_civil_denomination',
    label: 'État civil ou dénomination',
  },
  {
    value: 'dgfip_ficoba_adresse',
    label: 'Adresse',
  },
  {
    value: 'dgfip_ficoba_compte',
    label: 'Désignation du compte',
    required: true,
  },
  {
    value: 'dgfip_ficoba_etablissement_bancaire',
    label: 'Établissement bancaire',
  },
  {
    value: 'dgfip_ficoba_date',
    label: 'Date',
  },
];

export const accessModes = [
  {
    id: 'acces_ficoba_iban',
    label: 'via IBAN',
  },
  {
    id: 'acces_ficoba_spi',
    label: 'via le Numéro fiscal (SPI)',
  },
  {
    id: 'acces_ficoba_siren',
    label: 'via SIREN/SIRET',
  },
  {
    id: 'acces_ficoba_personne_physique',
    label: 'via personne physique',
  },
  {
    id: 'acces_ficoba_personne_morale',
    label: 'via personne morale',
  },
];

export const DonneesDescription = () => (
  <>
    <p>
      L’API FICOBA restituant des éléments sensibles (comptes bancaires du
      titulaire et/ou du co-titulaire, éléments relatifs à l’état civil et au
      lieu de résidence du titulaire et/ou du co-titulaire) est couverte par la
      règle du secret professionnel prévue par les dispositions de l’article L.
      103 du Livre des Procédures Fiscales, car elles constituent des données
      nominatives et personnelles. Il ne peut être dérogé au secret
      professionnel que par une disposition législative spécifique.
    </p>
    <p>
      En conséquence, les informations restituées par l’API FICOBA ne peuvent
      être communiquées qu’aux personnes, organismes ou autorités bénéficiant
      d’une telle mesure et dans la limite fixée par la loi.
    </p>
    <p>
      La loi informatique et libertés définit les principes à respecter lors de
      la collecte, du traitement et de la conservation de données personnelles.
    </p>
    <p>L’article 6 précise :</p>
    <ul>
      <li>
        3° [les données] sont adéquates, pertinentes et non excessives au regard
        des finalités pour lesquelles elles sont collectées et de leurs
        traitements ultérieurs ;
      </li>
      <li>
        4° Elles sont exactes, complètes et, si nécessaire, mises à jour ; les
        mesures appropriées doivent être prises pour que les données inexactes
        ou incomplètes au regard des finalités pour lesquelles elles sont
        collectées ou traitées soient effacées ou rectifiées ;
      </li>
    </ul>
    <p>
      Nous vous remercions de sélectionner uniquement les données strictement
      nécessaires à votre téléservice.
    </p>
    <p>
      Le non-respect du principe de proportionnalité vous expose vis à vis de la
      CNIL.
    </p>
  </>
);

export const CadreJuridiqueDescription = () => (
  <>
    <p>
      L’accès au dispositif API FICOBA est soumis à deux conditions
      cumulatives :
    </p>
    <ul>
      <li>
        la ou les information(s) recherchée(s) par le fournisseur de service
        doivent être strictement nécessaires au traitement d’une demande ou dans
        l’exercice des missions du fournisseur de service justifiant l’accès
        auxdites informations ;
      </li>
      <li>
        l’accès aux informations s’inscrit en application d’un texte législatif
        ou réglementaire.
      </li>
    </ul>
    <p>
      Le fournisseur de service sollicitant le raccordement au dispositif doit
      être autorisé à demander et exploiter les données fiscales dans le cadre
      de l’exercice de ses missions.
    </p>
  </>
);

const target_api = 'api_ficoba_sandbox';
const steps = [target_api, 'api_ficoba_production'];

const ApiFicobaSandbox = () => (
  <Form
    target_api={target_api}
    contactEmail={DATA_PROVIDER_CONFIGURATIONS[target_api]?.email}
    documentationUrl="https://api.gouv.fr/les-api/api_comptes_bancaires_ficoba"
  >
    <PreviousEnrollmentSection steps={steps} />
    <OrganisationSection />
    <DescriptionSection />
    <DonneesSection
      DonneesDescription={DonneesDescription}
      scopesConfiguration={scopesConfiguration}
      accessModes={accessModes}
    />
    <CadreJuridiqueSection
      CadreJuridiqueDescription={CadreJuridiqueDescription}
    />
    <ÉquipeSection />
    <CguSection
      cguLink="/docs/cgu_api_ficoba_bac_a_sable_decembre2020_v1.1.pdf"
      additionalTermsOfUse={additionalTermsOfUse}
    />
  </Form>
);

export default ApiFicobaSandbox;
