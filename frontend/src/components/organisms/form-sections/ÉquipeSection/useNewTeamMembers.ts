import { useMemo } from 'react';
import { chain, uniqueId } from 'lodash';
import { ContactConfigurationType } from '.';
import { TeamMember, TeamMemberType, User } from '../../../../config';

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
            phone_number?: string;
          };
          if (type === 'demandeur') {
            newTeamMember = {
              ...newTeamMember,
              email: user.email,
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
