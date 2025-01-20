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
import DemarcheSection from '../../components/organisms/form-sections/DemarcheSection';

export const scopesConfiguration = [
  {
    value: 'dgfip_ficoba_etat_civil_denomination',
    label: 'État civil / Raison sociale du titulaire du compte',
  },
  {
    value: 'dgfip_ficoba_adresse',
    label: 'Adresse',
  },
  {
    value: 'dgfip_ficoba_compte',
    label: 'Numéro du compte ouvert et caractéristiques',
  },
  {
    value: 'dgfip_ficoba_etablissement_bancaire',
    label: 'Etablissement / Guichet bancaire / Adresse',
  },
  {
    value: 'dgfip_ficoba_date',
    label: 'Droit sur le compte et date effective',
  },
  {
    value: 'dgfip_ficoba_restitution_verification',
    label: 'Restitution vérification (O/N) et date de clôture le cas échéant',
  },
  {
    value: 'dgfip_ficoba_nombre_comptes',
    label: 'Nombre de comptes trouvés',
  },
  {
    value: 'dgfip_ficoba_iban',
    label: 'IBAN',
  },
  {
    value: 'dgfip_ficoba_date_ouverture',
    label: 'Date dʼouverture',
  },
  {
    value: 'dgfip_ficoba_motif_ouverture',
    label: 'Motif dʼouverture',
  },
];

export const groups = {
  information: {
    label: 'Informations compte',
    scopes: [
      'dgfip_ficoba_etat_civil_denomination',
      'dgfip_ficoba_adresse',
      'dgfip_ficoba_compte',
      'dgfip_ficoba_etablissement_bancaire',
      'dgfip_ficoba_date',
      'dgfip_ficoba_restitution_verification',
    ],
  },
  controle_multi_detention_per: {
    label: 'Contrôles multi-détention PER',
    scopes: [
      'dgfip_ficoba_nombre_comptes',
      'dgfip_ficoba_iban',
      'dgfip_ficoba_date_ouverture',
      'dgfip_ficoba_motif_ouverture',
    ],
  },
};

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
    label: 'via lʼétat civil - personne physique',
  },
  {
    id: 'acces_ficoba_personne_morale',
    label: 'via la raison sociale - personne morale',
  },
  {
    id: 'acces_ficoba_adresse',
    label: 'via lʼadresse',
  },
  {
    id: 'acces_ficoba_iban_siren',
    label: 'via IBAN + SIREN/SIRET',
  },
  {
    id: 'acces_ficoba_iban_personne_physique',
    label: 'via IBAN + état civil - personne physique',
  },
  {
    id: 'acces_ficoba_iban_personne_morale',
    label: 'via IBAN + raison sociale - personne morale',
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
    <p>L’article 4 précise :</p>
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
      groups={groups}
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
