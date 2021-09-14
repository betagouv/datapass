import React from 'react';
import Quote from '../../components/atoms/inputs/Quote';

export const contacts = {
  contact_metier: {
    heading: 'Contact métier',
    description: (
      <Quote>
        <p>
          Cette personne sera contactée en cas de problème fonctionnel sur votre
          service.
        </p>
      </Quote>
    ),
    family_name: '',
    given_name: '',
    email: '',
    phone_number: '',
  },
  responsable_technique: {
    heading: 'Responsable technique',
    description: (
      <Quote>
        <p>
          Cette personne recevra les accès techniques par mail et SMS. Elle sera
          contactée en cas de problème technique sur votre service. Le
          responsable technique peut être le contact technique de votre
          prestataire.
        </p>
      </Quote>
    ),
    family_name: '',
    given_name: '',
    email: '',
    phone_number: '',
    display_mobile_phone_label: true,
  },
};

export const DemarcheDescriptionCommon = () => (
  <>
    <p>
      Cette API est disponible sous condition d’habilitation par l’Urssaf, après
      analyse de votre demande et dans un délai d’une à deux semaines minimum.
      L’octroi de cette habilitation est conditionné entre-autre au respect par
      le demandeur de ses obligations fiscales et sociales et à l’adéquation du
      service proposé avec l’objet de l’API.
    </p>
    <p>
      Pour assurer le bon traitement de votre demande, nous vous invitons à
      compléter celle-ci avec des informations les plus précises et exhaustives
      possibles sur le demandeur et le service proposé.
    </p>
  </>
);
