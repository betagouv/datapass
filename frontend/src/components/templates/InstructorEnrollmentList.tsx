import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  createColumnHelper,
  getCoreRowModel,
  Row,
} from '@tanstack/react-table';
import './InstructorEnrollmentList.css';

import { DATA_PROVIDER_PARAMETERS } from '../../config/data-provider-parameters';
import { getEnrollments } from '../../services/enrollments';

import Button from '../atoms/hyperTexts/Button';
import { MailIcon } from '../atoms/icons/fr-fi-icons';
import { ScheduleIcon } from '../atoms/icons/fr-fi-icons';
import ListHeader from '../molecules/ListHeader';
import Badge, { BadgeType } from '../atoms/hyperTexts/Badge';
import Table from '../organisms/Table';
import { StatusBadge } from '../molecules/StatusBadge';
import {
  EnrollmentStatus,
  INSTRUCTOR_STATUS_LABELS,
} from '../../config/status-parameters';
import useQueryString from './hooks/use-query-string';
import { useAuth } from '../organisms/AuthContext';
import { debounce, isEmpty } from 'lodash';
import useListItemNavigation from './hooks/use-list-item-navigation';
import useFileDownloader from './hooks/use-file-downloader';

type Demandeur = {
  id: number;
  type: string;
  email: string;
};

export type Enrollment = {
  updated_at: Date;
  notify_events_from_demandeurs_count: number;
  id: number;
  nom_raison_sociale: string;
  demandeurs: Demandeur[];
  target_api: string;
  status: EnrollmentStatus;
};

const columnHelper = createColumnHelper<Enrollment>();

const InstructorEnrollmentList: React.FC = () => {
  const { isDownloading, download } = useFileDownloader();
  const { user } = useAuth();
  const downloadExport = () => download('/api/enrollments/export', 'text/csv');
  const { goToItem } = useListItemNavigation();
  const [enrollments, setEnrollments] = useState([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pagination, setPagination] = useQueryString('pagination', {
    pageIndex: 0,
  });

  const [filtered, setFiltered] = useQueryString('filtered', [
    {
      id: 'status',
      value: isEmpty(user?.roles)
        ? ['submitted', 'changes_requested', 'draft']
        : ['submitted', 'changes_requested'],
    },
  ]);
  const [sorted, setSorted] = useQueryString('sorted', [
    {
      id: 'updated_at',
      desc: false,
    },
  ]);
  const [previouslySelectedEnrollmentId, setPreviouslySelectedEnrollmentId] =
    useQueryString('previouslySelectedEnrollmentId', 0);

  useEffect(() => {
    const debouncedFetchData = debounce(() => {
      getEnrollments({
        page: pagination.pageIndex,
        sortBy: sorted,
        filter: filtered,
      }).then(({ enrollments, meta: { total_pages } }) => {
        setEnrollments(enrollments);
        setTotalPages(total_pages);
      });
    }, 100);

    debouncedFetchData();
    return () => {
      debouncedFetchData.cancel();
    };
  }, [pagination, sorted, filtered]);

  const columns = [
    columnHelper.accessor('updated_at', {
      header: () => (
        <span title="Date de dernière mise à jour">
          <ScheduleIcon color={'var(--datapass-dark-grey)'} />
        </span>
      ),
      enableColumnFilter: false,
      id: 'updated_at',
      size: 50,
      cell: ({ getValue }) => {
        const updatedAt = getValue() as Date;
        const daysFromToday = moment().diff(updatedAt, 'days');
        return (
          <span
            title={moment(daysFromToday).format('llll')}
          >{`${daysFromToday}j`}</span>
        );
      },
    }),
    columnHelper.accessor('notify_events_from_demandeurs_count', {
      header: () => (
        <span title="Nombre de nouveaux messages">
          <MailIcon color={'var(--datapass-dark-grey)'} />
        </span>
      ),
      enableColumnFilter: false,
      enableSorting: false,
      size: 50,
      id: 'notify_events_from_demandeurs_count',
      cell: ({ getValue }) => {
        const notify_events_from_demandeurs_count = getValue() as number;
        const messagesTitle =
          notify_events_from_demandeurs_count === 0
            ? 'Pas de nouveau message'
            : notify_events_from_demandeurs_count === 1
            ? `${notify_events_from_demandeurs_count} nouveau message`
            : notify_events_from_demandeurs_count > 1
            ? `${notify_events_from_demandeurs_count} nouveaux messages`
            : '';

        return (
          <Badge
            className="fr-py-1v"
            type={
              notify_events_from_demandeurs_count > 0 ? BadgeType.warning : ''
            }
          >
            <span
              title={messagesTitle}
              className="fr-m-auto"
              style={{ textOverflow: 'unset' }}
            >
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
        const id = getValue() as number;

        return (
          <Badge className="fr-py-1v">
            <span className="fr-m-auto" style={{ textOverflow: 'unset' }}>
              {id}
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
        const status = getValue() as EnrollmentStatus;
        return <StatusBadge userType="instructor" status={status} />;
      },
    }),
  ];

  return (
    <main>
      <ListHeader title="Liste des habilitations">
        <Button
          onClick={() => downloadExport()}
          disabled={isDownloading}
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
            columns: columns as Row<Enrollment>[],
            pageCount: totalPages,
            state: {
              columnFilters: filtered,
              sorting: sorted,
              pagination,
            },
            onPaginationChange: setPagination,
            onSortingChange: setSorted,
            onColumnFiltersChange: (updateFn) => {
              setPagination({ pageIndex: 0 });
              setFiltered(updateFn);
            },
            manualPagination: true,
            manualFiltering: true,
            manualSorting: true,
            getCoreRowModel: getCoreRowModel(),
          }}
          onRowClick={async ({ row, event }) => {
            const { id, target_api } = row as Enrollment;
            await setPreviouslySelectedEnrollmentId(id);
            goToItem(target_api, id, event);
          }}
          getRowClassName={(row) => {
            const { id } = row as Enrollment;
            return id === previouslySelectedEnrollmentId ? 'selected' : '';
          }}
        />
      </div>
    </main>
  );
};

export default InstructorEnrollmentList;
