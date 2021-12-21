import React from 'react';
import UpdateTeamMember from './UpdateTeamMember';
import UserList from './UserList';
import AddUser from './AddUser';

export const Admin = () => (
  <section className="full-width-container">
    <h1>Administration</h1>
    <div className="notification warning">
      <b>« Un grand pouvoir implique de grandes responsabilités »</b>
      <i> - Ben Parker, oncle de Spider-man</i>
    </div>
    <UserList />
    <AddUser />
    <UpdateTeamMember />
  </section>
);

export default Admin;
