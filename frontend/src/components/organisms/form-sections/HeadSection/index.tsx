import { isEmpty } from 'lodash';
import { useContext } from 'react';
import Badge, { BadgeType } from '../../../atoms/hyperTexts/Badge';
import Link from '../../../atoms/hyperTexts/Link';
import { StatusBadge } from '../../../molecules/StatusBadge';
import { FormContext } from '../../../templates/Form';
import { useDataProvider } from '../../../templates/hooks/use-data-provider';
import { ScrollablePanel } from '../../Scrollable';
import ActivityFeed from './ActivityFeed';
import './index.css';
import NotificationSubSection from './NotificationSubSection';
import { Event } from '../../../../config';
import Button from '../../../atoms/hyperTexts/Button';
import { useAuth } from '../../AuthContext';
import {
  eventConfigurations,
  EnrollmentEvent,
} from '../../../../config/event-configuration';
import { processEvent } from '../../../../lib/process-event';
import Enrollment from '../../../templates/Enrollment';

export const HeadSection = () => {
  const {
    enrollment: { id, target_api, status, copied_from_enrollment_id, events },
  } = useContext(FormContext)!;

  const { label } = useDataProvider(target_api);
  const { getIsUserAnAdministrator } = useAuth();

  const isUserAnAdministrator = getIsUserAnAdministrator();

  const handleUnarchiveClick = async () => {
    const event = EnrollmentEvent.unarchive;
    const eventConfiguration = eventConfigurations[event];
    const enrollment = Enrollment;
    const updateEnrollment = Function;

    try {
      await processEvent(
        event,
        eventConfiguration,
        enrollment,
        updateEnrollment
      );
    } catch (error) {
      console.error('Erreur lors du désarchivage:', error);
    }
  };

  return (
    <ScrollablePanel scrollableId="head">
      <div className="badge-sub-section fr-mb-3w">
        <>Vous demandez l’accès à</>
        <div className="admin-unarchive-section">
          <h1>{label}</h1>
          <div>
            {isUserAnAdministrator && (
              <Button
                secondary
                large
                icon="arrow-go-back"
                onClick={handleUnarchiveClick}
              >
                Désarchiver
              </Button>
            )}
          </div>
        </div>
        <div className="datapass-badge-group">
          {id && <Badge type={BadgeType.info}>Habilitation n°{id}</Badge>}
          <StatusBadge status={status} />
          {copied_from_enrollment_id && (
            <Link href={`/authorization-request/${copied_from_enrollment_id}`}>
              <span>Copie de n°{copied_from_enrollment_id}</span>
            </Link>
          )}
        </div>
      </div>
      <div className="feed-sub-section fr-py-3w">
        {!isEmpty(events) && <ActivityFeed events={events as Event[]} />}
      </div>
      <div className="fr-pt-3w">
        <NotificationSubSection />
      </div>
    </ScrollablePanel>
  );
};

export default HeadSection;
