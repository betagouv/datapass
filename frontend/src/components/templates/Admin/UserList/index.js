import React, { useEffect, useMemo, useState } from 'react';

import {
  createColumnHelper,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { getUsers } from '../../../../services/users';
import { useDataProviderConfigurations } from '../../hooks/use-data-provider-configurations';
import RoleCheckboxCell from './RoleCheckboxCell';
import Loader from '../../../atoms/Loader';
import { RefreshIcon } from '../../../atoms/icons/fr-fi-icons';
import ListHeader from '../../../molecules/ListHeader';
import TagContainer from '../../../atoms/TagContainer';
import Tag from '../../../atoms/hyperTexts/Tag';
import Table from '../../../organisms/Table';
import useQueryString from '../../hooks/use-query-string';
import { debounce } from 'lodash';

const UserList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [skipReset, setSkipReset] = React.useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [pagination, setPagination] = useQueryString('pagination', {
    pageIndex: 0,
  });

  const columnHelper = createColumnHelper();

  const { dataProviderConfigurations } = useDataProviderConfigurations();

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
      ...Object.entries(dataProviderConfigurations || {}).map(
        ([targetApi, { label }]) =>
          columnHelper.group({
            header: label,
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
    [columnHelper, dataProviderConfigurations]
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

  useEffect(() => {
    const debouncedFetchData = debounce(() => {
      setIsLoading(true);
      getUsers({
        page: pagination.pageIndex,
      }).then(({ users, meta: { total_pages } }) => {
        setIsLoading(false);
        setUsers(users);
        setTotalPages(total_pages);
      });
    }, 100);

    debouncedFetchData();
    return () => {
      debouncedFetchData.cancel();
    };
  }, [pagination]);

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
          wrapperStyle={{ overflowX: 'scroll' }}
          tableOptions={{
            columns: columns,
            data: users,
            pageCount: totalPages,
            state: {
              columnFilters: pagination,
            },
            onPaginationChange: setPagination,
            manualPagination: true,
            autoResetAll: !skipReset,
            getPaginationRowModel: getPaginationRowModel(),
          }}
        />
      )}
    </>
  );
};

export default UserList;
