import React, { useContext, useEffect, useMemo } from 'react';
import { chain, findIndex, isEmpty, uniqueId } from 'lodash';
import Contact from './Contact';
import { ScrollablePanel } from '../../Scrollable';
import { FormContext } from '../../../templates/Form';
import ExpandableQuote from '../../../atoms/inputs/ExpandableQuote';
import { UserContext } from '../../UserContext';
import useNewTeamMembers from './useNewTeamMembers';
import ControlPointIcon from '../../../atoms/icons/control-point';

const SECTION_LABEL = 'Les personnes impliquées';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

export const getDefaultDemandeurDescription = () => (
  <>
    <b>Le demandeur</b>, c'est vous, dépose la demande et sera contacté en cas
    de problème fonctionnel sur votre service.
  </>
);

export const getDefaultResponsableTraitementDescription = () => (
  <>
    <b>Le responsable du traitement des données</b> est la personne physique ou
    morale qui, seule ou conjointement avec d’autres, détermine les finalités et
    les moyens du traitement des données à caractère personnel. Seule une
    personne appartenant à l’organisme demandeur peut être renseignée. Cette
    personne sera notifiée par email à la validation de la demande. Ses nom et
    prénom peuvent également être rendus publics.{' '}
    <a
      href={'https://www.cnil.fr/fr/definition/responsable-de-traitement'}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Voir la définition CNIL du responsable de traitement"
    >
      Plus d’infos
    </a>
    .
  </>
);

export const getDefaultDelegueProtectionDonneesDescription = () => (
  <>
    <b>Le délégué à la protection des données</b> assure que l’organisation
    protège convenablement les données à caractère personnel, conformément à la
    législation en vigueur. C'est généralement une personne appartenant à
    l’organisme demandeur. Cette personne sera notifiée par email à la
    validation de la demande.{' '}
    <a
      href={'https://www.cnil.fr/fr/designation-dpo'}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Voir la définition CNIL du délégué à la protection des données"
    >
      Plus d’infos
    </a>
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
  title = 'Les personnes impliquées',
}) => {
  const {
    isUserEnrollmentLoading,
    disabled,
    onChange,
    enrollment: { team_members = [] },
  } = useContext(FormContext);
  const { user } = useContext(UserContext);
  const contactConfiguration = useMemo(() => {
    const defaultInitialContacts = {
      demandeur: {
        header: 'Demandeur',
        description: getDefaultDemandeurDescription(),
        forceDisable: true,
      },
      responsable_traitement: {
        header: 'Responsable de traitement',
        description: getDefaultResponsableTraitementDescription(),
      },
      delegue_protection_donnees: {
        header: 'Délégué à la protection des données',
        description: getDefaultDelegueProtectionDonneesDescription(),
      },
      responsable_technique: {
        header: 'Responsable technique',
        description: getDefaultResponsableTechniqueDescription(),
      },
    };

    return chain(defaultInitialContacts)
      .assign(initialContacts)
      .pickBy((p) => p)
      .value();
  }, [initialContacts]);

  const newTeamMembers = useNewTeamMembers({
    user,
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

  const addTeamMemberFactory = (type) => {
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

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>{title}</h2>
      <ExpandableQuote title="Comment renseigner la liste des contacts ?" large>
        {Object.entries(contactConfiguration).map(([type, { description }]) => (
          <p key={type}>{description}</p>
        ))}
      </ExpandableQuote>
      <div className="form__group">
        <div className="contact-list">
          {Object.entries(contactConfiguration).map(
            ([
              type,
              {
                header,
                forceDisable,
                displayMobilePhoneLabel,
                displayIndividualEmailLabel,
                contactByEmailOnly,
                multiple,
              },
            ]) => (
              <React.Fragment key={type}>
                {team_members
                  .filter(({ type: t }) => t === type)
                  .map(({ id, tmp_id, ...team_member }) => (
                    <Contact
                      heading={header}
                      key={id || tmp_id}
                      id={id}
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
                      {...team_member}
                      displayMobilePhoneLabel={displayMobilePhoneLabel}
                      displayIndividualEmailLabel={displayIndividualEmailLabel}
                      contactByEmailOnly={contactByEmailOnly}
                      disabled={forceDisable || disabled}
                      onChange={onChange}
                    />
                  ))}
                {!disabled && multiple && (
                  <div
                    className="card contact-item add-card"
                    onClick={addTeamMemberFactory(type)}
                  >
                    <ControlPointIcon size="50px" />
                    <div className="add-card-label">
                      ajouter un {header.toLowerCase()}
                    </div>
                  </div>
                )}
              </React.Fragment>
            )
          )}
        </div>
      </div>
    </ScrollablePanel>
  );
};

ÉquipeSection.sectionLabel = SECTION_LABEL;

export default ÉquipeSection;
