import React from 'react';
import PropTypes from 'prop-types';

import TextInput from '../../../atoms/inputs/TextInput';
import EmailInput from '../../../atoms/inputs/EmailInput';
import TelInput from '../../../atoms/inputs/TelInput';
import Button from '../../../atoms/Button';
import {
  isEmailValid,
  isIndividualEmailAddress,
  isValidMobilePhoneNumber,
  isValidPhoneNumber,
} from '../../../../lib';
import SideBySideWrapper from '../../../atoms/inputs/SideBySideWrapper';
import { Card, CardHead } from '../../../molecules/Card';

export const Contact = ({
  heading,
  id,
  index,
  given_name = '',
  family_name = '',
  email = '',
  phone_number = '',
  job = '',
  displayIndividualEmailLabel = false,
  displayGroupEmailLabel = false,
  displayMobilePhoneLabel = false,
  contactByEmailOnly = false,
  displayIdForAdministrator = false,
  disabled,
  onChange,
  onDelete,
  onFillWithUserInformation,
}) => (
  <Card>
    <CardHead>
      <h3>
        {heading}
        {displayIdForAdministrator && <> (id: {id})</>}
      </h3>
      {!disabled && onDelete && (
        <Button
          title="Supprimer"
          outline
          icon="delete"
          iconRight
          onClick={() => onDelete(index)}
        >
          Supprimer
        </Button>
      )}
    </CardHead>
    {!disabled &&
      onFillWithUserInformation &&
      !given_name &&
      !family_name &&
      !email &&
      !phone_number &&
      !job && (
        <div className="form__group">
          <Button outline onClick={() => onFillWithUserInformation(index)}>
            🖐️ c’est moi : remplir avec mes info
          </Button>
        </div>
      )}

    <SideBySideWrapper>
      <TextInput
        label="Prénom"
        name={`team_members[${index}].given_name`}
        value={given_name}
        disabled={disabled}
        onChange={onChange}
        ariaLabel={`Prénom du ${heading}`}
        required
      />
      <TextInput
        label="Nom"
        name={`team_members[${index}].family_name`}
        value={family_name}
        disabled={disabled}
        onChange={onChange}
        ariaLabel={`Nom du ${heading}`}
        required
      />
    </SideBySideWrapper>
    <TextInput
      label="Poste occupé"
      name={`team_members[${index}].job`}
      value={job}
      disabled={disabled}
      onChange={onChange}
      ariaLabel={`Poste occupé par le ${heading}`}
      required
    />
    <h4>Pour joindre cette personne</h4>
    <EmailInput
      label={
        displayIndividualEmailLabel
          ? 'Email individuel et nominatif'
          : displayGroupEmailLabel
          ? 'Email générique'
          : 'Email'
      }
      name={`team_members[${index}].email`}
      value={email}
      disabled={disabled}
      onChange={onChange}
      ariaLabel={`Email du ${heading}`}
      required
    />
    {displayIndividualEmailLabel &&
      isEmailValid(email) &&
      !isIndividualEmailAddress(email) && (
        <div className="notification error">
          Merci d’utiliser un email nominatif.
        </div>
      )}
    {displayGroupEmailLabel &&
      isEmailValid(email) &&
      isIndividualEmailAddress(email) && (
        <div className="notification error">
          Merci d’utiliser une adresse email générique.
        </div>
      )}
    {!contactByEmailOnly && (
      <TelInput
        label={
          displayMobilePhoneLabel
            ? 'Numéro de téléphone mobile'
            : 'Numéro de téléphone'
        }
        name={`team_members[${index}].phone_number`}
        value={phone_number}
        disabled={disabled}
        onChange={onChange}
        ariaLabel={`Numéro de téléphone ${
          displayMobilePhoneLabel ? 'mobile ' : ''
        }du ${heading}`}
        required
      />
    )}
    {displayMobilePhoneLabel &&
      isValidPhoneNumber(phone_number) &&
      !isValidMobilePhoneNumber(phone_number) && (
        <div className="notification error">
          Ce numéro ne correspond pas à un numéro de téléphone mobile
        </div>
      )}
  </Card>
);

Contact.propTypes = {
  type: PropTypes.string,
  heading: PropTypes.string,
  link: PropTypes.string,
  nom: PropTypes.string,
  email: PropTypes.string,
  emailPlaceholder: PropTypes.string,
  phone_number: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Contact;
