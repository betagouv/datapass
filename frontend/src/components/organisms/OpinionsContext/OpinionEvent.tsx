import moment from 'moment';
import Button from '../../atoms/hyperTexts/Button';
import React, { MouseEventHandler } from 'react';

type OpinionEventType = {
  titlePrefix: string;
  title: string;
  content: string;
  created_at: string;
  handleDelete?: MouseEventHandler<HTMLButtonElement> | null;
};

const OpinionEvent: React.FC<OpinionEventType> = ({
  titlePrefix,
  title,
  content,
  created_at,
  handleDelete = null,
}) => {
  return (
    <div className="opinion-event">
      <div className="opinion-event-title">
        <div className="opinion-event-title-prefix">{titlePrefix}</div>
        <div className="opinion-event-title-name">{title}</div>
      </div>
      <div className="opinion-event-content">
        <div className="opinion-event-content-body">{content}</div>
        <div className="opinion-event-content-footer">
          <div className="opinion-event-content-date">
            Le {moment(created_at).format('DD/MM/YY à HH:mm')}
          </div>
          {!!handleDelete && <Button onClick={handleDelete}>Supprimer</Button>}
        </div>
      </div>
    </div>
  );
};

export default OpinionEvent;
