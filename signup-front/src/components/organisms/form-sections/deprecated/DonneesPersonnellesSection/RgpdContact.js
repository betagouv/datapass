import React from 'react';
import PropTypes from 'prop-types';
import Quote from '../../../../atoms/inputs/Quote';
import TextInput from '../../../../atoms/inputs/TextInput';
import TelInput from '../../../../atoms/inputs/TelInput';

const descriptions = {
  responsable_traitement: {
    heading: 'Responsable de traitement',
    hint: (
      <p>
        Le responsable du traitement des données est la personne physique ou
        morale qui, seul ou conjointement avec d’autres, détermine les finalités
        et les moyens du traitement des données à caractère personnel. Seule une
        personne appartenant à l’organisme demandeur peut être renseignée. (
        <a
          href={'https://www.cnil.fr/fr/definition/responsable-de-traitement'}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Voir la définition CNIL du responsable de traitement"
        >
          plus d’infos
        </a>
        )
      </p>
    ),
  },
  delegue_protection_donnees: {
    heading: 'Délégué à la protection des données',
    hint: (
      <p>
        C'est la personne qui s’assure que l’organisation protège convenablement
        les données à caractère personnel, conformément à la législation en
        vigueur. C'est généralement une personne appartenant à l’organisme
        demandeur. (
        <a
          href={'https://www.cnil.fr/fr/designation-dpo'}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Voir la définition CNIL du délégué à la protection des données"
        >
          plus d’infos
        </a>
        )
      </p>
    ),
  },
};

const RgpdContact = ({
  index,
  type,
  family_name,
  email,
  phone_number,
  disabled,
  onChange,
}) => (
  <div className="card">
    <div className="card__content">
      <h3>{descriptions[type].heading}</h3>
      <Quote>{descriptions[type].hint}</Quote>
      <TextInput
        label="Nom et Prénom"
        meta={
          type === 'responsable_traitement' &&
          'Cette information peut être rendue publique.'
        }
        name={`team_members[${index}].family_name`}
        value={family_name}
        disabled={disabled}
        onChange={onChange}
        ariaLabel={`Nom et Prénom du ${descriptions[type].heading}`}
      />
      <TextInput
        label="Email"
        meta={
          <>
            Une notification sera envoyée à cette adresse à la validation de la
            demande.
          </>
        }
        name={`team_members[${index}].email`}
        value={email}
        disabled={disabled}
        onChange={onChange}
        ariaLabel={`Email du ${descriptions[type].heading}`}
      />
      <TelInput
        label="Numéro de téléphone"
        helper={
          'Ce numéro peut être le numéro du secrétariat ou le numéro direct de la personne concernée. Ce numéro nous ' +
          'permettra de vous contacter lors d’incidents ou difficultés.'
        }
        name={`team_members[${index}].phone_number`}
        value={phone_number}
        disabled={disabled}
        onChange={onChange}
        ariaLabel={`Numéro de téléphone du ${descriptions[type].heading}`}
      />
    </div>
  </div>
);

RgpdContact.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  email: PropTypes.string,
  phone_number: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default RgpdContact;
