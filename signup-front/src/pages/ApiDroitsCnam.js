import React from 'react';
import PropTypes from 'prop-types';

import Form from '../components/templates/Form';
import OrganisationSection from '../components/organisms/form-sections/OrganisationSection';
import DescriptionSection from '../components/organisms/form-sections/deprecated/DescriptionSection';
import CadreJuridiqueSection from '../components/organisms/form-sections/deprecated/CadreJuridiqueSection';
import DonneesPersonnellesSection from '../components/organisms/form-sections/deprecated/DonneesPersonnellesSection';
import MiseEnOeuvreSection from '../components/organisms/form-sections/deprecated/MiseEnOeuvreSection';
import CguSection from '../components/organisms/form-sections/deprecated/CguSection';
import DonneesSection from '../components/organisms/form-sections/deprecated/DonneesSection';

const DemarcheDescription = () => (
  <div className="notification grey">
    <p>
      Dans le cadre du programme « Dites-le nous une fois », visant à simplifier
      les démarches administratives des usagers, l’API Droits CNAM permet de
      récupérer des informations d’assurance maladie des usagers de façon à leur
      éviter la transmission d’information papier.
    </p>
    <p>
      Ce portail permet de faciliter le raccordement du téléservice des
      fournisseurs de service à l’API Droits CNAM.
    </p>
    <p>
      Pour faciliter votre raccordement à l’API Droits CNAM, une{' '}
      <a
        href="https://github.com/assurance-maladie-digital/api-droits-fs-exemple-php"
        target="_blank"
        rel="noopener noreferrer"
      >
        API de test
      </a>{' '}
      est à votre disposition.
    </p>
  </div>
);

const availableScopes = [
  {
    value: 'cnam_beneficiaires',
    label: 'Liste des ayant-droits',
  },
  {
    value: 'cnam_contrats',
    label: 'Droits de base',
  },
  {
    value: 'cnam_caisse',
    label: 'Caisse gestionnaire',
  },
  {
    value: 'cnam_exonerations',
    label: 'Exonérations ou modulations éventuelles',
  },
  {
    value: 'cnam_medecin_traitant',
    label: 'Médecin traitant',
  },
  {
    value: 'cnam_presence_medecin_traitant',
    label: 'Présence d’un médecin traitant',
  },
];

const useCases = [
  {
    label: 'Établissement de soin',
    scopes: [
      'cnam_beneficiaires',
      'cnam_caisse',
      'cnam_contrats',
      'cnam_exonerations',
      'cnam_medecin_traitant',
    ],
  },
  {
    label: 'Organisme complémentaire',
    scopes: [
      'cnam_beneficiaires',
      'cnam_caisse',
      'cnam_contrats',
      'cnam_presence_medecin_traitant',
    ],
  },
];

const steps = ['franceconnect', 'api_droits_cnam'];

const ApiDroitsCnam = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api="api_droits_cnam"
    steps={steps}
    DemarcheDescription={DemarcheDescription}
    documentationUrl="https://api.gouv.fr/les-api/api_ameli_droits_cnam"
  >
    <OrganisationSection />
    <DescriptionSection />
    <DonneesSection availableScopes={availableScopes} useCases={useCases} />
    <CadreJuridiqueSection />
    <DonneesPersonnellesSection />
    <MiseEnOeuvreSection />
    <CguSection cguLink="/docs/API_Droits_CNAM_CGU_20181210.pdf" />
  </Form>
);

ApiDroitsCnam.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

ApiDroitsCnam.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default ApiDroitsCnam;
