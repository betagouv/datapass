import React from 'react';
import UpdateTeamMember from './UpdateTeamMember';
import UserList from './UserList';
import AddUser from './AddUser';

export const Admin = () => (
  <main>
    <UserList />
    <AddUser />
    <UpdateTeamMember />
  </main>
);

export default Admin;
