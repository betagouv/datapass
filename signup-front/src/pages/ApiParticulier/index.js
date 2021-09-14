import React from 'react';
import PropTypes from 'prop-types';

import Form from '../../components/templates/Form';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import DemarcheSection from '../../components/organisms/form-sections/DemarcheSection';
import DescriptionSection from '../../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../../components/organisms/form-sections/DonneesSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import demarches from './demarches.json';
import ÉquipeSection from '../../components/organisms/form-sections/ÉquipeSection';

const DonneesDescription = () => (
  <>
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
      nécessaires à votre téléservice. Le non-respect du principe de
      proportionnalité vous expose vis-à-vis de la CNIL.
    </p>
  </>
);

const CadreJuridiqueDescription = () => (
  <>
    <p>
      Pour pouvoir bénéficier du raccordement à l’API Particulier, le cadre
      légal et réglementaire des fournisseurs de service doit permettre à la
      DINUM de transmettre des données personnelles à votre entité
      administrative.
    </p>
    <p>
      Dans le cas où vous représentez une collectivité, veuillez joindre la
      délibération du conseil municipal explicitant l’usage des données
      demandées.
    </p>
    <p>
      Important : à priori, vous n’avez pas de nouvelle délibération à réaliser.
      Il vous suffit de déposer la dernière délibération tarifaire qui détaille
      les barèmes de facturation des services, ou le règlement qui décrit les
      données nécessaires à une instruction.
    </p>
    <p>
      Pour en savoir plus, consultez{' '}
      <a href="https://api.gouv.fr/guides/deliberation-api-part">
        notre guide sur ce qu’est une bonne délibération
      </a>
      .
    </p>
  </>
);

