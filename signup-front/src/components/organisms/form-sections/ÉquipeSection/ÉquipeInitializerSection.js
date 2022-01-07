import { useContext, useEffect } from 'react';
import { FormContext } from '../../../templates/Form';
import { useAuth } from '../../AuthContext';
import useNewTeamMembers from './useNewTeamMembers';
import { isEmpty } from 'lodash';

export const ÉquipeInitializerSection = () => {
  const {
    isUserEnrollmentLoading,
    disabled,
    onChange,
    enrollment: { team_members = [] },
  } = useContext(FormContext);
  const { user } = useAuth();

  const newTeamMembers = useNewTeamMembers({
    user,
    team_members,
    contactConfiguration: { demandeur: {} },
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

  return null;
};

export default ÉquipeInitializerSection;
