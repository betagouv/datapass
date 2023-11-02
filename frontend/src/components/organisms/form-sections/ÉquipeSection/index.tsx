import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { chain, findIndex, isEmpty, uniqueId } from 'lodash';
import Contact from './Contact';
import { ScrollablePanel } from '../../Scrollable';
import { FormContext } from '../../../templates/Form';
import ExpandableQuote from '../../../molecules/ExpandableQuote';
import { useAuth } from '../../AuthContext';
import useNewTeamMembers from './useNewTeamMembers';
import { AddCard, CardContainer } from '../../../molecules/Card';
import Link from '../../../atoms/hyperTexts/Link';
import { TeamMember, TeamMemberType, User } from '../../../../config';

const SECTION_LABEL = 'Les personnes impliquées';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

export type ContactConfigurationType = {
  [k in TeamMemberType]?: {
    header?: string;
    description?: React.ReactNode;
    forceDisable?: boolean;
    displayMobilePhoneLabel?: boolean;
    displayIndividualEmailLabel?: boolean;
    displayGroupEmailLabel?: boolean;
    contactByEmailOnly?: boolean;
    multiple?: boolean;
  };
};

export const getDefaultDemandeurDescription = () => (
  <>
    <b>Le demandeur</b>, c'est vous, dépose la demande d’habilitation et sera
    contacté en cas de problème fonctionnel sur votre service.
  </>
);

export const getDefaultResponsableTraitementDescription = () => (
  <>
    <b>Le responsable du traitement des données</b> est la personne physique ou
    morale qui, seule ou conjointement avec d’autres, détermine les finalités et
    les moyens du traitement des données à caractère personnel. Seule une
    personne appartenant à l’organisme demandeur peut être renseignée. Cette
    personne sera notifiée par email à la validation de l’habilitation. Ses nom
    et prénom peuvent également être rendus publics.{' '}
    <Link
      inline
      newTab
      href={'https://www.cnil.fr/fr/definition/responsable-de-traitement'}
      aria-label="Voir la définition CNIL du responsable de traitement"
    >
      Plus d’infos
    </Link>
    .
  </>
);

export const getDefaultDelegueProtectionDonneesDescription = () => (
  <>
    <b>Le délégué à la protection des données</b> assure que l’organisation
    protège convenablement les données à caractère personnel, conformément à la
    législation en vigueur. C'est généralement une personne appartenant à
    l’organisme demandeur. Cette personne sera notifiée par email à la
    validation de l’habilitation.{' '}
    <Link
      inline
      newTab
      href={'https://www.cnil.fr/fr/designation-dpo'}
      aria-label="Voir la définition CNIL du délégué à la protection des données"
    >
      Plus d’infos
    </Link>
    .
  </>
);

export const getDefaultResponsableTechniqueDescription = (
  useMobilePhone = false
) => (
  <>
    <b>Le responsable technique</b> recevra les accès techniques par mail
    (attention, ce courrier peut parfois passer en « courriers indésirables »).{' '}
    {useMobilePhone && (
      <>
        Le numéro de téléphone doit être un numéro de téléphone mobile. Il sera
        utilisé pour envoyer un code d’accès.
      </>
    )}{' '}
    Cette personne sera contactée en cas de problème technique sur votre
    service. Le responsable technique peut être le contact technique de votre
    prestataire.
  </>
);

