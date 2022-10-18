import moment from 'moment';
import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import {
  DATA_PROVIDER_PARAMETERS,
  HIDDEN_DATA_PROVIDER_KEYS,
} from '../../config/data-provider-parameters';
import { getPublicValidatedEnrollments } from '../../services/enrollments';

import Tag from '../atoms/hyperTexts/Tag';
import { ScheduleIcon } from '../atoms/icons/fr-fi-icons';
import TagContainer from '../atoms/TagContainer';
import ListHeader from '../molecules/ListHeader';
import Table from '../atoms/Table';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper();

const PublicEnrollmentList = ({ params }) => {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    getPublicValidatedEnrollments({
      targetApi: params.targetApi,
    }).then(({ enrollments }) => {
      setEnrollments(enrollments);
    });
  }, [params]);

  const getColumnConfiguration = () => [
    columnHelper.accessor('updated_at', {
      enableColumnFilter: false,
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
      ({ target_api }) => DATA_PROVIDER_PARAMETERS[target_api]?.label,
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
          {Object.keys(DATA_PROVIDER_PARAMETERS)
            .filter((apiLabel) => !HIDDEN_DATA_PROVIDER_KEYS.includes(apiLabel))
            .map((targetApi) => (
              <NavLink key={targetApi} end to={`/public/${targetApi}`}>
                {({ isActive }) => (
                  <Tag isActive={!!isActive}>
                    {DATA_PROVIDER_PARAMETERS[targetApi]?.label}
                  </Tag>
                )}
              </NavLink>
            ))}
        </TagContainer>
      </ListHeader>
      <div className="table-container">
        <Table
          tableOptions={{
            data: enrollments,
            columns: getColumnConfiguration(),
          }}
        />
      </div>
    </main>
  );
};

const withParams = (Component) => {
  return (props) => {
    const params = useParams();
    return <Component {...props} params={params} />;
  };
};

export default withParams(PublicEnrollmentList);
