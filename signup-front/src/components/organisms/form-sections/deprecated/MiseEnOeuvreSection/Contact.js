import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import TextInput from '../../../../atoms/inputs/TextInput';
import EmailInput from '../../../../atoms/inputs/EmailInput';
import TelInput from '../../../../atoms/inputs/TelInput';
import { withUser } from '../../../UserContext';
import FrontHandIcon from '../../../../atoms/icons/front-hand';
import Button from '../../../../atoms/Button';
import SideBySideWrapper from '../../../../atoms/inputs/SideBySideWrapper';

export const Contact = ({
  index,
  heading,
  description,
  given_name,
  family_name,
  emailDescription,
  email,
  emailPlaceholder = '',
  phone_number,
  job,
  display_mobile_phone_label = false,
  disabled,
  onChange,
  user = {},
}) => {
  const fillWithUserInformation = useCallback(() => {
    onChange({
      target: { name: `team_members[${index}].email`, value: user.email },
    });
    if (
      typeof given_name !== 'undefined' &&
      typeof family_name !== 'undefined'
    ) {
      onChange({
        target: {
          name: `team_members[${index}].given_name`,
          value: user.given_name,
        },
      });
      onChange({
        target: {
          name: `team_members[${index}].family_name`,
          value: user.family_name,
        },
      });
    }
    if (typeof phone_number !== 'undefined') {
      onChange({
        target: {
          name: `team_members[${index}].phone_number`,
          value: user.phone_number,
        },
      });
    }
    if (typeof job !== 'undefined') {
      onChange({
        target: { name: `team_members[${index}].job`, value: user.job },
      });
    }
  }, [
    family_name,
    given_name,
    index,
    job,
    onChange,
    phone_number,
    user.email,
    user.family_name,
    user.given_name,
    user.job,
    user.phone_number,
  ]);

  return (
    <div className="card">
      <div className="card__content">
        <h3>{heading}</h3>
        {description}
        {!disabled &&
          (typeof given_name === 'undefined' ||
            typeof family_name === 'undefined' ||
            (!given_name && !family_name)) &&
          !email &&
          (typeof phone_number === 'undefined' || !phone_number) &&
          (typeof job === 'undefined' || !job) && (
            <div className="form__group">
              <Button
                outline
                onClick={fillWithUserInformation}
                style={{ justifyContent: 'center', width: '100%' }}
              >
                <div style={{ margin: '0 0.2em' }}>
                  <FrontHandIcon color="var(--bf500)" size={28} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  Je suis {(heading || '').toLowerCase()}.<br />
                  Remplir avec mes informations.
                </div>
              </Button>
            </div>
          )}
        {typeof given_name !== 'undefined' &&
          typeof family_name !== 'undefined' && (
            <SideBySideWrapper>
              <TextInput
                label="Prénom"
                name={`team_members[${index}].given_name`}
                value={given_name}
                disabled={disabled}
                onChange={onChange}
                ariaLabel={`Prénom du ${heading}`}
              />
              <TextInput
                label="Nom"
                name={`team_members[${index}].family_name`}
                value={family_name}
                disabled={disabled}
                onChange={onChange}
                ariaLabel={`Nom du ${heading}`}
              />
            </SideBySideWrapper>
          )}
        {emailDescription}
        <EmailInput
          label="Email"
          placeholder={emailPlaceholder}
          name={`team_members[${index}].email`}
          value={email}
          disabled={disabled}
          onChange={onChange}
          ariaLabel={`Email du ${heading}`}
        />
        {typeof phone_number !== 'undefined' && (
          <TelInput
            label={
              display_mobile_phone_label
                ? 'Numéro de téléphone mobile'
                : 'Numéro de téléphone'
            }
            name={`team_members[${index}].phone_number`}
            value={phone_number}
            disabled={disabled}
            onChange={onChange}
            ariaLabel={`Numéro de téléphone ${
              display_mobile_phone_label ? 'mobile ' : ''
            }du ${heading}`}
          />
        )}
        {typeof job !== 'undefined' && (
          <TextInput
            label="Intitulé de poste"
            name={`team_members[${index}].job`}
            value={job}
            disabled={disabled}
            onChange={onChange}
            ariaLabel={`Intitulé de poste du ${heading}`}
          />
        )}
      </div>
    </div>
  );
};

Contact.propTypes = {
  index: PropTypes.number,
  heading: PropTypes.string,
  link: PropTypes.string,
  nom: PropTypes.string,
  email: PropTypes.string,
  emailPlaceholder: PropTypes.string,
  phone_number: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default withUser(Contact);
