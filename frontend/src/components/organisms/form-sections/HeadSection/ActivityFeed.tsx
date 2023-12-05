import { chain, isEmpty } from 'lodash';
import { useContext, useMemo, useState } from 'react';
import { FormContext } from '../../../templates/Form';

import moment from 'moment';
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
  UnarchiveIcon,
} from '../../../atoms/icons/fr-fi-icons';
import FileCopyIcon from '../../../atoms/icons/fileCopy';
import { Linkify } from '../../../molecules/Linkify';
import { useAuth } from '../../AuthContext';
import './ActivityFeed.css';
import ExpandableSection from '../../../molecules/ExpandableSection';
import { EnrollmentEvent } from '../../../../config/event-configuration';
import { Event } from '../../../../config';

const eventToDisplayableContent = {
  [EnrollmentEvent.request_changes]: {
    icon: <WarningIcon color={'var(--text-default-warning)'} />,
    label: 'a demandé des modifications',
  },
  [EnrollmentEvent.notify]: {
    icon: <MailIcon color={'var(--text-default-info)'} />,
    label: 'a écrit',
  },
  [EnrollmentEvent.create]: {
    icon: <InfoFillIcon color={'var(--text-default-info)'} />,
    label: 'a créé la demande d’habilitation',
  },
  [EnrollmentEvent.submit]: {
    icon: <InfoFillIcon color={'var(--text-default-info)'} />,
    label: 'a soumis la demande d’habilitation',
  },
  [EnrollmentEvent.validate]: {
    icon: <CheckCircleIcon color={'var(--text-default-success)'} />,
    label: 'a validé l’habilitation',
  },
  [EnrollmentEvent.reminder_before_archive]: {
    icon: <NotificationIcon color={'var(--text-default-warning)'} />,
    label: 'a envoyé un email de relance avant archivage',
  },
  [EnrollmentEvent.reminder]: {
    icon: <NotificationIcon color={'var(--text-default-info)'} />,
    label: 'a envoyé un email de relance',
  },
  // This event is not available anymore but we keep this to display remaining
  // updated_contacts events in the activity feed
  [EnrollmentEvent.update_contacts]: {
    icon: <InfoFillIcon color={'var(--text-default-info)'} />,
    label: 'a mis à jour les contacts',
  },
  [EnrollmentEvent.update]: {
    icon: <InfoFillIcon color={'var(--text-default-info)'} />,
    label: 'a mis à jour l’habilitation',
  },
  [EnrollmentEvent.refuse]: {
    icon: <ErrorIcon color={'var(--text-default-error)'} />,
    label: 'a refusé l’habilitation',
  },
  [EnrollmentEvent.revoke]: {
    icon: <ErrorIcon color={'var(--text-default-error)'} />,
    label: 'a révoqué l’habilitation',
  },
  [EnrollmentEvent.archive]: {
    icon: <ArchiveIcon color={'var(--text-default-info)'} />,
    label: 'a archivé l’habilitation',
  },
  [EnrollmentEvent.copy]: {
    icon: <FileCopyIcon color={'var(--text-default-info)'} />,
    label: 'a copié l’habilitation',
  },
  [EnrollmentEvent.import]: {
    icon: <InfoFillIcon color={'var(--text-default-info)'} />,
    label: 'a importé l’habilitation',
  },
  [EnrollmentEvent.destroy]: {
    icon: <InfoFillIcon color={'var(--text-default-warning)'} />,
    label: 'a supprimé l’habilitation',
  },
  [EnrollmentEvent.create_opinion]: {
    icon: <InfoFillIcon color={'var(--text-default-warning)'} />,
    label: 'a demandé un avis',
  },
  [EnrollmentEvent.create_opinion_comment]: {
    icon: <InfoFillIcon color={'var(--text-default-warning)'} />,
    label: 'a répondu à un avis',
  },
  [EnrollmentEvent.unarchive]: {
    icon: <UnarchiveIcon color={'var(--text-default-info)'} />,
    label: 'a désarchivé l’habilitation',
  },
};

export const EventItem: React.FC<Event> = ({
  comment,
  name,
  created_at,
  processed_at,
  user,
  diff,
}) => {
  const [showDiff, setShowDiff] = useState(false);
  const changelog = getChangelog(diff);
  const { getIsUserAnInstructor } = useAuth();

  const {
    enrollment: { team_members = [], target_api },
  } = useContext(FormContext) || { enrollment: {} };

  let eventCommentClass = 'event-comment';

  if (isUserADemandeur({ team_members, user_email: user?.email as string })) {
    eventCommentClass += ' event-comment-demandeurs';
  }

  const userLabel = useMemo(() => {
    return user?.given_name && user?.family_name
      ? `${user?.given_name} ${user?.family_name}`
      : user?.given_name || user?.family_name || user?.email || 'DataPass';
  }, [user]);

  const isUserAnInstructor = getIsUserAnInstructor(target_api as string);

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
            {changelog.map((log: string) => (
              <p key={log.slice(20)}>{log}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

type ActivityFeedProps = {
  events: Event[];
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({ events }) => {
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
          ({
            id,
            comment,
            name,
            created_at,
            updated_at,
            processed_at,
            user,
            diff,
          }) => (
            <EventItem
              id={id}
              key={id}
              comment={comment}
              name={name}
              created_at={created_at}
              updated_at={updated_at}
              processed_at={processed_at}
              user={user}
              diff={diff}
            />
          )
        )}
      </ExpandableSection>
    </div>
  );
};

export default ActivityFeed;