const availableScopes = [
  {
    value: 'dgfip_declarant1_nom',
    label: 'Nom',
    groupTitle: 'DGFIP - État civil - déclarant 1',
  },
  {
    value: 'dgfip_declarant1_nom_naissance',
    label: 'Nom de naissance',
    groupTitle: 'DGFIP - État civil - déclarant 1',
  },
  {
    value: 'dgfip_declarant1_prenoms',
    label: 'Prénom(s)',
    groupTitle: 'DGFIP - État civil - déclarant 1',
  },
  {
    value: 'dgfip_declarant1_date_naissance',
    label: 'Date de naissance',
    groupTitle: 'DGFIP - État civil - déclarant 1',
  },
  {
    value: 'dgfip_declarant2_nom',
    label: 'Nom',
    groupTitle: 'DGFIP - État civil - déclarant 2',
  },
  {
    value: 'dgfip_declarant2_nom_naissance',
    label: 'Nom de naissance',
    groupTitle: 'DGFIP - État civil - déclarant 2',
  },
  {
    value: 'dgfip_declarant2_prenoms',
    label: 'Prénom(s)',
    groupTitle: 'DGFIP - État civil - déclarant 2',
  },
  {
    value: 'dgfip_declarant2_date_naissance',
    label: 'Date de naissance',
    groupTitle: 'DGFIP - État civil - déclarant 2',
  },
  {
    value: 'dgfip_date_recouvrement',
    label: 'Date de recouvrement',
    groupTitle: 'DGFIP - Échéances de l’avis d’imposition',
  },
  {
    value: 'dgfip_date_etablissement',
    label: "Date d'établissement",
    groupTitle: 'DGFIP - Échéances de l’avis d’imposition',
  },
  {
    value: 'dgfip_adresse_fiscale_taxation',
    label: 'Adresse',
    groupTitle: 'DGFIP - Situation du foyer fiscal',
  },
  {
    value: 'dgfip_adresse_fiscale_annee',
    label: 'Année de déclaration',
    groupTitle: 'DGFIP - Situation du foyer fiscal',
  },
  {
    value: 'dgfip_nombre_parts',
    label: 'Nombre de parts',
    groupTitle: 'DGFIP - Situation du foyer fiscal',
  },
  {
    value: 'dgfip_nombre_personnes_a_charge',
    label: 'Nombre de personnes à charge',
    groupTitle: 'DGFIP - Situation du foyer fiscal',
  },
  {
    value: 'dgfip_situation_familiale',
    label: 'Situation de famille',
    groupTitle: 'DGFIP - Situation du foyer fiscal',
    helper: '(marié, pacsé, célibataire, veuf divorcé)',
  },
  {
    value: 'dgfip_revenu_brut_global',
    label: 'Revenu brut global',
    groupTitle: 'DGFIP - Agrégats fiscaux',
  },
  {
    value: 'dgfip_revenu_imposable',
    label: 'Revenu imposable',
    groupTitle: 'DGFIP - Agrégats fiscaux',
  },
  {
    value: 'dgfip_impot_revenu_net_avant_corrections',
    label: 'Impôt sur le revenu net avant corrections',
    groupTitle: 'DGFIP - Agrégats fiscaux',
  },
  {
    value: 'dgfip_montant_impot',
    label: "Montant de l'impôt",
    groupTitle: 'DGFIP - Agrégats fiscaux',
  },
  {
    value: 'dgfip_revenu_fiscal_reference',
    label: 'Revenu fiscal de référence',
    groupTitle: 'DGFIP - Agrégats fiscaux',
  },
  {
    value: 'dgfip_annee_impot',
    label: "Année de l'impôt",
    groupTitle: 'DGFIP - Agrégats fiscaux',
  },
  {
    value: 'dgfip_annee_revenus',
    label: 'Année des revenus',
    groupTitle: 'DGFIP - Agrégats fiscaux',
  },
  {
    value: 'dgfip_erreur_correctif',
    label: 'Erreur correctif',
    groupTitle: 'DGFIP - Compléments',
    helper:
      'Indique si un correctif plus récent que l’avis recherché est disponible.',
  },
  {
    value: 'dgfip_situation_partielle',
    label: 'Situation partielle',
    groupTitle: 'DGFIP - Compléments',
    helper:
      'Dans un foyer marié ou pacsé, quand décès d’un des contribuable, affiche les données de l’avis avec l’indication « situation partielle ». Donc, il faut les références de l’autre avis pour le consulter.',
  },
  {
    value: 'cnaf_quotient_familial',
    label: 'Quotient familial',
    groupTitle: 'CNAF',
  },
  {
    value: 'cnaf_allocataires',
    label: 'Allocataires',
    groupTitle: 'CNAF',
  },
  {
    value: 'cnaf_enfants',
    label: 'Enfants',
    groupTitle: 'CNAF',
  },
  {
    value: 'cnaf_adresse',
    label: 'Adresse',
    groupTitle: 'CNAF',
  },
  {
    value: 'pole_emploi_identite',
    label: 'Identité',
    groupTitle: 'Pôle Emploi',
  },
  {
    value: 'pole_emploi_contact',
    label: 'Données de contact',
    groupTitle: 'Pôle Emploi',
  },
  {
    value: 'pole_emploi_adresse',
    label: 'Adresse',
    groupTitle: 'Pôle Emploi',
  },
  {
    value: 'pole_emploi_inscription',
    label: 'Inscription',
    groupTitle: 'Pôle Emploi',
    helper: 'Données concernant l’inscription de la personne à Pôle Emploi',
  },
];

const target_api = 'api_particulier';

const ApiParticulier = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api={target_api}
    demarches={demarches}
    contactInformation={[
      {
        email: 'contact@particulier.api.gouv.fr',
        label: 'Nous contacter',
        subject: 'Contact%20via%20datapass.api.gouv.fr',
      },
    ]}
  >
    <OrganisationSection />
    <DemarcheSection />
    <DescriptionSection />
    <DonneesSection
      availableScopes={availableScopes}
      DonneesDescription={DonneesDescription}
    />
    <CadreJuridiqueSection
      CadreJuridiqueDescription={CadreJuridiqueDescription}
    />
    <ÉquipeSection />
    <CguSection cguLink="https://api.gouv.fr/resources/CGU%20API%20Particulier.pdf" />
  </Form>
);

ApiParticulier.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

ApiParticulier.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default ApiParticulier;
