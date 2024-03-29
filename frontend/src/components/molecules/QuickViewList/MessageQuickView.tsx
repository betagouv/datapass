import React from 'react';
import { StatusBadge } from '../StatusBadge';
import './styles.css';
import { Link } from 'react-router-dom';
import { MailIconFill } from '../../atoms/icons/fr-fi-icons';
import moment from 'moment';
import { Enrollment } from '../../../config';

type Props = {
  enrollment: Enrollment;
};

const MessageQuickView: React.FC<Props> = ({ enrollment }) => {
  const getLastUnprocessedMessageDate = () => {
    if (enrollment?.events) {
      const unprocessedMessages = enrollment.events.filter(
        ({ name, processed_at }) => name === 'notify' && !processed_at
      );
      const lastUnprocessedMessage = unprocessedMessages.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];

      return lastUnprocessedMessage?.created_at;
    }
  };

  return (
    <Link
      to={`/${enrollment.target_api.replace(/_/g, '-')}/${enrollment.id}`}
      className="quick-view"
    >
      <div className="quick-view-informations">
        <div className="quick-view-title">
          <div className="quick-view-icon">
            <MailIconFill />
          </div>
          {enrollment.nom_raison_sociale
            ? enrollment.nom_raison_sociale.toUpperCase()
            : enrollment.siret}
        </div>
        <div className="quick-view-footer quick-view-footer--span">
          <div className="quick-view-date">
            reçu le{' '}
            {moment(getLastUnprocessedMessageDate()).format('DD/MM/YYYY')}
          </div>
          <StatusBadge status={enrollment.status} />
        </div>
      </div>
    </Link>
  );
};

export default MessageQuickView;
