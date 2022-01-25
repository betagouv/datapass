import React from 'react';
import 'react-table-6/react-table.css';
import ReactTable from 'react-table-6';
import { debounce, filter, isEmpty, pick, pickBy, toPairs } from 'lodash';
import moment from 'moment';

import './InstructorEnrollmentList.css';

import { getStateFromUrlParams, setUrlParamsFromState } from '../../lib';
import { getEnrollments } from '../../services/enrollments';
import { DATA_PROVIDER_PARAMETERS } from '../../config/data-provider-parameters';
import { INSTRUCTOR_STATUS_LABELS } from '../../config/status-parameters';
import enrollmentListStyle from './enrollmentListStyle';

import ScheduleIcon from '../atoms/icons/schedule';
import { AuthContext } from '../organisms/AuthContext';
import MultiSelect from '../molecules/MultiSelect';
import TagContainer from '../atoms/TagContainer';
import ListHeader from '../molecules/ListHeader';
import FileCopyIcon from '../atoms/icons/file_copy';
import useListItemNavigation from './hooks/use-list-item-navigation';
import Tag from '../atoms/hyperTexts/Tag';

const getInboxes = (user) => ({
  primary: {
    label: 'Demandes en cours',
    sorted: [
      {
        id: 'updated_at',
        desc: false,
      },
    ],
    filtered: [
      {
        id: 'status',
        value: isEmpty(user.roles)
          ? ['submitted', 'changes_requested', 'draft']
          : ['submitted', 'changes_requested'],
      },
    ],
  },
  archive: {
    label: 'Demandes traitées',
    sorted: [
      {
        id: 'updated_at',
        desc: true,
      },
    ],
    filtered: [
      {
        id: 'status',
        value: ['validated', 'refused'],
      },
    ],
  },
});

