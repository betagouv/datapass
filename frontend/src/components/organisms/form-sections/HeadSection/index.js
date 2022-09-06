import { isEmpty } from 'lodash';
import { useContext } from 'react';
import { DATA_PROVIDER_PARAMETERS } from '../../../../config/data-provider-parameters';
import {
  STATUS_TO_BADGE_TYPE,
  USER_STATUS_LABELS,
} from '../../../../config/status-parameters';
import BadgeContainer from '../../../atoms/BadgeContainer';
import Badge from '../../../atoms/hyperTexts/Badge';
import Link from '../../../atoms/hyperTexts/Link';
import { FormContext } from '../../../templates/Form';
import { ScrollablePanel } from '../../Scrollable';
import ActivityFeed from './ActivityFeed';
import './index.css';
import NotificationSubSection from './NotificationSubSection';

export const HeadSection = () => {
  const {
    enrollment: { id, target_api, status, copied_from_enrollment_id, events },
  } = useContext(FormContext);

  return (
    <ScrollablePanel scrollableId="head">
      <div className="badge-sub-section fr-mb-3w">
        <>Vous demandez l’accès à</>
        <h1>{DATA_PROVIDER_PARAMETERS[target_api]?.label}</h1>
        <div className="datapass-badge-group">
          {id && <Badge type="info">Habilitation n°{id}</Badge>}
          <Badge type={STATUS_TO_BADGE_TYPE[status]}>
            {USER_STATUS_LABELS[status]}
          </Badge>
          {copied_from_enrollment_id && (
            <Link href={`/authorization-request/${copied_from_enrollment_id}`}>
              <span>Copie de n°{copied_from_enrollment_id}</span>
            </Link>
          )}
        </div>
      </div>
      <div className="feed-sub-section fr-py-3w">
        {!isEmpty(events) && <ActivityFeed events={events} />}
      </div>
      <div className="notification-sub-section fr-pb-3w">
        <NotificationSubSection />
      </div>
    </ScrollablePanel>
  );
};

export default HeadSection;
