import React from 'react';
import PropTypes from 'prop-types';

import Form from '../../components/templates/Form';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import DemarcheSection from '../../components/organisms/form-sections/deprecated/DemarcheSection';
import DescriptionSection from '../../components/organisms/form-sections/deprecated/DescriptionSection';
import DonneesSection from '../../components/organisms/form-sections/deprecated/DonneesSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/deprecated/CadreJuridiqueSection';
import CguSection from '../../components/organisms/form-sections/deprecated/CguSection';
import DonneesPersonnellesSection from '../../components/organisms/form-sections/deprecated/DonneesPersonnellesSection';
import MiseEnOeuvreSection from '../../components/organisms/form-sections/deprecated/MiseEnOeuvreSection';
import demarches from './demarches.json';
import Quote from '../../components/atoms/inputs/Quote';
import Helper from '../../components/atoms/Helper';

const DemarcheDescription = () => (
  <div className="notification grey">
    <p>
      L’API Statut étudiant simplifie les démarches administratives des
      collectivités et administrations fournisseurs de services aux étudiants.
      Il permet de disposer d’informations sur le statut étudiant des usagers
      dans le cadre de l’obtention d’un service proposé par votre administration
      ou votre entreprise ayant délégation de service public.
    </p>
  </div>
);

const CadreJuridiqueDescription = () => (
  <Quote>
    <p>
      Pour pouvoir bénéficier du raccordement à l’API Statut étudiant, le cadre
      légal et réglementaire des fournisseurs de service doit permettre à la
      DINUM de transmettre des données personnelles à votre entité
      administrative. Dans le cas où vous représentez une collectivité, veuillez
      joindre la délibération du conseil municipal explicitant l’usage des
      données demandées.
    </p>
  </Quote>
);

const contacts = {
  responsable_technique: {
    heading: 'Responsable technique',
    description: (
      <Quote>
        <p>
          Cette personne recevra les accès techniques par mail. Elle sera
          contactée en cas de problème technique sur votre service. Le
          responsable technique peut être le contact technique de votre
          prestataire.
        </p>
      </Quote>
    ),
    email: '',
    phone_number: '',
  },
};

const inscriptionHelper = (
  <Helper
    title={
      'Étudiant inscrit dans une formation de l’enseignement supérieur, et qui s’est acquitté du montant des droits d’inscription ou en a été exonéré.'
    }
  />
);

const availableScopes = [
  {
    value: 'ine',
    label:
      'Identifiant national de l’étudiant-INE (réservé aux administrations du secteur de l’éducation)',
  },
  {
    value: 'identite',
    label: 'Données d’identité',
  },
  {
    value: 'etablissement',
    label: 'Données territoriales (lieu d’inscription, établissement)',
  },
  {
    value: 'admission',
    label: 'Données d’admission (inscription en cours)',
    helper:
      'Étudiant inscrit dans une formation de l’enseignement supérieur, et qui ne s’est pas encore acquitté du montant des droits d’inscription.',
  },
  {
    value: 'inscription_statut_etudiant',
    label: (
      <>
        Données d’inscription{inscriptionHelper}sous statut étudiant en
        formation initiale ou sous contrat d’apprenti
      </>
    ),
  },
  {
    value: 'inscription_autre_statuts',
    label: (
      <>
        Données d’inscription{inscriptionHelper}autres statuts (stagiaire
        formation continue ou contrat de professionnalisation)
      </>
    ),
  },
];

const ApiStatutEtudiant = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api="api_statut_etudiant"
    DemarcheDescription={DemarcheDescription}
    demarches={demarches}
  >
    <OrganisationSection />
    <DemarcheSection />
    <DescriptionSection />
    <DonneesSection availableScopes={availableScopes} />
    <CadreJuridiqueSection
      CadreJuridiqueDescription={CadreJuridiqueDescription}
    />
    <DonneesPersonnellesSection />
    <MiseEnOeuvreSection initialContacts={contacts} />
    <CguSection cguLink="" />
  </Form>
);

ApiStatutEtudiant.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

ApiStatutEtudiant.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default ApiStatutEtudiant;