class InstructorEnrollmentList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      enrollments: [],
      loading: true,
      totalPages: 0,
      page: 0,
      sorted: getInboxes(this.props.user)['primary'].sorted,
      filtered: getInboxes(this.props.user)['primary'].filtered,
      previouslySelectedEnrollmentId: 0,
      inbox: 'primary',
    };
  }

  async componentDidMount() {
    try {
      const newState = getStateFromUrlParams(
        pick(this.state, [
          'inbox',
          'page',
          'sorted',
          'filtered',
          'previouslySelectedEnrollmentId',
        ])
      );
      this.setState(newState);
    } catch (e) {
      // silently fail, if the state from url is not properly formatted we do not apply url params
      console.error(e);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.totalPages === 0 &&
      this.state.totalPages > prevState.totalPages
    ) {
      const pageMax = this.state.totalPages - 1;
      if (pageMax < this.state.page) {
        this.onPageChange(pageMax);
      }
    }

    setUrlParamsFromState(
      pick(this.state, ['inbox', 'page', 'sorted', 'filtered'])
    );
  }

  availableAction = new Set([
    'validate',
    'request_changes',
    'refuse',
    'submit',
  ]);

  hasTriggerableActions = ({ acl }) =>
    !isEmpty(
      pickBy(acl, (value, key) => value && this.availableAction.has(key))
    );

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
      sortable: true,
      Cell: ({ value: updatedAt }) => {
        if (this.state.inbox !== 'primary') {
          return <small>{moment(updatedAt).format('D/M')}</small>;
        }

        const daysFromToday = moment().diff(updatedAt, 'days');
        const color =
          daysFromToday > 5 ? 'red' : daysFromToday > 4 ? 'orange' : 'green';
        return <span style={{ color }}>{daysFromToday}j</span>;
      },
    },
    {
      Header: 'N°',
      accessor: 'id',
      headerStyle: enrollmentListStyle.header,
      style: {
        ...enrollmentListStyle.cell,
        ...enrollmentListStyle.centeredCell,
      },
      width: 65,
      filterable: true,
    },
    {
      Header: 'Raison sociale',
      accessor: 'nom_raison_sociale',
      headerStyle: enrollmentListStyle.header,
      style: enrollmentListStyle.cell,
      filterable: true,
      Placeholder: 'Filtrer par raison sociale',
    },
    {
      Header: 'Email du demandeur',
      id: 'team_members.email',
      accessor: ({ demandeurs }) =>
        demandeurs.map(({ email }) => email).join(', '),
      headerStyle: enrollmentListStyle.header,
      style: enrollmentListStyle.cell,
      filterable: true,
      Placeholder: 'Filtrer parmi tous les emails de contact',
    },
    {
      Header: 'Fournisseur',
      accessor: ({ target_api }) => DATA_PROVIDER_PARAMETERS[target_api]?.label,
      id: 'target_api',
      headerStyle: enrollmentListStyle.header,
      style: enrollmentListStyle.cell,
      width: 130,
      filterable: true,
      Filter: ({ filter, onChange }) => {
        // Note that users own enrollments might not be available through this filter
        const options = this.props.user.roles
          .filter((role) => role.endsWith(':reporter'))
          .map((role) => {
            const targetApiKey = role.split(':')[0];

            return {
              key: targetApiKey,
              label: DATA_PROVIDER_PARAMETERS[targetApiKey]?.label,
            };
          });

        return (
          <MultiSelect
            options={options}
            values={filter ? filter.value : []}
            onChange={onChange}
          />
        );
      },
    },
    {
      Header: 'Statut',
      accessor: ({ status, acl, is_renewal }) => ({
        statusLabel: INSTRUCTOR_STATUS_LABELS[status] || null,
        acl,
        isRenewal: is_renewal,
      }),
      id: 'status',
      headerStyle: enrollmentListStyle.header,
      style: {
        ...enrollmentListStyle.cell,
        ...enrollmentListStyle.centeredCell,
      },
      width: 115,
      filterable: true,
      Cell: ({ value: { statusLabel, acl, isRenewal } }) => {
        if (!this.hasTriggerableActions({ acl })) {
          return (
            <span>
              {statusLabel}
              {isRenewal ? (
                <span style={{ marginLeft: '4px' }}>
                  <FileCopyIcon size={16} />
                </span>
              ) : (
                ''
              )}
            </span>
          );
        }

        return (
          <Tag type="warning">
            {statusLabel}
            {isRenewal ? (
              <span style={{ marginLeft: '2px' }}>
                <FileCopyIcon color="white" size={14} />
              </span>
            ) : (
              ''
            )}
          </Tag>
        );
      },
      Filter: ({ filter, onChange }) => {
        const options = toPairs(INSTRUCTOR_STATUS_LABELS).map(
          ([key, label]) => ({
            key,
            label,
          })
        );

        return (
          <MultiSelect
            options={options}
            values={filter ? filter.value : []}
            onChange={onChange}
          />
        );
      },
    },
  ];

  getTitle = ({ column, rowInfo }) => {
    if (!rowInfo) {
      return null;
    }

    // The idea here is to display content as tooltip in case the cell is not large enough to display its whole content
    const cellValue = rowInfo.row[column.id];

    if (column.id === 'status') {
      return cellValue.statusLabel + (cellValue.isRenewal ? ' (copie)' : '');
    }

    if (column.id === 'updated_at') {
      return moment(cellValue).format('llll');
    }

    return cellValue;
  };

  onPageChange = (newPage) => {
    this.setState({ page: newPage });
  };

  onSortedChange = (newSorted) => {
    this.setState({ sorted: newSorted });
  };

  onFilteredChange = (newFiltered) => {
    this.setState({ filtered: newFiltered, page: 0 });
  };

  onSelectInbox = (newInbox) => {
    // If the user clicks once, we change the inbox (primary or archive) without clearing filters.
    // If the user clicks twice, we stay on the inbox and we clear the filter.
    // That provides a way to clear all filter without reloading the page.
    let filtered = [];
    if (this.state.inbox !== newInbox) {
      filtered = filter(this.state.filtered, ({ id }) => id !== 'status');
    }

    this.setState({
      inbox: newInbox,
      sorted: getInboxes(this.props.user)[newInbox].sorted,
      filtered: [
        ...filtered,
        ...getInboxes(this.props.user)[newInbox].filtered,
      ],
      page: 0,
      previouslySelectedEnrollmentId: 0,
    });
  };

  savePreviouslySelectedEnrollmentId = (id) => {
    setUrlParamsFromState({ previouslySelectedEnrollmentId: id });
  };

  onFetchData = async () => {
    this.setState({ loading: true });
    // Read the state from this.state and not from internally computed react table state
    // (passed as param of this function) as react table will reset page count to zero
    // on filter update. This breaks page selection on page load.
    const { page, sorted, filtered } = this.state;

    const {
      enrollments,
      meta: { total_pages: totalPages },
    } = await getEnrollments({
      page,
      sortBy: sorted,
      filter: filtered,
    });

    this.setState({
      enrollments,
      totalPages,
      loading: false,
    });
  };

  // this is a workaround for a react-table issue
  // see https://github.com/tannerlinsley/react-table/issues/1333#issuecomment-504046261
  debouncedFetchData = debounce(this.onFetchData, 100);

  componentWillUnmount() {
    this.debouncedFetchData.cancel();
  }

  render() {
    const { goToItem } = this.props;
    const {
      enrollments,
      loading,
      page,
      sorted,
      filtered,
      inbox,
      previouslySelectedEnrollmentId,
      totalPages,
    } = this.state;
    return (
      <main>
        <ListHeader title="Liste des habilitations">
          <TagContainer>
            {Object.keys(getInboxes(this.props.user)).map((currentInbox) => (
              <Tag
                key={currentInbox}
                type={inbox === currentInbox ? 'info' : ''}
                onClick={() => this.onSelectInbox(currentInbox)}
              >
                {getInboxes(this.props.user)[currentInbox].label}
              </Tag>
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
              onClick: (e, handleOriginal) => {
                if (rowInfo) {
                  const {
                    original: { id, target_api },
                  } = rowInfo;
                  this.savePreviouslySelectedEnrollmentId(id);

                  goToItem(target_api, id, e);
                }

                if (handleOriginal) {
                  handleOriginal();
                }
              },
              title: this.getTitle({ column, rowInfo }),
              className:
                rowInfo &&
                rowInfo.original.id === previouslySelectedEnrollmentId
                  ? 'selected'
                  : null,
            })}
            getTheadProps={() => ({ style: enrollmentListStyle.thead })}
            getTheadFilterThProps={() => ({
              style: enrollmentListStyle.filterThead,
            })}
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
            sortable={false}
            sorted={sorted}
            onSortedChange={this.onSortedChange}
            filtered={filtered}
            onFilteredChange={this.onFilteredChange}
            onFetchData={this.debouncedFetchData}
            resizable={false}
            previousText="Précédent"
            nextText="Suivant"
            loadingText="Chargement..."
            noDataText={
              inbox === 'primary'
                ? 'Toute les habilitations ont été traitées'
                : 'Aucune habilitation'
            }
            pageText="Page"
            ofText="sur"
            rowsText="lignes"
          />
        </div>
      </main>
    );
  }
}

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

export default withListItemNavigation(withAuth(InstructorEnrollmentList));
