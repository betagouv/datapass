import moment from 'moment';
import { useEffect, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import './InstructorEnrollmentList.css';

import { DATA_PROVIDER_PARAMETERS } from '../../config/data-provider-parameters';
import { getEnrollments } from '../../services/enrollments';

import { useMatomo } from '@datapunt/matomo-tracker-react';
import Button from '../atoms/hyperTexts/Button';
import { MailIcon } from '../atoms/icons/fr-fi-icons';
import { ScheduleIcon } from '../atoms/icons/fr-fi-icons';
import ListHeader from '../molecules/ListHeader';
import { AuthContext } from '../organisms/AuthContext';
import useFileDownloader from './hooks/use-file-downloader';
import useListItemNavigation from './hooks/use-list-item-navigation';
import Badge from '../atoms/hyperTexts/Badge';
import Table from '../atoms/Table';
import { StatusBadge } from '../molecules/StatusBadge';

const columnHelper = createColumnHelper();

const InstructorEnrollmentList = ({
  goToItem,
  isExportDownloading,
  downloadExport,
}) => {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    getEnrollments({ page: 0 }).then(({ enrollments }) => {
      setEnrollments(enrollments);
    });
  }, []);

  const getColumnConfiguration = () => [
    columnHelper.accessor('updated_at', {
      header: () => <ScheduleIcon color={'var(--datapass-dark-grey)'} />,
      accessorKey: 'updated_at',
      enableColumnFilter: false,
      id: 'updated_at',
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
        meta: { filterType: 'select' },
        filterFn: 'arrIncludesSome',
      }
    ),
    columnHelper.accessor('status', {
      header: 'Statut',
      accessorKey: 'status',
      id: 'status',
      filterFn: 'arrIncludesSome',
      meta: { filterType: 'select' },
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
          }}
          onRowClick={({ row, e }) => {
            if (row) {
              const {
                original: { id, target_api },
              } = row;
              goToItem(target_api, id, e);
            }
          }}
        />
      </div>
    </main>
  );
};

const withMatomoTrackEvent = (Component) => {
  return (props) => {
    const { trackEvent } = useMatomo();
    return <Component {...props} matomoTrackEvent={trackEvent} />;
  };
};

const withFileDownloader = (Component) => {
  return (props) => {
    const { isDownloading, download } = useFileDownloader();
    const downloadExport = () =>
      download('/api/enrollments/export', 'text/csv');
    return (
      <Component
        {...props}
        isExportDownloading={isDownloading}
        downloadExport={downloadExport}
      />
    );
  };
};

const withListItemNavigation = (Component) => {
  return (props) => {
    const { goToItem } = useListItemNavigation();
    return <Component {...props} goToItem={goToItem} />;
  };
};

const withAuth = (Component) => {
  return (props) => (
    <AuthContext.Consumer>
      {(userProps) => <Component {...props} {...userProps} />}
    </AuthContext.Consumer>
  );
};

export default withMatomoTrackEvent(
  withFileDownloader(withListItemNavigation(withAuth(InstructorEnrollmentList)))
);
