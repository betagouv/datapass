import { useCallback, useEffect, useState } from 'react';

import {
  Column,
  ColumnFilter,
  createColumnHelper,
  getCoreRowModel,
} from '@tanstack/react-table';
import { getUsers } from '../../../../services/users';
import { useDataProviderConfigurations } from '../../hooks/use-data-provider-configurations';
import RoleCheckboxCell from './RoleCheckboxCell';
import { RefreshIcon } from '../../../atoms/icons/fr-fi-icons';
import ListHeader from '../../../molecules/ListHeader';
import TagContainer from '../../../atoms/TagContainer';
import Tag from '../../../atoms/hyperTexts/Tag';
import Table from '../../../organisms/Table';
import { debounce } from 'lodash';
import { User } from '../../../../config';

const UserList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filtered, setFiltered] = useState<ColumnFilter[]>([]);

  const columnHelper = createColumnHelper<User>();

  const { dataProviderConfigurations } = useDataProviderConfigurations();

  const columns = [
    columnHelper.accessor('email', {
      header: 'Email',
      id: 'email',
      minSize: 150,
      filterFn: 'includesString',
      meta: {
        placeholder: 'Filtrer par email',
      },
      enableSorting: false,
    }),
    ...Object.entries(dataProviderConfigurations || {}).map(
      ([targetApi, { label }]) =>
        columnHelper.group({
          header: label,
          id: targetApi,
          enableColumnFilter: false,
          enableSorting: false,
          cell: (cellProps) => (
            <RoleCheckboxCell updateData={updateRole} {...cellProps} />
          ),
        })
    ),
    columnHelper.accessor('id', {
      header: 'Id',
      id: 'id',
      enableColumnFilter: false,
      enableSorting: false,
    }),
  ];

  const updateRole = (rowIndex: number, columnId: string, value: any) => {
    setUsers((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          let newRoles;
          if (value) {
            newRoles = [...(row.roles ?? []), columnId];
          } else {
            newRoles = row.roles ? row.roles.filter((e) => e !== columnId) : [];
          }
          return {
            ...old[rowIndex],
            roles: newRoles,
          };
        }
        return row;
      })
    );
  };

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    const {
      users,
      meta: { total_pages },
    } = await getUsers({
      usersWithRolesOnly: !showAllUsers,
      page: pagination.pageIndex,
      filter: filtered,
    });
    setIsLoading(false);
    setUsers(users);
    setTotalPages(total_pages > 0 ? total_pages : 1);
  }, [showAllUsers, pagination, filtered]);

  useEffect(() => {
    const debouncedFetchData = debounce(() => {
      fetchUsers();
    }, 100);

    debouncedFetchData();
    return () => {
      debouncedFetchData.cancel();
    };
  }, [fetchUsers]);

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
          <Tag onClick={fetchUsers}>
            <RefreshIcon color={'var(--text-action-high-blue-france)'} />
          </Tag>
        </TagContainer>
      </ListHeader>
      <Table
        firstColumnFixed
        wrapperStyle={{ overflowX: 'scroll' }}
        loading={isLoading}
        noDataPlaceholder="Aucun utilisateur"
        tableOptions={{
          columns: columns as Column<User>[],
          data: users,
          pageCount: totalPages,
          state: {
            pagination,
            columnFilters: filtered,
          },
          onPaginationChange: setPagination,
          onColumnFiltersChange: setFiltered,
          manualPagination: true,
          manualFiltering: true,
          getCoreRowModel: getCoreRowModel(),
        }}
      />
    </>
  );
};

export default UserList;
