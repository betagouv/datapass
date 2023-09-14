import { useMemo } from 'react';
import { chain, uniqueId } from 'lodash';
import { ContactConfigurationType } from '.';

type useNewTeamMembersProps = {
  user: User;
  team_members: TeamMember[];
  contactConfiguration: ContactConfigurationType;
};

export const useNewTeamMembers = ({
  user,
  team_members,
  contactConfiguration,
}: useNewTeamMembersProps) =>
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
          let newTeamMember = { type, tmp_id } as {
            type: TeamMemberType;
            tmp_id: string | number;
            email?: string;
          };
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
