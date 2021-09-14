import React, { useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { chain, findIndex, isEmpty, uniqueId } from 'lodash';
import Contact from './Contact';
import { ScrollablePanel } from '../../../Scrollable';
import { FormContext } from '../../../../templates/Form';
import Quote from '../../../../atoms/inputs/Quote';
import { UserContext } from '../../../UserContext';

const SECTION_LABEL = 'Contacts';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

const MiseEnOeuvreSection = ({
  initialContacts = {},
  title = 'Coordonnées des référents du service',
  MiseEnOeuvreDescription = () => (
    <Quote>
      <p>
        Afin de fluidifier la suite de votre demande merci de renseigner les
        informations suivantes.
      </p>
    </Quote>
  ),
}) => {
  const {
    isUserEnrollmentLoading,
    disabled,
    onChange,
    enrollment: { team_members = [] },
  } = useContext(FormContext);

  const { user } = useContext(UserContext);

  const contactConfiguration = useMemo(() => {
    let res = { demandeur: {} };
    if (isEmpty(initialContacts)) {
      res['responsable_technique'] = {
        heading: 'Responsable technique',
        description: (
          <Quote>
            <p>
              Cette personne recevra les accès techniques par mail. Le
              responsable technique peut être le contact technique de votre
              prestataire.
            </p>
          </Quote>
        ),
        email: '',
      };
    } else {
      res = { ...res, ...initialContacts };
    }
    return res;
  }, [initialContacts]);

  useEffect(() => {
    const newTeamMembers = chain(contactConfiguration)
      .keys()
      .map((type) => {
        if (team_members.some(({ type: t }) => t === type)) {
          return null;
        }

        const id = uniqueId(`tmp_`);
        let newTeamMember = { type, tmp_id: id };
        if (type === 'demandeur') {
          newTeamMember = {
            ...newTeamMember,
            email: user.email,
            family_name: user.family_name,
            given_name: user.given_name,
            job: user.job,
            phone_number: user.phone_number,
          };
        }
        return newTeamMember;
      })
      .compact()
      .value();

    if (!isUserEnrollmentLoading && !disabled && !isEmpty(newTeamMembers)) {
      onChange({
        target: {
          name: 'team_members',
          value: [...team_members, ...newTeamMembers],
        },
      });
    }
  }, [
    contactConfiguration,
    isUserEnrollmentLoading,
    disabled,
    user,
    onChange,
    team_members,
  ]);

  if (isEmpty(contactConfiguration)) {
    return null;
  }

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>{title}</h2>
      <MiseEnOeuvreDescription />
      <div className="form__group">
        <div className="row">
          {['contact_metier', 'responsable_technique'].map(
            (type) =>
              !isEmpty(contactConfiguration[type]) &&
              team_members
                .filter(({ type: t }) => t === type)
                .map(
                  ({
                    id,
                    tmp_id,
                    given_name,
                    family_name,
                    email,
                    phone_number,
                    job,
                  }) => (
                    <Contact
                      key={id || tmp_id}
                      index={findIndex(
                        team_members,
                        ({ id: i, tmp_id: t_i }) => {
                          if (id) {
                            // if id is defined match on id field
                            return i === id;
                          }
                          if (tmp_id) {
                            // if id is not defined and tmp_id is defined
                            // match on tmp_id
                            return t_i === tmp_id;
                          }
                          return false;
                        }
                      )}
                      heading={contactConfiguration[type].heading}
                      description={contactConfiguration[type].description}
                      given_name={
                        contactConfiguration[type].given_name === ''
                          ? given_name || ''
                          : undefined
                      }
                      family_name={
                        contactConfiguration[type].family_name === ''
                          ? family_name || ''
                          : undefined
                      }
                      emailDescription={
                        contactConfiguration[type].emailDescription
                      }
                      email={
                        contactConfiguration[type].email === ''
                          ? email || ''
                          : undefined
                      }
                      emailPlaceholder={
                        contactConfiguration[type].emailPlaceholder
                      }
                      phone_number={
                        contactConfiguration[type].phone_number === ''
                          ? phone_number || ''
                          : undefined
                      }
                      job={
                        contactConfiguration[type].job === ''
                          ? job || ''
                          : undefined
                      }
                      display_mobile_phone_label={
                        contactConfiguration[type].display_mobile_phone_label
                      }
                      disabled={disabled}
                      onChange={onChange}
                    />
                  )
                )
          )}
        </div>
      </div>
    </ScrollablePanel>
  );
};

MiseEnOeuvreSection.sectionLabel = SECTION_LABEL;

const contactPropTypesShape = {
  responsable_technique: PropTypes.shape({
    heading: PropTypes.string,
    email: PropTypes.string,
    phone_number: PropTypes.string,
  }),
  contact_metier: PropTypes.shape({
    heading: PropTypes.string,
    email: PropTypes.string,
    phone_number: PropTypes.string,
  }),
};

MiseEnOeuvreSection.propTypes = {
  initialContacts: PropTypes.shape(contactPropTypesShape),
  title: PropTypes.string,
  MiseEnOeuvreDescription: PropTypes.func,
};

export default MiseEnOeuvreSection;
