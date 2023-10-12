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

export const HeadSection = () => {
  const {
    enrollment: { id, target_api, status, copied_from_enrollment_id, events },
  } = useContext(FormContext)!;

  const { label } = useDataProvider(target_api);

  return (
    <ScrollablePanel scrollableId="head">
      <div className="badge-sub-section fr-mb-3w">
        <>Vous demandez l’accès à</>
        <h1>{label}</h1>
        <div className="datapass-badge-group">
          {id && <Badge type={BadgeType.info}>Habilitation n°{id}</Badge>}
          <StatusBadge status={status} />
          {copied_from_enrollment_id && (
            <Link href={`/authorization-request/${copied_from_enrollment_id}`}>
              <span id="original-copy-number">
                Copie de n°{copied_from_enrollment_id}
              </span>
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
