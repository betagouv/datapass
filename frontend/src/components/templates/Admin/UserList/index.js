import React, { useEffect, useMemo, useState } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { DATA_PROVIDER_PARAMETERS } from '../../../../config/data-provider-parameters';
import { getUsers } from '../../../../services/users';
import RoleCheckboxCell from './RoleCheckboxCell';
import Loader from '../../../atoms/Loader';
import { RefreshIcon } from '../../../atoms/icons/fr-fi-icons';
import ListHeader from '../../../molecules/ListHeader';
import TagContainer from '../../../atoms/TagContainer';
import Tag from '../../../atoms/hyperTexts/Tag';
import Table from '../../../atoms/Table';

import './RoleCheckboxCell.css';

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
        meta: {
          placeholder: 'Filtrer par email',
        },
      }),
      ...Object.keys(DATA_PROVIDER_PARAMETERS).map((targetApi) =>
        columnHelper.group({
          header: DATA_PROVIDER_PARAMETERS[targetApi]?.label,
          id: targetApi,
          enableColumnFilter: false,
          cell: (cellProps) => (
            <RoleCheckboxCell updateData={updateRole} {...cellProps} />
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
    [columnHelper]
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
    <>
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
        <Table
          firstColumnFixed
          tableOptions={{
            columns: columns,
            data: users,
            autoResetAll: !skipReset,
          }}
        />
      )}
    </>
  );
};

export default UserList;
