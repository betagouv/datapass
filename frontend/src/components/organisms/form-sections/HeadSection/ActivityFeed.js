import { chain, isEmpty } from 'lodash';
import { useContext, useMemo, useState } from 'react';
import { FormContext } from '../../../templates/Form';

import moment from 'moment';
import PropTypes from 'prop-types';
import { getChangelog, isUserADemandeur } from '../../../../lib';
import {
  ArchiveIcon,
  CheckCircleIcon,
  NotificationIcon,
  ErrorIcon,
  MailIcon,
  MailOpenIcon,
  InfoFillIcon,
  WarningIcon,
} from '../../../atoms/icons/fr-fi-icons';
import FileCopyIcon from '../../../atoms/icons/fileCopy';
import { Linkify } from '../../../molecules/Linkify';
import { useAuth } from '../../AuthContext';
import './ActivityFeed.css';
import ExpandableSection from '../../../molecules/ExpandableSection';
import { EnrollmentEvent } from '../../../../config/event-configuration';

const eventToDisplayableContent = {
  request_changes: {
    icon: <WarningIcon color={'var(--text-default-warning)'} />,
    label: 'a demandé des modifications',
  },
  notify: {
    icon: <MailIcon color={'var(--text-default-info)'} />,
    label: 'a écrit',
  },
  create: {
    icon: <InfoFillIcon color={'var(--text-default-info)'} outlined />,
    label: 'a créé la demande d’habilitation',
  },
  submit: {
    icon: <InfoFillIcon color={'var(--text-default-info)'} outlined />,
    label: 'a soumis la demande d’habilitation',
  },
  validate: {
    icon: <CheckCircleIcon color={'var(--text-default-success)'} />,
    label: 'a validé l’habilitation',
  },
  reminder_before_archive: {
    icon: <NotificationIcon color={'var(--text-default-warning)'} />,
    label: 'a envoyé un email de relance avant archivage',
  },
  reminder: {
    icon: <NotificationIcon color={'var(--text-default-info)'} />,
    label: 'a envoyé un email de relance',
  },
  // This event is not available anymore but we keep this to display remaining
  // updated_contacts events in the activity feed
  update_contacts: {
    icon: <InfoFillIcon color={'var(--text-default-info)'} outlined />,
    label: 'a mis à jour les contacts',
  },
  update: {
    icon: <InfoFillIcon color={'var(--text-default-info)'} outlined />,
    label: 'a mis à jour l’habilitation',
  },
  refuse: {
    icon: <ErrorIcon color={'var(--text-default-error)'} />,
    label: 'a refusé l’habilitation',
  },
  revoke: {
    icon: <ErrorIcon color={'var(--text-default-error)'} />,
    label: 'a révoqué l’habilitation',
  },
  archive: {
    icon: <ArchiveIcon color={'var(--text-default-info)'} />,
    label: 'a archivé l’habilitation',
  },
  copy: {
    icon: <FileCopyIcon color={'var(--text-default-info)'} />,
    label: 'a copié l’habilitation',
  },
  import: {
    icon: <InfoFillIcon color={'var(--text-default-info)'} outlined />,
    label: 'a importé l’habilitation',
  },
};

export const EventItem = ({
  comment,
  name,
  created_at,
  processed_at,
  email,
  family_name,
  given_name,
  diff,
}) => {
  const [showDiff, setShowDiff] = useState(false);
  const changelog = getChangelog(diff);
  const { getIsUserAnInstructor } = useAuth();

  const {
    enrollment: { team_members = [], target_api },
  } = useContext(FormContext) || { enrollment: {} };

  let eventCommentClass = 'event-comment';

  if (isUserADemandeur({ team_members, user_email: email })) {
    eventCommentClass += ' event-comment-demandeurs';
  }

  const userLabel = useMemo(() => {
    return given_name && family_name
      ? `${given_name} ${family_name}`
      : given_name || family_name || email || 'DataPass';
  }, [given_name, family_name, email]);

  const isUserAnInstructor = getIsUserAnInstructor(target_api);

  let notifyIcon = eventToDisplayableContent[name].icon;

  if (isUserAnInstructor && name === 'notify' && processed_at) {
    notifyIcon = <MailOpenIcon color={'var(--text-default-info)'} />;
  }

  return (
    <div className="event-item">
      <div className="event-icon">{notifyIcon}</div>
      <div className="event-content">
        <div className="event-head">
          <div>
            <strong>{userLabel} </strong>
            {eventToDisplayableContent[name].label}
            {!isEmpty(changelog) && (
              <button
                className="toogle-detail"
                onClick={() => setShowDiff(!showDiff)}
              >
                (voir détails)
              </button>
            )}
          </div>
          <div
            title={moment(created_at).format('LLLL')}
            className="fr-hint-text"
          >
            {moment(created_at).calendar()}
          </div>
        </div>
        {comment && (
          <div className={eventCommentClass}>
            <Linkify message={comment} />
          </div>
        )}
        {!isEmpty(changelog) && showDiff && (
          <div className={eventCommentClass}>
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
  created_at: PropTypes.string.isRequired,
  email: PropTypes.string,
  family_name: PropTypes.string,
  given_name: PropTypes.string,
  diff: PropTypes.object,
};

EventItem.defaultProps = {
  comment: '',
  diff: {},
};

const ActivityFeed = ({ events }) => {
  let eventsToDisplay = chain(events)
    .sortBy('created_at')
    .reject(
      ({ name, diff }) =>
        [EnrollmentEvent.update, EnrollmentEvent.notify].includes(name) &&
        isEmpty(getChangelog(diff))
    )
    .value();

  return (
    <div>
      <ExpandableSection title="Historique de la demande">
        {eventsToDisplay.map(
          ({ id, comment, name, created_at, processed_at, user, diff }) => (
            <EventItem
              key={id}
              comment={comment}
              name={name}
              created_at={created_at}
              processed_at={processed_at}
              email={user?.email}
              family_name={user?.family_name}
              given_name={user?.given_name}
              diff={diff}
            />
          )
        )}
      </ExpandableSection>
    </div>
  );
};

ActivityFeed.propTypes = {
  events: PropTypes.array,
};

ActivityFeed.defaultProps = {
  events: [],
};

export default ActivityFeed;
