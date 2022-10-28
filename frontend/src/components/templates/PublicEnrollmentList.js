import moment from 'moment';
import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { HIDDEN_DATA_PROVIDER_KEYS } from '../../config/data-provider-configurations';
import { getPublicValidatedEnrollments } from '../../services/enrollments';

import Tag from '../atoms/hyperTexts/Tag';
import { ScheduleIcon } from '../atoms/icons/fr-fi-icons';
import TagContainer from '../atoms/TagContainer';
import ListHeader from '../molecules/ListHeader';
import Table from '../organisms/Table';
import { createColumnHelper } from '@tanstack/react-table';
import { useDataProviderConfigurations } from './hooks/use-data-provider-configurations';

const columnHelper = createColumnHelper();

const PublicEnrollmentList = () => {
  const params = useParams();
  const [enrollments, setEnrollments] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { dataProviderConfigurations } = useDataProviderConfigurations();

  useEffect(() => {
    getPublicValidatedEnrollments({
      targetApi: params.targetApi,
      page: pageIndex,
      size: pageSize,
    }).then(({ enrollments, meta: { total_pages: totalPages } }) => {
      setEnrollments(enrollments);
      setTotalPages(totalPages);
    });
  }, [params, pageIndex, pageSize]);

  const getColumnConfiguration = () => [
    columnHelper.accessor('updated_at', {
      enableColumnFilter: false,
      size: 50,
      header: () => <ScheduleIcon title="date de dernière mise à jour" />,
      cell: ({ getValue }) => <small>{moment(getValue()).format('D/M')}</small>,
    }),
    columnHelper.accessor('nom_raison_sociale', {
      enableColumnFilter: false,
      header: 'Organisation',
    }),
    columnHelper.accessor('siret', {
      enableColumnFilter: false,
      header: 'SIRET',
    }),
    columnHelper.accessor('intitule', {
      enableColumnFilter: false,
      header: 'Intitulé',
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
        header: 'Responsable traitement',
        id: 'responsable_traitement_name',
      }
    ),
    columnHelper.accessor(
      ({ target_api }) => dataProviderConfigurations?.[target_api].label,
      {
        enableColumnFilter: false,
        header: 'Fournisseur',
        id: 'target_api',
      }
    ),
  ];

  return (
    <main>
      <ListHeader title="Liste des habilitations">
        <TagContainer>
          <NavLink end to="/public">
            {({ isActive }) => (
              <Tag isActive={!!isActive}>Toutes les habilitations</Tag>
            )}
          </NavLink>
          {Object.entries(dataProviderConfigurations || {})
            .filter(
              ([targetApi]) => !HIDDEN_DATA_PROVIDER_KEYS.includes(targetApi)
            )
            .map(([targetApi, { label }]) => (
              <NavLink key={targetApi} end to={`/public/${targetApi}`}>
                {({ isActive }) => <Tag isActive={!!isActive}>{label}</Tag>}
              </NavLink>
            ))}
        </TagContainer>
      </ListHeader>
      <div className="table-container">
        <Table
          tableOptions={{
            data: enrollments,
            columns: getColumnConfiguration(),
            manualPagination: true,
            pageCount: totalPages,
            state: {
              pagination: {
                pageIndex,
                pageSize,
              },
            },
            onPaginationChange: setPagination,
          }}
        />
      </div>
    </main>
  );
};

export default PublicEnrollmentList;
