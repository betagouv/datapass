import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  Column,
  createColumnHelper,
  getCoreRowModel,
} from '@tanstack/react-table';
import './InstructorEnrollmentList.css';

import { getEnrollments } from '../../services/enrollments';

import Button from '../atoms/hyperTexts/Button';
import ListHeader from '../molecules/ListHeader';
import Table from '../organisms/Table';
import Badge, { StatusBadge } from '../molecules/StatusBadge';
import useQueryString from './hooks/use-query-string';
import { debounce } from 'lodash';
import useListItemNavigation from './hooks/use-list-item-navigation';
import InstructorEnrollmentListFilters from '../organisms/InstructorEnrollmentListFilters';
import StateBadge from '../molecules/StateBadge';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;
const columnHelper = createColumnHelper<Enrollment>();

const InstructorEnrollmentList: React.FC = () => {
  const { goToItem } = useListItemNavigation();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pagination, setPagination] = useQueryString('pagination', {
    pageIndex: 0,
  });

  const [filtered, setFiltered] = useQueryString('filtered', []);
  const [sorted, setSorted] = useQueryString('sorted', [
    { id: 'updated_at', desc: false },
  ]);
  const [previouslySelectedEnrollmentId, setPreviouslySelectedEnrollmentId] =
    useQueryString('previouslySelectedEnrollmentId', 0);

  useEffect(() => {
    setPagination({ pageIndex: 0 });
  }, [filtered, sorted, setPagination]);

  useEffect(() => {
    const debouncedFetchData = debounce(() => {
      setLoading(true);
      getEnrollments({
        page: pagination.pageIndex,
        sortBy: sorted,
        filter: filtered,
      }).then(({ enrollments, meta: { total_pages } }) => {
        setLoading(false);
        setEnrollments(enrollments);
        setTotalPages(total_pages > 0 ? total_pages : 1);
      });
    }, 200);

    debouncedFetchData();
    return () => {
      debouncedFetchData.cancel();
    };
  }, [pagination, sorted, filtered]);

  const columns = [
    columnHelper.accessor((enrollment) => enrollment, {
      header: 'État',
      id: 'state',
      enableSorting: false,
      enableColumnFilter: false,
      size: 70,
      cell: ({ getValue }) => {
        const enrollment = getValue();
        return <StateBadge enrollment={enrollment} />;
      },
    }),
    columnHelper.accessor('updated_at', {
      header: 'Date',
      enableColumnFilter: false,
      id: 'updated_at',
      size: 50,
      cell: ({ getValue }) => {
        const updatedAt = getValue() as string;
        return (
          <span title={moment(updatedAt).format('llll')}>
            {moment(updatedAt).format('DD/MM/YYYY')}
          </span>
        );
      },
    }),
    columnHelper.accessor('id', {
      header: 'N°',
      id: 'id',
      enableSorting: false,
      enableColumnFilter: false,
      size: 70,
    }),
    columnHelper.accessor('nom_raison_sociale', {
      header: 'Organisation',
      id: 'nom_raison_sociale',
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ getValue }) => {
        const organisation = getValue() as string;
        return organisation?.toUpperCase();
      },
    }),
    columnHelper.accessor('intitule', {
      header: 'Projet',
      id: 'intitule',
      enableSorting: false,
      enableColumnFilter: false,
    }),
    columnHelper.accessor(
      ({ demandeurs }) => demandeurs?.map(({ email }) => email).join(', '),
      {
        header: 'Email du demandeur',
        id: 'team_members.email',
        enableSorting: false,
        enableColumnFilter: false,
      }
    ),
    columnHelper.accessor(
      ({
        unprocessed_notify_events_from_demandeurs_count,
        notify_events_from_demandeurs_count,
      }) => ({
        unprocessed_notify_events_from_demandeurs_count,
        notify_events_from_demandeurs_count,
      }),
      {
        header: 'Message',
        enableSorting: false,
        enableColumnFilter: false,
        size: 50,
        id: 'unprocessed_notify_events_from_demandeurs_count',
        cell: ({ getValue }) => {
          const {
            unprocessed_notify_events_from_demandeurs_count,
            notify_events_from_demandeurs_count,
          } = getValue() as {
            unprocessed_notify_events_from_demandeurs_count: number;
            notify_events_from_demandeurs_count: number;
          };
          const noUnreadMessage =
            unprocessed_notify_events_from_demandeurs_count === 0;

          const messagesTitle = noUnreadMessage
            ? 'Pas de nouveau message'
            : unprocessed_notify_events_from_demandeurs_count === 1
            ? `${unprocessed_notify_events_from_demandeurs_count} nouveau message`
            : unprocessed_notify_events_from_demandeurs_count > 1
            ? `${unprocessed_notify_events_from_demandeurs_count} nouveaux messages`
            : '';

          return notify_events_from_demandeurs_count > 0 ? (
            <div title={messagesTitle} className="datapass-message-icon">
              {!noUnreadMessage && <span className="red-dot"></span>}
              <Badge round>{notify_events_from_demandeurs_count}</Badge>
            </div>
          ) : null;
        },
      }
    ),
    columnHelper.accessor('status', {
      header: 'Statut',
      id: 'status',
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ getValue }) => {
        const status = getValue() as EnrollmentStatus;
        return <StatusBadge icon status={status} />;
      },
    }),
  ];

  return (
    <main className="dark-background">
      <div className="page-container">
        <div className="fr-mt-5w" />
        <ListHeader title="Toutes les habilitations">
          <Button
            href={`${BACK_HOST}/api/enrollments/export`}
            download
            secondary
            icon="file-download"
            iconRight
          >
            Exporter les données
          </Button>
        </ListHeader>
        <InstructorEnrollmentListFilters
          filters={filtered}
          setFilters={setFiltered}
        />
        <Table
          tableOptions={{
            data: enrollments,
            columns: columns as Column<Enrollment>[],
            pageCount: totalPages,
            state: {
              columnFilters: filtered,
              sorting: sorted,
              pagination,
            },
            onPaginationChange: setPagination,
            onSortingChange: setSorted,
            onColumnFiltersChange: setFiltered,
            manualPagination: true,
            manualFiltering: true,
            manualSorting: true,
            getCoreRowModel: getCoreRowModel(),
          }}
          loading={loading}
          noDataPlaceholder="Aucune habilitation ne correspond aux critères renseignés"
          onRowClick={async ({ row, event }) => {
            const { id, target_api } = row as Enrollment;
            await setPreviouslySelectedEnrollmentId(id);
            goToItem(target_api, id, event);
          }}
          getRowClassName={(row) => {
            const {
              id,
              consulted_by_instructor,
              requested_changes_have_been_done,
            } = row as Enrollment;
            let className = '';

            if (id === previouslySelectedEnrollmentId) {
              className += ' selected';
            }

            if (!consulted_by_instructor && !requested_changes_have_been_done) {
              className += ' new';
            }

            return className;
          }}
        />
      </div>
    </main>
  );
};

export default InstructorEnrollmentList;
