import React, { useContext, useEffect } from 'react';
import RgpdContact from './RgpdContact';
import { ScrollablePanel } from '../../../Scrollable';
import { FormContext } from '../../../../templates/Form';
import TextInput from '../../../../atoms/inputs/TextInput';
import NumberInput from '../../../../atoms/inputs/NumberInput';
import { chain, findIndex, isEmpty, uniqueId } from 'lodash';
import { UserContext } from '../../../UserContext';

const SECTION_LABEL = 'Données personnelles';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

// doInitializeDemandeur should be set to true if MiseEnOeuvreSection is not used in the form.
// MiseEnOeuvreSection usually get the responsibility to initialize demandeur team_member.
const DonneesPersonnellesSection = ({
  dataRetentionPeriodHelper = '',
  doInitializeDemandeur = false,
}) => {
  const {
    isUserEnrollmentLoading,
    disabled,
    onChange,
    enrollment: {
      data_recipients = '',
      data_retention_period = '',
      data_retention_comment = '',
      team_members = [],
    },
  } = useContext(FormContext);

  const { user } = useContext(UserContext);

  useEffect(() => {
    let teamMembersTypeToInitialize = [
      'responsable_traitement',
      'delegue_protection_donnees',
    ];
    if (doInitializeDemandeur) {
      teamMembersTypeToInitialize = [
        'demandeur',
        ...teamMembersTypeToInitialize,
      ];
    }

    const newTeamMembers = chain(teamMembersTypeToInitialize)
      .map((type) => {
        const isMemberAlreadyInitialized = team_members.some(
          ({ type: t }) => t === type
        );
        if (isMemberAlreadyInitialized) {
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
    isUserEnrollmentLoading,
    disabled,
    onChange,
    team_members,
    user,
    doInitializeDemandeur,
  ]);

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>Le traitement de données à caractère personnel</h2>
      <TextInput
        label="Destinataires des données"
        helper={
          'description du service ou des personnes physiques qui consulteront' +
          ' ces données'
        }
        placeholder={
          '« agents instructeurs des demandes d’aides », « usagers des ' +
          'services publics de la ville », etc.'
        }
        meta={
          <a
            href="https://www.cnil.fr/fr/definition/destinataire"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Voir la définition CNIL du destinataire des données"
          >
            Plus d’infos
          </a>
        }
        name="data_recipients"
        value={data_recipients}
        disabled={disabled}
        onChange={onChange}
      />
      <NumberInput
        label="Durée de conservation des données en mois"
        helper={dataRetentionPeriodHelper}
        name="data_retention_period"
        value={data_retention_period}
        disabled={disabled}
        onChange={onChange}
      />
      {data_retention_period > 36 && (
        <>
          <div className="form__group">
            <div className="notification warning">
              Cette durée excède la durée communément constatée (36 mois).
            </div>
          </div>
          <TextInput
            label="Veuillez justifier cette durée dans le champ ci-après :"
            name="data_retention_comment"
            value={data_retention_comment}
            disabled={disabled}
            onChange={onChange}
          />
        </>
      )}
      <div className="form__group">
        <div className="row">
          {['responsable_traitement', 'delegue_protection_donnees'].map(
            (type) =>
              team_members
                .filter(({ type: t }) => t === type)
                .map(({ id, tmp_id, family_name, email, phone_number }) => (
                  <RgpdContact
                    key={id || tmp_id}
                    index={findIndex(team_members, ({ id: i, tmp_id: t_i }) => {
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
                    })}
                    type={type}
                    family_name={family_name || ''}
                    email={email || ''}
                    phone_number={phone_number || ''}
                    disabled={disabled}
                    onChange={onChange}
                  />
                ))
          )}
        </div>
      </div>
    </ScrollablePanel>
  );
};

DonneesPersonnellesSection.sectionLabel = SECTION_LABEL;

export default DonneesPersonnellesSection;
