import React, { useEffect, useMemo, useState } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { DATA_PROVIDER_PARAMETERS } from '../../../../config/data-provider-parameters';
import { getUsers } from '../../../../services/users';
import RoleCheckboxCell from './RoleCheckboxCell';
import Loader from '../../../atoms/Loader';
import { RefreshIcon } from '../../../atoms/icons/fr-fi-icons';
import ListHeader from '../../../molecules/ListHeader';
import TagContainer from '../../../atoms/TagContainer';
import Link from '../../../atoms/hyperTexts/Link';
import Tag from '../../../atoms/hyperTexts/Tag';
import Table from './Table';

const UserList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [skipReset, setSkipReset] = React.useState(false);

  const columnHelper = createColumnHelper();

  const columns = useMemo(
    () => [
      columnHelper.accessor('email', {
        header: 'Email',
        accessorKey: 'email',
        id: 'email',
        filterFn: 'includesString',
      }),
      ...Object.keys(DATA_PROVIDER_PARAMETERS).map((targetApi) =>
        columnHelper.group({
          header: () => (
            <span style={{ writingMode: 'vertical-rl' }}>
              {`${DATA_PROVIDER_PARAMETERS[targetApi]?.label}`}
            </span>
          ),
          id: targetApi,
          enableColumnFilter: false,
          columns: ['reporter', 'instructor', 'subscriber'].map((roleType) =>
            columnHelper.accessor(`${targetApi}:${roleType}`, {
              header: `${roleType[0]}`,
              id: `${targetApi}:${roleType}`,
              enableColumnFilter: false,
              cell: (cellProps) => (
                <RoleCheckboxCell updateData={updateRole} {...cellProps} />
              ),
            })
          ),
        })
      ),
      columnHelper.accessor('id', {
        header: 'Id',
        accessorKey: 'id',
        id: 'id',
        enableColumnFilter: false,
      }),
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
            isActive={!showAllUsers ? true : false}
            onClick={() => setShowAllUsers(false)}
          >
            Utilisateurs avec droits
          </Tag>
          <Tag
            isActive={showAllUsers ? true : false}
            onClick={() => setShowAllUsers(true)}
          >
            Tous les utilisateurs
          </Tag>
          <Tag onClick={handleRefreshData}>
            <RefreshIcon color={'var(--text-action-high-blue-france)'} />
          </Tag>
        </TagContainer>
      </ListHeader>
      {isLoading ? (
        <div className="full-page" style={{ minHeight: '800px' }}>
          <Loader />
        </div>
      ) : (
        <>
          <div className="admin-table">
            <Table
              columns={columns}
              data={users}
              updateData={updateRole}
              autoResetAll={!skipReset}
            />
          </div>
          <div>
            Légende :
            <ul>
              <li>r (reporter) : rapporteur</li>
              <li>i (instructor) : instructeur</li>
              <li>s (subscriber) : abonné</li>
            </ul>
            <Link
              inline
              href="https://github.com/betagouv/datapass#les-roles-dans-datapass"
            >
              Plus d’info
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default UserList;
