import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, last, sortBy } from 'lodash';
import moment from 'moment';

import CheckCircleIcon from '../../atoms/icons/check-circle';
import InfoIcon from '../../atoms/icons/info';
import ErrorIcon from '../../atoms/icons/error';
import FileCopyIcon from '../../atoms/icons/file_copy';
import WarningIcon from '../../atoms/icons/warning';
import NotificationsIcon from '../../atoms/icons/notifications';
import './ActivityFeed.css';
import { getChangelog } from '../../../lib';
import Button from '../../atoms/Button';
import { Linkify } from '../../molecules/Linkify';

const eventToDisplayableContent = {
  request_changes: {
    icon: <WarningIcon color={'var(--orange)'} />,
    label: 'a demandé des modifications',
  },
  notify: {
    icon: <NotificationsIcon color={'var(--orange)'} />,
    label: 'a écrit',
  },
  create: {
    icon: <InfoIcon color={'var(--blue)'} outlined />,
    label: 'a créé la demande',
  },
  submit: {
    icon: <InfoIcon color={'var(--blue)'} outlined />,
    label: 'a soumis la demande',
  },
  validate: {
    icon: <CheckCircleIcon color={'var(--green)'} />,
    label: 'a validé la demande',
  },
  // This event is not available anymore but we keep this to display remaining
  // updated_contacts events in the activity feed
  update_contacts: {
    icon: <InfoIcon color={'var(--blue)'} outlined />,
    label: 'a mis à jour les contacts',
  },
  update: {
    icon: <InfoIcon color={'var(--blue)'} outlined />,
    label: 'a mis à jour la demande',
  },
  refuse: {
    icon: <ErrorIcon color={'var(--red)'} />,
    label: 'a refusé la demande',
  },
  copy: {
    icon: <FileCopyIcon color={'var(--blue)'} />,
    label: 'a copié la demande',
  },
  import: {
    icon: <InfoIcon color={'var(--blue)'} outlined />,
    label: 'a importé la demande',
  },
};

export const EventItem = ({ comment, name, updated_at, email, diff }) => {
  const [showDiff, setShowDiff] = useState(false);
  const changelog = getChangelog(diff);

  return (
    <div className="event-item">
      <div className="event-icon">{eventToDisplayableContent[name].icon}</div>
      <div className="event-content">
        <div className="event-head">
          <div>
            <strong>{email} </strong>
            {eventToDisplayableContent[name].label}
            {!isEmpty(diff) && (
              <button
                className="toogle-detail"
                onClick={() => setShowDiff(!showDiff)}
              >
                (voir détails)
              </button>
            )}
          </div>
          <div title={moment(updated_at).format('LLLL')} className="event-date">
            {moment(updated_at).calendar()}
          </div>
        </div>
        {comment && (
          <div className="event-comment">
            <Linkify message={comment} />
          </div>
        )}
        {!isEmpty(changelog) && showDiff && (
          <div className="event-comment">
            {changelog.map((log) => (
              <p key={log.slice(20)}>{log}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

EventItem.propTypes = {
  comment: PropTypes.string,
  name: PropTypes.string.isRequired,
  updated_at: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  diff: PropTypes.object,
};

EventItem.defaultProps = {
  comment: '',
  diff: {},
};

class ActivityFeed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showDetails: false,
    };
  }

  render() {
    const { showDetails } = this.state;

    const { events } = this.props;

    let eventsToDisplay = sortBy(events, 'updated_at');

    if (!showDetails && events.length > 0) {
      eventsToDisplay = [last(eventsToDisplay)];
    }

    return (
      <>
        <div className="activity-head">
          <Button
            outline
            icon="eye"
            onClick={() => this.setState({ showDetails: !showDetails })}
          >
            {showDetails ? 'Cacher l’historique' : 'Voir l’historique'}
          </Button>
        </div>
        {eventsToDisplay.map(
          ({ id, comment, name, updated_at, user: { email }, diff }) => (
            <EventItem
              key={id}
              comment={comment}
              name={name}
              updated_at={updated_at}
              email={email}
              diff={diff}
            />
          )
        )}
      </>
    );
  }
}

ActivityFeed.propTypes = {
  events: PropTypes.array,
};

ActivityFeed.defaultProps = {
  events: [],
};

export default ActivityFeed;
