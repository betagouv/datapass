import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import 'react-table-6/react-table.css';
import ReactTable from 'react-table-6';
import moment from 'moment';

import { getPublicValidatedEnrollments } from '../../services/enrollments';
import { enrollmentListStyle } from '../../lib/enrollment';
import {
  TARGET_API_LABELS,
  TARGET_API_WITH_ENROLLMENTS_IN_PRODUCTION_ENV,
} from '../../lib/api';

import ScheduleIcon from '../atoms/icons/schedule';
import ListHeader from '../molecules/ListHeader';

class PublicEnrollmentList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      enrollments: [],
      errors: [],
      loading: true,
    };
  }

  async componentDidMount() {
    const enrollments = await getPublicValidatedEnrollments(
      this.props.match.params.targetApi
    );

    this.setState({
      enrollments: enrollments.map((enrollment) => {
        return enrollment;
      }),
      loading: false,
    });
  }

  async componentDidUpdate(prevProps) {
    if (
      this.props.match.params.targetApi !== prevProps.match.params.targetApi
    ) {
      this.setState({
        enrollments: [],
        errors: [],
        loading: true,
      });

      const enrollments = await getPublicValidatedEnrollments(
        this.props.match.params.targetApi
      );

      this.setState({
        enrollments: enrollments.map((enrollment) => {
          return enrollment;
        }),
        loading: false,
      });
    }
  }

  getColumnConfiguration = () => [
    {
      Header: () => <ScheduleIcon title="date de dernière mise à jour" />,
      accessor: 'updated_at',
      headerStyle: {
        ...enrollmentListStyle.header,
        ...enrollmentListStyle.updateAtHeader,
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
      accessor: 'responsable_traitement_family_name',
      headerStyle: enrollmentListStyle.header,
      style: enrollmentListStyle.cell,
    },
    {
      Header: 'Fournisseur',
      accessor: ({ target_api }) => TARGET_API_LABELS[target_api],
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

  render() {
    const { enrollments, errors, loading } = this.state;

    return (
      <section className="section-grey full-width-container">
        <ListHeader title="Liste des demandes validées">
          <NavLink
            className="fr-tag secondary"
            activeClassName={'info'}
            exact
            to="/public"
          >
            Toutes les demandes
          </NavLink>
          {TARGET_API_WITH_ENROLLMENTS_IN_PRODUCTION_ENV.map((targetApi) => (
            <NavLink
              key={targetApi}
              className="fr-tag secondary"
              activeClassName={'info'}
              exact
              to={`/public/${targetApi}`}
            >
              {TARGET_API_LABELS[targetApi]}
            </NavLink>
          ))}
        </ListHeader>
        <div className="panel">
          <div className="enrollment-table">
            {errors.map((error) => (
              <div key={error} className="notification error">
                {error}
              </div>
            ))}
            <ReactTable
              data={enrollments}
              columns={this.getColumnConfiguration()}
              defaultSorted={[
                {
                  id: 'updated_at',
                  desc: true,
                },
              ]}
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
              resizable={false}
              previousText="Précédent"
              nextText="Suivant"
              loadingText="Chargement..."
              noDataText={'Aucune demande'}
              pageText="Page"
              ofText="sur"
              rowsText="lignes"
            />
          </div>
        </div>
      </section>
    );
  }
}

PublicEnrollmentList.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      targetApi: PropTypes.string,
    }),
  }),
};

PublicEnrollmentList.defaultProps = {
  match: {
    params: {
      targetApi: null,
    },
  },
};

export default PublicEnrollmentList;
