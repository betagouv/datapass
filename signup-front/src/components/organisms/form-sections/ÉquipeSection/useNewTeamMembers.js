import { useMemo } from 'react';
import { chain, uniqueId } from 'lodash';

export const useNewTeamMembers = ({
  user,
  team_members,
  contactConfiguration,
}) =>
  useMemo(
    () =>
      chain(contactConfiguration)
        .keys()
        .map((type) => {
          const isMemberAlreadyInitialized = team_members.some(
            (tm) => tm && tm.type === type
          );
          if (isMemberAlreadyInitialized) {
            return null;
          }

          const tmp_id = uniqueId(`tmp_`);
          let newTeamMember = { type, tmp_id };
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
        .value(),
    [user, team_members, contactConfiguration]
  );

export default useNewTeamMembers;
