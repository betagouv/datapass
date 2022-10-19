import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  createColumnHelper,
  getPaginationRowModel,
} from '@tanstack/react-table';
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

const columnHelper = createColumnHelper();

const InstructorEnrollmentList = ({
  goToItem,
  isExportDownloading,
  downloadExport,
}) => {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    getEnrollments({ page: 0, size: 100 }).then(({ enrollments }) => {
      setEnrollments(enrollments);
    });
  }, []);

  const getColumnConfiguration = () => [
    columnHelper.accessor('updated_at', {
      header: () => <ScheduleIcon color={'var(--datapass-dark-grey)'} />,
      accessorKey: 'updated_at',
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
      accessorKey: 'notify_events_from_demandeurs_count',
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
      accessorKey: 'id',
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
      accessorKey: 'nom_raison_sociale',
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
        accessorKey: 'team_members.email',
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
        accessorKey: 'target_api',
        id: 'target_api',
        enableSorting: false,
        meta: { filterType: 'select' },
        filterFn: 'arrIncludesSome',
      }
    ),
    columnHelper.accessor('status', {
      header: 'Statut',
      accessorKey: 'status',
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
            getPaginationRowModel: getPaginationRowModel(),
          }}
          onRowClick={({ row, event }) => {
            if (row) {
              const {
                original: { id, target_api },
              } = row;
              goToItem(target_api, id, event);
            }
          }}
        />
      </div>
    </main>
  );
};

export default withMatomoTrackEvent(
  withFileDownloader(withListItemNavigation(withAuth(InstructorEnrollmentList)))
);
