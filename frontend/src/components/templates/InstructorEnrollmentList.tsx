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
import Badge from '../atoms/hyperTexts/Badge';
import Table from '../organisms/Table';
import { StatusBadge } from '../molecules/StatusBadge';
import {
  EnrollmentStatus,
  STATUS_LABELS,
} from '../../config/status-parameters';
import useQueryString from './hooks/use-query-string';
import { useAuth } from '../organisms/AuthContext';
import { debounce, isEmpty } from 'lodash';
import useListItemNavigation from './hooks/use-list-item-navigation';
import { useDataProviderConfigurations } from './hooks/use-data-provider-configurations';
import CheckboxInput from '../atoms/inputs/CheckboxInput';
import { MailIconFill } from '../atoms/icons/fr-fi-icons';
import { MailOpenIconFill } from '../atoms/icons/fr-fi-icons';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

type Demandeur = {
  id: number;
  type: string;
  email: string;
};

export type Enrollment = {
  updated_at: Date;
  created_at: Date;
  notify_events_from_demandeurs_count: number;
  id: number;
  intitule: string;
  nom_raison_sociale: string;
  demandeurs: Demandeur[];
  target_api: string;
  status: EnrollmentStatus;
};

const columnHelper = createColumnHelper<Enrollment>();

const InstructorEnrollmentList: React.FC = () => {
  const { user } = useAuth();
  const { goToItem } = useListItemNavigation();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const { dataProviderConfigurations } = useDataProviderConfigurations();

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
    }, 100);

    debouncedFetchData();
    return () => {
      debouncedFetchData.cancel();
    };
  }, [pagination, sorted, filtered]);

  const columns = [
    columnHelper.accessor('updated_at', {
      header: 'Date',
      enableColumnFilter: false,
      id: 'updated_at',
      size: 50,
      cell: ({ getValue }) => {
        const updatedAt = getValue() as Date;
        return (
          <span title={moment(updatedAt).format('llll')}>
            {moment(updatedAt).format('DD/MM/YYYY')}
          </span>
        );
      },
      meta: {
        columnTitle: 'Trier par',
      },
    }),
    columnHelper.accessor('notify_events_from_demandeurs_count', {
      header: 'Messages',
      enableSorting: false,
      size: 50,
      meta: {
        columnTitle: 'Filtrer par',
        filter: () => (
          <CheckboxInput
            className="datapass-checkbox-filter"
            label="non lu"
            onChange={() => {
              setFiltered((prevFilters: { id: string; value: any }[]) => {
                const messagesFilter = prevFilters.find(
                  ({ id }) => id === 'only_with_unprocessed_messages'
                );
                if (messagesFilter) {
                  return prevFilters.map((filter) =>
                    filter.id === 'only_with_unprocessed_messages'
                      ? !messagesFilter.value
                      : filter
                  );
                }
                return [
                  ...prevFilters,
                  {
                    id: 'only_with_unprocessed_messages',
                    value: true,
                  },
                ];
              });
              setPagination({ pageIndex: 0 });
            }}
            name="filterComponent.checkBox"
            value={
              filtered.find(
                ({ id }: { id: string }) =>
                  id === 'only_with_unprocessed_messages'
              )?.value
            }
          />
        ),
      },
      id: 'notify_events_from_demandeurs_count',
      cell: ({ getValue }) => {
        const notify_events_from_demandeurs_count = getValue() as number;
        const noUnreadMessage = notify_events_from_demandeurs_count === 0;

        const iconEmailToDisplay = noUnreadMessage ? (
          <MailOpenIconFill color={'var(--grey-625-425)'} />
        ) : (
          <MailIconFill color={'var(--border-active-blue-france)'} />
        );

        const messagesTitle = noUnreadMessage
          ? 'Pas de nouveau message'
          : notify_events_from_demandeurs_count === 1
          ? `${notify_events_from_demandeurs_count} nouveau message`
          : notify_events_from_demandeurs_count > 1
          ? `${notify_events_from_demandeurs_count} nouveaux messages`
          : '';

        return (
          <div title={messagesTitle} className="datapass-message-icon">
            {!noUnreadMessage && <span className="red-dot"></span>}
            {iconEmailToDisplay}
          </div>
        );
      },
    }),
    columnHelper.accessor('id', {
      header: 'N°',
      id: 'id',
      enableSorting: false,
      size: 70,
      meta: {
        placeholder: 'ex : 17878',
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
        placeholder: 'ex : Commune de Pessac',
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
          placeholder: 'ex : mairie@paris.fr',
        },
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
          selectOptions: user?.roles
            .filter((role) => role.endsWith(':reporter'))
            .map((role) => {
              const targetApiKey = role.split(':')[0];

              return {
                key: targetApiKey,
                label: dataProviderConfigurations?.[targetApiKey].label,
              };
            }),
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
        filter: 'select',
        selectOptions: Object.entries(STATUS_LABELS)
          .filter(([key]) => key !== 'archived')
          .map(([key, label]) => ({
            key,
            label,
          })),
      },
      cell: ({ getValue }) => {
        const status = getValue() as EnrollmentStatus;
        return <StatusBadge icon status={status} />;
      },
    }),
  ];

  return (
    <main className="dark-background">
      <div className="page-container">
        <ListHeader title="Liste des habilitations">
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
            const { id } = row as Enrollment;
            return id === previouslySelectedEnrollmentId ? 'selected' : '';
          }}
        />
      </div>
    </main>
  );
};

export default InstructorEnrollmentList;
