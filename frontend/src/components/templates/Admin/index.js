import React from 'react';
import UpdateTeamMember from './UpdateTeamMember';
import UserList from './UserList';
import AddUser from './AddUser';
import { useAuth } from '../../organisms/AuthContext';
import { useMemo } from 'react';
import Alert from '../../atoms/Alert';

export const Admin = () => {
  const { user } = useAuth();

  const displayAdminPage = useMemo(
    () => user.roles.includes('administrator'),
    [user]
  );

  return (
    <main>
      {!displayAdminPage && (
        <div className="full-page">
          <Alert type="error" title="Accès refusé">
            Vous n'êtes pas autorisé à accéder à cette page.
          </Alert>
        </div>
      )}
      {displayAdminPage && (
        <>
          <UserList />
          <AddUser />
          <UpdateTeamMember />
        </>
      )}
    </main>
  );
};

export default Admin;
