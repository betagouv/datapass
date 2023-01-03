import moment from 'moment';
import { useEffect, useState } from 'react';
import { getPublicValidatedEnrollments } from '../../services/enrollments';
import { ScheduleIcon } from '../atoms/icons/fr-fi-icons';
import ListHeader from '../molecules/ListHeader';
import Table from '../organisms/Table';
import { createColumnHelper } from '@tanstack/react-table';
import { useDataProviderConfigurations } from './hooks/use-data-provider-configurations';
import useQueryString from './hooks/use-query-string';
import { debounce } from 'lodash';
import { HIDDEN_DATA_PROVIDER_KEYS } from '../../config/data-provider-configurations';

const columnHelper = createColumnHelper();

const PublicEnrollmentList = () => {
  const { dataProviderConfigurations } = useDataProviderConfigurations();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [pagination, setPagination] = useQueryString('pagination', {
    pageIndex: 0,
  });
  const [filtered, setFiltered] = useQueryString('filtered', []);

  useEffect(() => {
    const debouncedFetchData = debounce(() => {
      setLoading(true);
      getPublicValidatedEnrollments({
        filter: filtered,
        page: pagination.pageIndex,
      }).then(({ enrollments, meta: { total_pages: totalPages } }) => {
        setLoading(false);
        setEnrollments(enrollments);
        setTotalPages(totalPages);
      });
    }, 100);

    debouncedFetchData();

    return () => {
      debouncedFetchData.cancel();
    };
  }, [pagination, filtered]);

  const columns = [
    columnHelper.accessor('updated_at', {
      enableColumnFilter: false,
      enableSorting: false,
      size: 50,
      header: () => <ScheduleIcon title="date de dernière mise à jour" />,
      cell: ({ getValue }) => <small>{moment(getValue()).format('D/M')}</small>,
    }),
    columnHelper.accessor('nom_raison_sociale', {
      enableColumnFilter: false,
      header: 'Organisation',
      enableSorting: false,
    }),
    columnHelper.accessor('siret', {
      enableColumnFilter: false,
      enableSorting: false,
      header: 'SIRET',
    }),
    columnHelper.accessor('intitule', {
      enableColumnFilter: false,
      header: 'Intitulé',
      enableSorting: false,
    }),
    columnHelper.accessor(
      ({
        responsable_traitement_given_name: given_name,
        responsable_traitement_family_name: family_name,
      }) => {
        if (!given_name && !family_name) {
          return '';
        }
        if (!given_name) {
          return family_name;
        }
        return `${given_name} ${family_name}`;
      },
      {
        enableColumnFilter: false,
        enableSorting: false,
        header: 'Responsable traitement',
        id: 'responsable_traitement_name',
      }
    ),
    columnHelper.accessor(
      ({ target_api }) => dataProviderConfigurations?.[target_api].label,
      {
        header: 'Fournisseur',
        id: 'target_api',
        enableSorting: false,
        meta: {
          filter: 'select',
          selectOptions: Object.entries(dataProviderConfigurations || {})
            .filter(
              ([targetApi]) => !HIDDEN_DATA_PROVIDER_KEYS.includes(targetApi)
            )
            .map(([targetApi, { label }]) => ({
              key: targetApi,
              label: label,
            })),
        },
        filterFn: 'arrIncludesSome',
      }
    ),
  ];

  return (
    <main>
      <ListHeader title="Liste des habilitations" />
      <div className="table-container">
        <Table
          tableOptions={{
            data: enrollments,
            columns: columns,
            pageCount: totalPages,
            state: {
              columnFilters: filtered,
              pagination,
            },
            onPaginationChange: setPagination,
            onColumnFiltersChange: setFiltered,
            manualPagination: true,
            manualFiltering: true,
          }}
          loading={loading}
        />
      </div>
    </main>
  );
};

export default PublicEnrollmentList;
