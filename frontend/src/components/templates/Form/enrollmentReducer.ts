import { cloneDeep, get, isEmpty, isObject, merge, omitBy, set } from 'lodash';
import {
  Demarche,
  Demarches,
  Enrollment,
  TeamMemberType,
} from '../../../config';

export const globalUpdate = ({
  previousEnrollment,
  futureEnrollment,
}: {
  previousEnrollment: Enrollment;
  futureEnrollment: Enrollment;
}) =>
  merge(
    {},
    previousEnrollment,
    omitBy(futureEnrollment, (e) => e === null) // do not merge null properties, keep empty string instead to avoid controlled input to switch to uncontrolled input
  );

export const eventUpdateFactory =
  (demarches: Demarches | null) =>
  ({
    previousEnrollment,
    event: {
      target: { type = null, checked = null, value: inputValue, name },
    },
  }: {
    previousEnrollment: Enrollment;
    event: any;
  }) => {
    const value = type === 'checkbox' ? checked : inputValue;

    let futureEnrollment = cloneDeep(previousEnrollment);
    set(futureEnrollment, name, value);

    if (demarches && name === 'demarche') {
      const defaultDemarche = get(demarches, 'default', {}) as Demarche;
      const selectedDemarche = get(demarches, value, {}) as Demarche;

      let futureTeamMembers = futureEnrollment.team_members;
      if (
        !isEmpty(futureEnrollment.team_members) &&
        !isEmpty(defaultDemarche.team_members)
      ) {
        futureTeamMembers = futureEnrollment?.team_members?.map(
          (futureTeamMember) => {
            if (
              !defaultDemarche!.team_members![
                futureTeamMember.type as TeamMemberType
              ]
            ) {
              return futureTeamMember;
            }

            if (
              !selectedDemarche.team_members ||
              !selectedDemarche.team_members[
                futureTeamMember.type as TeamMemberType
              ]
            ) {
              return defaultDemarche!.team_members![
                futureTeamMember.type as TeamMemberType
              ];
            }

            return selectedDemarche.team_members[
              futureTeamMember.type as TeamMemberType
            ];
          }
        );
      }

      futureEnrollment = merge(
        {},
        futureEnrollment,
        defaultDemarche.state,
        selectedDemarche.state,
        { team_members: futureTeamMembers }
      );
    }

    return futureEnrollment;
  };

// Fonction de garde de type
function isEvent(obj: Enrollment | Event): obj is Event {
  return (obj as Event).target !== undefined;
}

export const enrollmentReducerFactory =
  (demarches: Demarches | null) =>
  (
    previousEnrollment: Enrollment,
    eventOrFutureEnrollment: Enrollment | Event | string
  ) => {
    if (!isObject(eventOrFutureEnrollment)) {
      return previousEnrollment;
    }

    // if no eventOrFutureEnrollment.target, this is a direct state update (network for instance)
    // a direct state update DOES NOT trigger a pre-filled demarche update
    if (!isEvent(eventOrFutureEnrollment)) {
      const futureEnrollment = eventOrFutureEnrollment;

      return globalUpdate({ previousEnrollment, futureEnrollment });
    }

    // if eventOrFutureEnrollment.target, it means reducer was trigger by an html element (input, select etc.)
    const event = eventOrFutureEnrollment;
    return eventUpdateFactory(demarches)({
      previousEnrollment,
      event,
    });
  };

export default enrollmentReducerFactory;
