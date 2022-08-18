import { isEmpty } from 'lodash';
import { useContext } from 'react';
import { DATA_PROVIDER_PARAMETERS } from '../../../../config/data-provider-parameters';
import {
  STATUS_TO_BUTTON_TYPE,
  USER_STATUS_LABELS,
} from '../../../../config/status-parameters';
import Tag from '../../../atoms/hyperTexts/Tag';
import FileCopyIcon from '../../../atoms/icons/file_copy';
import TagContainer from '../../../atoms/TagContainer';
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
      <div className="tag-sub-section">
        <>Vous demandez l’accès à</>
        <h1>{DATA_PROVIDER_PARAMETERS[target_api]?.label}</h1>
        <TagContainer>
          {id && <Tag>Habilitation n°{id}</Tag>}
          {copied_from_enrollment_id && (
            <Tag
              href={`/authorization-request/${copied_from_enrollment_id}`}
              type="info"
            >
              {/* --text-inverted-info: #f4f6ff; */}
              <FileCopyIcon size={18} color="#f4f6ff" />
              <span style={{ marginLeft: '4px' }}>
                Copie de n°{copied_from_enrollment_id}
              </span>
            </Tag>
          )}
          <Tag type={STATUS_TO_BUTTON_TYPE[status]}>
            {USER_STATUS_LABELS[status]}
          </Tag>
        </TagContainer>
      </div>
      <div className="feed-sub-section">
        {!isEmpty(events) && <ActivityFeed events={events} />}
      </div>
      <div className="notification-sub-section">
        <NotificationSubSection />
      </div>
    </ScrollablePanel>
  );
};

export default HeadSection;
