import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { chain } from 'lodash';
import './Enrollment.css';
import ActivityFeedWrapper from './ActivityFeedWrapper';
import Button from '../../atoms/Button';
import Tag from '../../atoms/Tag';
import { DATA_PROVIDER_PARAMETERS } from '../../../config/data-provider-parameters';
import {
  STATUS_TO_BUTTON_TYPE,
  USER_STATUS_LABELS,
} from '../../../config/status-parameters';

const Enrollment = ({
  id,
  events,
  target_api,
  intitule,
  description,
  status,
  onSelect,
}) => {
  const handleClick = useCallback(
    (e) => {
      onSelect(target_api, id, e);
    },
    [id, target_api, onSelect]
  );

  const lastUpdateEvent = useMemo(() => {
    return chain(events)
      .sortBy('updated_at')
      .filter(({ name }) => ['created', 'updated'].includes(name))
      .last()
      .value();
  }, [events]);

  return (
    <div className="enrollment">
      <div className="enrollment-header">
        <div className="fs">
          {DATA_PROVIDER_PARAMETERS[target_api]?.label}{' '}
          {DATA_PROVIDER_PARAMETERS[target_api]?.icon && (
            <div>
              <img
                src={`/images/${DATA_PROVIDER_PARAMETERS[target_api]?.icon}`}
                alt={`logo ${DATA_PROVIDER_PARAMETERS[target_api]?.label}`}
              />
            </div>
          )}
        </div>
        <Tag type={STATUS_TO_BUTTON_TYPE[status]}>
          {USER_STATUS_LABELS[status]}
        </Tag>
      </div>

      <div className="enrollment-body">
        <div className="title">
          <div className="intitule">{intitule || 'Aucun intitulé'}</div>
          {lastUpdateEvent && (
            <div className="creation">
              Dernière modification le{' '}
              <b>{moment(lastUpdateEvent.created_at).format('L')}</b> par{' '}
              <b>{lastUpdateEvent.user.email}</b>
            </div>
          )}
        </div>

        <p className="description">{description || 'Aucune description'}</p>

        <ActivityFeedWrapper
          events={events}
          status={status}
          target_api={target_api}
        />

        <div className="enrollment-footer">
          <div>
            <b>N° {id}</b>
          </div>
          <Button large onClick={handleClick}>
            Consulter
          </Button>
        </div>
      </div>
    </div>
  );
};

Enrollment.propTypes = {
  id: PropTypes.number.isRequired,
  target_api: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  description: PropTypes.string,
  intitule: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

export default Enrollment;
