import React, { useEffect, useMemo, useState } from 'react';

import { DATA_PROVIDER_PARAMETERS } from '../../../../config/data-provider-parameters';
import { getUsers } from '../../../../services/users';
import Table from './Table';
import RoleCheckboxCell from './RoleCheckboxCell';
import { TextFilter, textFilter } from './TextFilter';
import Loader from '../../../atoms/Loader';
import AutorenewIcon from '../../../atoms/icons/autorenew';
import ListHeader from '../../../molecules/ListHeader';
import Tag, { TagContainer } from '../../../atoms/Tag';

const UserList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [skipReset, setSkipReset] = React.useState(false);

  const filterTypes = React.useMemo(
    () => ({
      text: textFilter,
    }),
    []
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Email',
        accessor: 'email',
        Filter: TextFilter,
        filter: 'text',
      },
      ...Object.keys(DATA_PROVIDER_PARAMETERS).map((targetApi) => ({
        Header: () => (
          <span style={{ writingMode: 'vertical-rl' }}>
            {`${DATA_PROVIDER_PARAMETERS[targetApi]?.label}`}
          </span>
        ),
        id: targetApi,
        columns: ['reporter', 'instructor', 'subscriber'].map((roleType) => ({
          Header: `${roleType[0]}`,
          id: `${targetApi}:${roleType}`,
          accessor: ({ roles }) => roles.includes(`${targetApi}:${roleType}`),
          Cell: RoleCheckboxCell,
        })),
      })),
      { Header: 'Id', accessor: 'id' },
    ],
    []
  );

  const updateRole = (rowIndex, columnId, value) => {
    setSkipReset(true);
    setUsers((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          const newRoles = value
            ? [...row.roles, columnId]
            : row.roles.filter((e) => e !== columnId);
          return {
            ...old[rowIndex],
            roles: newRoles,
          };
        }
        return row;
      })
    );
  };

  useEffect(() => {
    setSkipReset(false);
  }, [users]);

  useEffect(() => {
    const onFetchData = async () => {
      setIsLoading(true);
      const { users } = await getUsers({ usersWithRolesOnly: !showAllUsers });
      setUsers(users);
      setIsLoading(false);
    };
    onFetchData();
  }, [showAllUsers]);

  const handleRefreshData = async () => {
    setIsLoading(true);
    const { users } = await getUsers({ usersWithRolesOnly: !showAllUsers });
    setUsers(users);
    setIsLoading(false);
  };

  return (
    <div className="table-container admin-table-container">
      <ListHeader title="Liste des utilisateurs">
        <TagContainer>
          <Tag
            type={!showAllUsers ? 'info' : ''}
            onClick={() => setShowAllUsers(false)}
          >
            Utilisateurs avec droits
          </Tag>
          <Tag
            type={showAllUsers ? 'info' : ''}
            onClick={() => setShowAllUsers(true)}
          >
            Tous les utilisateurs
          </Tag>
          <Tag onClick={handleRefreshData}>
            <AutorenewIcon size={16} />
          </Tag>
        </TagContainer>
      </ListHeader>
      {isLoading ? (
        <div className="full-page" style={{ minHeight: '800px' }}>
          <Loader />
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            data={users}
            updateData={updateRole}
            filterTypes={filterTypes}
            skipReset={skipReset}
            initialState={{ hiddenColumns: ['id'] }}
          />
          <div>
            Légende :
            <ul>
              <li>r (reporter) : rapporteur</li>
              <li>i (instructor) : instructeur</li>
              <li>s (subscriber) : abonné</li>
            </ul>
            <a href="https://github.com/betagouv/datapass#les-roles-dans-datapass">
              Plus d’info
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default UserList;