const ÉquipeSection = ({
  initialContacts = {},
  responsableTechniqueNeedsMobilePhone = false,
}) => {
  const {
    isUserEnrollmentLoading,
    disabled,
    onChange,
    enrollment: { team_members = [] },
  } = useContext(FormContext)!;
  const { user } = useAuth();
  const contactConfiguration: ContactConfigurationType = useMemo(() => {
    const defaultInitialContacts: ContactConfigurationType = {
      [TeamMemberType.demandeur]: {
        header: 'Demandeur',
        description: getDefaultDemandeurDescription(),
        forceDisable: true,
      },
      [TeamMemberType.responsable_traitement]: {
        header: 'Responsable de traitement',
        description: getDefaultResponsableTraitementDescription(),
      },
      [TeamMemberType.delegue_protection_donnees]: {
        header: 'Délégué à la protection des données',
        description: getDefaultDelegueProtectionDonneesDescription(),
      },
      [TeamMemberType.responsable_technique]: {
        header: 'Responsable technique',
        description: getDefaultResponsableTechniqueDescription(
          responsableTechniqueNeedsMobilePhone
        ),
        displayMobilePhoneLabel: responsableTechniqueNeedsMobilePhone,
      },
    };

    return chain(defaultInitialContacts)
      .assign(initialContacts)
      .omitBy((p) => !p)
      .value();
  }, [initialContacts, responsableTechniqueNeedsMobilePhone]);

  const newTeamMembers = useNewTeamMembers({
    user: user as User,
    team_members,
    contactConfiguration,
  });

  useEffect(() => {
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
    newTeamMembers,
  ]);

  const displayIdForAdministrator = useMemo(
    () => user && user?.roles?.includes('administrator'),
    [user]
  );

  const updateWithUserInformation = useCallback(
    (index: number) => {
      if (team_members[index]?.email !== user?.email) {
        onChange({
          target: {
            name: `team_members[${index}].email`,
            value: user?.email,
          },
        });
      }
      if (team_members[index]?.given_name !== user?.given_name) {
        onChange({
          target: {
            name: `team_members[${index}].given_name`,
            value: user?.given_name,
          },
        });
      }
      if (team_members[index]?.family_name !== user?.family_name) {
        onChange({
          target: {
            name: `team_members[${index}].family_name`,
            value: user?.family_name,
          },
        });
      }
      if (team_members[index]?.phone_number !== user?.phone_number) {
        onChange({
          target: {
            name: `team_members[${index}].phone_number`,
            value: user?.phone_number,
          },
        });
      }
      if (team_members[index]?.job !== user?.job) {
        onChange({
          target: {
            name: `team_members[${index}].job`,
            value: user?.job,
          },
        });
      }
    },
    [team_members, user, onChange]
  );

  useEffect(() => {
    if (!isUserEnrollmentLoading && !disabled && !isEmpty(team_members)) {
      const currentDemandeurIndex = team_members.findIndex(
        ({ type, email }) => type === 'demandeur' && email === user?.email
      );

      if (currentDemandeurIndex !== -1) {
        updateWithUserInformation(currentDemandeurIndex);
      }
    }
  }, [
    isUserEnrollmentLoading,
    disabled,
    team_members,
    user,
    updateWithUserInformation,
  ]);

  const addTeamMemberFactory = (type: TeamMemberType) => {
    const tmp_id = uniqueId(`tmp_`);
    const newTeamMember = { type, tmp_id };

    return () =>
      onChange({
        target: {
          name: 'team_members',
          value: [...team_members, newTeamMember],
        },
      });
  };

  const removeTeamMember = (index: number) => {
    onChange({
      target: {
        name: 'team_members',
        value: [
          ...team_members.slice(0, index),
          ...team_members.slice(index + 1),
        ],
      },
    });
  };

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>{SECTION_LABEL}</h2>
      <ExpandableQuote title="Comment renseigner la liste des contacts ?" large>
        {Object.entries(contactConfiguration).map(([type, { description }]) => (
          <p key={type}>{description}</p>
        ))}
      </ExpandableQuote>
      <CardContainer flex={false}>
        {Object.entries(contactConfiguration).map(
          ([
            type,
            {
              header,
              forceDisable,
              displayMobilePhoneLabel,
              displayIndividualEmailLabel,
              displayGroupEmailLabel,
              contactByEmailOnly,
              multiple,
            },
          ]) => (
            <React.Fragment key={type}>
              {(team_members as TeamMember[])
                .filter(({ type: t }) => t === type)
                .map(({ id, tmp_id, ...team_member }) => (
                  <Contact
                    type={team_member.type}
                    heading={header!}
                    key={id || tmp_id}
                    id={id}
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
                    {...team_member}
                    displayMobilePhoneLabel={displayMobilePhoneLabel}
                    displayIndividualEmailLabel={displayIndividualEmailLabel}
                    displayGroupEmailLabel={displayGroupEmailLabel}
                    contactByEmailOnly={contactByEmailOnly}
                    displayIdForAdministrator={!!displayIdForAdministrator}
                    disabled={forceDisable || disabled}
                    onChange={onChange}
                    onDelete={multiple && !id ? removeTeamMember : null}
                    onUpdateWithUserInformation={updateWithUserInformation}
                    canUpdatePersonalInformation={
                      team_member.email === user?.email &&
                      (team_member.given_name !== user?.given_name ||
                        team_member.family_name !== user?.family_name ||
                        team_member.phone_number !== user?.phone_number ||
                        team_member.job !== user?.job)
                    }
                  />
                ))}
              {!disabled && multiple && (
                <AddCard
                  label={`ajouter un ${header?.toLowerCase()}`}
                  onClick={addTeamMemberFactory(type as TeamMemberType)}
                />
              )}
            </React.Fragment>
          )
        )}
      </CardContainer>
    </ScrollablePanel>
  );
};

ÉquipeSection.sectionLabel = SECTION_LABEL;

export default ÉquipeSection;
