import moment from 'moment';
import { useEffect, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import './InstructorEnrollmentList.css';

import { DATA_PROVIDER_PARAMETERS } from '../../config/data-provider-parameters';
import { getEnrollments } from '../../services/enrollments';

import Button from '../atoms/hyperTexts/Button';
import { MailIcon } from '../atoms/icons/fr-fi-icons';
import { ScheduleIcon } from '../atoms/icons/fr-fi-icons';
import ListHeader from '../molecules/ListHeader';
import Badge from '../atoms/hyperTexts/Badge';
import Table from '../atoms/Table';
import { StatusBadge } from '../molecules/StatusBadge';
import {
  withAuth,
  withFileDownloader,
  withListItemNavigation,
  withMatomoTrackEvent,
} from '../../hoc';
import { INSTRUCTOR_STATUS_LABELS } from '../../config/status-parameters';
import useQueryString from '../../hooks/useQueryString';

const columnHelper = createColumnHelper();

const InstructorEnrollmentList = ({
  goToItem,
  isExportDownloading,
  downloadExport,
  user,
}) => {
  const [enrollments, setEnrollments] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pagination, setPagination] = useQueryString(
    'pagination',
    {
      pageIndex: 0,
      pageSize: 10,
    },
    true
  );
  const [filtered, setFiltered] = useQueryString('filtered', [], true);
  const [sorted, setSorted] = useQueryString('sorted', [], true);
  const [previouslySelectedEnrollmentId, setPreviouslySelectedEnrollmentId] =
    useQueryString('previouslySelectedEnrollmentId', 0, true);

  useEffect(() => {
    getEnrollments({
      page: pagination.pageIndex,
      size: pagination.pageSize,
      sortBy: sorted,
      filter: filtered,
    }).then(({ enrollments, meta: { total_pages } }) => {
      setEnrollments(enrollments);
      setTotalPages(total_pages);
    });
  }, [pagination, sorted, filtered]);

  const getColumnConfiguration = () => [
    columnHelper.accessor('updated_at', {
      header: () => <ScheduleIcon color={'var(--datapass-dark-grey)'} />,
      enableColumnFilter: false,
      id: 'updated_at',
      size: 50,
      cell: ({ getValue }) => {
        const updatedAt = getValue();
        const daysFromToday = moment().diff(updatedAt, 'days');
        const color =
          daysFromToday > 5 ? 'red' : daysFromToday > 4 ? 'orange' : 'green';
        return <span style={{ color }}>{daysFromToday}j</span>;
      },
    }),
    columnHelper.accessor('notify_events_from_demandeurs_count', {
      header: <MailIcon color={'var(--datapass-dark-grey)'} />,
      enableColumnFilter: false,
      enableSorting: false,
      size: 50,
      id: 'notify_events_from_demandeurs_count',
      cell: ({ getValue }) => {
        const notify_events_from_demandeurs_count = getValue();
        return (
          <Badge
            className="fr-py-1v"
            type={notify_events_from_demandeurs_count > 0 ? 'warning' : ''}
          >
            <span className="fr-m-auto" style={{ textOverflow: 'unset' }}>
              {notify_events_from_demandeurs_count}
            </span>
          </Badge>
        );
      },
    }),
    columnHelper.accessor('id', {
      header: 'N°',
      id: 'id',
      enableSorting: false,
      size: 70,
      meta: {
        placeholder: '000',
      },
      filterFn: 'weakEquals',
      cell: ({ getValue }) => {
        const notify_events_from_demandeurs_count = getValue();
        return (
          <Badge
            className="fr-py-1v"
            type={notify_events_from_demandeurs_count > 0 ? 'warning' : ''}
          >
            <span className="fr-m-auto" style={{ textOverflow: 'unset' }}>
              {notify_events_from_demandeurs_count}
            </span>
          </Badge>
        );
      },
    }),
    columnHelper.accessor('nom_raison_sociale', {
      header: 'Raison sociale',
      id: 'nom_raison_sociale',
      enableSorting: false,
      filterFn: 'includesString',
      meta: {
        placeholder: 'Filtrer par raison sociale',
      },
    }),
    columnHelper.accessor(
      ({ demandeurs }) => demandeurs.map(({ email }) => email).join(', '),
      {
        header: 'Email du demandeur',
        id: 'team_members.email',
        enableSorting: false,
        filterFn: 'includesString',
        meta: {
          placeholder: 'Filtrer parmi tous les emails de contact',
        },
      }
    ),
    columnHelper.accessor(
      ({ target_api }) => DATA_PROVIDER_PARAMETERS[target_api]?.label,
      {
        header: 'Fournisseur',
        id: 'target_api',
        enableSorting: false,
        meta: {
          filterType: 'select',
          selectOptions: Object.entries(DATA_PROVIDER_PARAMETERS).map(
            ([key, { label }]) => ({ key, label })
          ),
        },
        filterFn: 'arrIncludesSome',
      }
    ),
    columnHelper.accessor('status', {
      header: 'Statut',
      id: 'status',
      enableSorting: false,
      filterFn: 'arrIncludesSome',
      meta: {
        filterType: 'select',
        selectOptions: Object.entries(INSTRUCTOR_STATUS_LABELS).map(
          ([key, label]) => ({ key, label })
        ),
      },
      cell: ({ getValue }) => {
        const status = getValue();
        return <StatusBadge userType="instructor" status={status} />;
      },
    }),
  ];

  return (
    <main>
      <ListHeader title="Liste des habilitations">
        <Button
          onClick={() => downloadExport()}
          disabled={isExportDownloading}
          secondary
          icon="file-download"
          iconRight
        >
          Exporter les données
        </Button>
      </ListHeader>
      <div className="table-container">
        <Table
          tableOptions={{
            data: enrollments,
            columns: getColumnConfiguration(),
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
          }}
          onRowClick={({ row, event }) => {
            if (row) {
              const {
                original: { id, target_api },
              } = row;
              setPreviouslySelectedEnrollmentId(id);
              goToItem(target_api, id, event);
            }
          }}
          getRowClassName={(row) =>
            row && row.original.id === previouslySelectedEnrollmentId
              ? 'selected'
              : ''
          }
        />
      </div>
    </main>
  );
};

export default withMatomoTrackEvent(
  withFileDownloader(withListItemNavigation(withAuth(InstructorEnrollmentList)))
);
