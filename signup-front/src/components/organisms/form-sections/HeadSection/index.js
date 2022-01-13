import React, { useContext } from 'react';
import { ScrollablePanel } from '../../Scrollable';
import { DATA_PROVIDER_PARAMETERS } from '../../../../config/data-provider-parameters';
import TagContainer from '../../../atoms/TagContainer';
import FileCopyIcon from '../../../atoms/icons/file_copy';
import {
  STATUS_TO_BUTTON_TYPE,
  USER_STATUS_LABELS,
} from '../../../../config/status-parameters';
import { FormContext } from '../../../templates/Form';
import ActivityFeed from './ActivityFeed';
import { isEmpty } from 'lodash';
import NotificationSubSection from './NotificationSubSection';
import Tag from '../../../atoms/hyperTexts/Tag';

export const HeadSection = () => {
  const {
    enrollment: { id, target_api, status, copied_from_enrollment_id, events },
  } = useContext(FormContext);

  return (
    <ScrollablePanel scrollableId="head">
      <div
        style={{
          marginBottom: '2em',
        }}
      >
        <>Vous demandez l’accès à</>
        <h1>{DATA_PROVIDER_PARAMETERS[target_api]?.label}</h1>
        <TagContainer>
          {id && <Tag>Demande n°{id}</Tag>}
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
      <div
        style={{
          marginBottom: '2em',
        }}
      >
        {!isEmpty(events) && <ActivityFeed events={events} />}
      </div>
      <NotificationSubSection />
    </ScrollablePanel>
  );
};

export default HeadSection;
