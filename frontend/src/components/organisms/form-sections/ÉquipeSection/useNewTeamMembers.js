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
            ({ type: t }) => t === type
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
            };
          }
          return newTeamMember;
        })
        .compact()
        .value(),
    [user, team_members, contactConfiguration]
  );

export default useNewTeamMembers;
