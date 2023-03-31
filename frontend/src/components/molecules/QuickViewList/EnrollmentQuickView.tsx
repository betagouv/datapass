import React from 'react';
import { Enrollment } from '../../templates/InstructorEnrollmentList';
import Badge from '../StatusBadge';
import './styles.css';
import { BadgeType } from '../../atoms/hyperTexts/Badge';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { useMemo } from 'react';

type Props = {
  enrollment: Enrollment;
};

const EnrollmentQuickView: React.FC<Props> = ({ enrollment }) => {
  const getSubmitDate = () => {
    const submitEvent = enrollment.events.find(({ name }) => name === 'submit');
    return submitEvent?.created_at;
  };

  const isThereAnyNewSubmitEnrollment = useMemo(() => {
    const filteredEvents = enrollment.events.filter(
      ({ name, processed_at }) => {
        return name === 'submit' && !processed_at;
      }
    );

    if (isEmpty(filteredEvents)) {
      return false;
    }

    return filteredEvents;
  }, [enrollment.events]);

  return (
    <Link
      to={`/${enrollment.target_api.replace(/_/g, '-')}/${enrollment.id}`}
      className="quick-view"
    >
      <div className="quick-view-informations quick-view-informations--small">
        <div className="quick-view-header">
          {isThereAnyNewSubmitEnrollment && (
            <Badge type={BadgeType.new} icon={true} small={true}>
              Nouveau
            </Badge>
          )}
        </div>
        <div className="quick-view-title">{enrollment.intitule}</div>
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
