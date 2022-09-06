import moment from 'moment';
import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import {
  DATA_PROVIDER_PARAMETERS,
  HIDDEN_DATA_PROVIDER_KEYS,
} from '../../config/data-provider-parameters';
import { getPublicValidatedEnrollments } from '../../services/enrollments';
import enrollmentListStyle from './enrollmentListStyle';

import { debounce } from 'lodash';
import Tag from '../atoms/hyperTexts/Tag';
import { ScheduleIcon } from '../atoms/icons/fr-fi-icons';
import TagContainer from '../atoms/TagContainer';
import ListHeader from '../molecules/ListHeader';

class PublicEnrollmentList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      enrollments: [],
      loading: true,
      totalPages: 0,
      page: 0,
    };
  }

  async componentDidUpdate(prevProps) {
    if (this.props.params.targetApi !== prevProps.params.targetApi) {
      this.setState({
        page: 0,
      });

      await this.onFetchData();
    }
  }

  onFetchData = async () => {
    this.setState({ loading: true });
    // Read the state from this.state and not from internally computed react table state
    // (passed as param of this function) as react table will reset page count to zero
    // on filter update. This breaks page selection on page load.
    const { page } = this.state;

    const {
      enrollments,
      meta: { total_pages: totalPages },
    } = await getPublicValidatedEnrollments({
      targetApi: this.props.params.targetApi,
      page,
    });

    this.setState({
      enrollments,
      totalPages,
      loading: false,
    });
  };

  onPageChange = (newPage) => {
    this.setState({ page: newPage });
  };

  getColumnConfiguration = () => [
    {
      Header: () => <ScheduleIcon title="date de dernière mise à jour" />,
      accessor: 'updated_at',
      headerStyle: {
        ...enrollmentListStyle.header,
        ...enrollmentListStyle.iconHeader,
      },
      style: {
        ...enrollmentListStyle.cell,
        ...enrollmentListStyle.centeredCell,
      },
      width: 50,
      Cell: ({ value: updatedAt }) => (
        <small>{moment(updatedAt).format('D/M')}</small>
      ),
    },
    {
      Header: 'Organisation',
      accessor: 'nom_raison_sociale',
      headerStyle: enrollmentListStyle.header,
      style: enrollmentListStyle.cell,
    },
    {
      Header: 'SIRET',
      accessor: 'siret',
      headerStyle: enrollmentListStyle.header,
      style: enrollmentListStyle.cell,
    },
    {
      Header: 'Intitulé',
      accessor: 'intitule',
      headerStyle: enrollmentListStyle.header,
      style: enrollmentListStyle.cell,
    },
    {
      Header: 'Responsable traitement',
      accessor: ({
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
      id: 'responsable_traitement_name',
      headerStyle: enrollmentListStyle.header,
      style: enrollmentListStyle.cell,
    },
    {
      Header: 'Fournisseur',
      accessor: ({ target_api }) => DATA_PROVIDER_PARAMETERS[target_api]?.label,
      id: 'target_api',
      headerStyle: enrollmentListStyle.header,
      style: {
        ...enrollmentListStyle.cell,
        ...enrollmentListStyle.centeredCell,
      },
      width: 130,
    },
  ];

  getTitle = ({ column, rowInfo }) => {
    if (!rowInfo) {
      return null;
    }

    // The idea here is to display content as tooltip in case the cell is not large enough to display its whole content
    const cellValue = rowInfo.row[column.id];

    if (column.id === 'updated_at') {
      return moment(cellValue).format('llll');
    }

    return cellValue;
  };

  // this is a workaround for a react-table issue
  // see https://github.com/tannerlinsley/react-table/issues/1333#issuecomment-504046261
  debouncedFetchData = debounce(this.onFetchData, 100);

  componentWillUnmount() {
    this.debouncedFetchData.cancel();
  }

  render() {
    const { enrollments, loading, page, totalPages } = this.state;

    return (
      <main>
        <ListHeader title="Liste des habilitations">
          <TagContainer>
            <NavLink end to="/public">
              {({ isActive }) => (
                <Tag href="/public" aria-pressed={isActive ? true : false}>
                  Toutes les habilitations
                </Tag>
              )}
            </NavLink>
            {Object.keys(DATA_PROVIDER_PARAMETERS)
              .filter(
                (apiLabel) => !HIDDEN_DATA_PROVIDER_KEYS.includes(apiLabel)
              )
              .map((targetApi) => (
                <NavLink key={targetApi} end to={`/public/${targetApi}`}>
                  {({ isActive }) => (
                    <Tag
                      href={`/public/${targetApi}`}
                      aria-pressed={isActive ? true : false}
                    >
                      {DATA_PROVIDER_PARAMETERS[targetApi]?.label}
                    </Tag>
                  )}
                </NavLink>
              ))}
          </TagContainer>
        </ListHeader>
        <div className="table-container">
          <ReactTable
            manual
            data={enrollments}
            pages={totalPages}
            columns={this.getColumnConfiguration()}
            getTdProps={(state, rowInfo, column) => ({
              title: this.getTitle({ column, rowInfo }),
            })}
            getTheadProps={() => ({ style: enrollmentListStyle.thead })}
            getPaginationProps={() => ({
              style: enrollmentListStyle.pagination,
            })}
            style={enrollmentListStyle.table}
            className="-highlight"
            loading={loading}
            showPageSizeOptions={false}
            pageSize={10}
            page={page}
            onPageChange={this.onPageChange}
            onFetchData={this.debouncedFetchData}
            resizable={false}
            sortable={false}
            previousText="Précédent"
            nextText="Suivant"
            loadingText="Chargement..."
            noDataText={'Aucune habilitation'}
            pageText="Page"
            ofText="sur"
            rowsText="lignes"
          />
        </div>
      </main>
    );
  }
}

const withParams = (Component) => {
  return (props) => {
    const params = useParams();
    return <Component {...props} params={params} />;
  };
};

export default withParams(PublicEnrollmentList);
