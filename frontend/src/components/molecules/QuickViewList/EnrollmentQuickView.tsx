import React from 'react';
import { Enrollment } from '../../templates/InstructorEnrollmentList';
import Badge from '../StatusBadge';
import './styles.css';
import { BadgeType } from '../../atoms/hyperTexts/Badge';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { useMemo } from 'react';
import { markEventAsRead } from '../../../services/enrollments';

type Props = {
  enrollment: Enrollment;
};

const EnrollmentQuickView: React.FC<Props> = ({ enrollment }) => {
  const getSubmitDate = () => {
    const submitEvent = enrollment.events.find(({ name }) => name === 'submit');
    return submitEvent?.created_at;
  };

  const isUnreadSubmittedEnrollment = useMemo(() => {
    const filteredEvents = enrollment.events.filter(
      ({ name, processed_at }) => {
        return name === 'submit' && !processed_at;
      }
    );

    return !isEmpty(filteredEvents);
  }, [enrollment.events]);

  const markAsRead = async () => {
    await markEventAsRead({ id: enrollment.id, event_name: 'submit' });
  };

  return (
    <Link
      to={`/${enrollment.target_api.replace(/_/g, '-')}/${enrollment.id}`}
      className="quick-view"
      onClick={markAsRead}
    >
      <div className="quick-view-informations quick-view-informations--small">
        {isUnreadSubmittedEnrollment && (
          <div className="quick-view-header">
            <Badge type={BadgeType.new} icon={true} small={true}>
              Nouveau
            </Badge>
          </div>
        )}
        <div
          className={`quick-view-title ${
            isUnreadSubmittedEnrollment ? 'quick-view-title--new' : ''
          }`}
        >
          {enrollment.intitule}
        </div>
        <div className="quick-view-date">
          soumis le {moment(getSubmitDate()).format('DD/MM/YYYY')}
        </div>
        <div className="quick-view-footer">
          <Badge type={BadgeType.info}>{enrollment.id}</Badge>
          {enrollment.nom_raison_sociale && (
            <div className="quick-organization">
              {enrollment.nom_raison_sociale.toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default EnrollmentQuickView;