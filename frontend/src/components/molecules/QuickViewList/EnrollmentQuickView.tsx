import React from 'react';
import { Enrollment } from '../../templates/InstructorEnrollmentList';
import Badge from '../StatusBadge';
import './styles.css';
import { useLocation } from 'react-router-dom';
import { BadgeType } from '../../atoms/hyperTexts/Badge';
import { Link } from 'react-router-dom';
import moment from 'moment';

type Props = {
  enrollment: Enrollment;
};

const EnrollmentQuickView: React.FC<Props> = ({ enrollment }) => {
  const location = useLocation();
  const getSubmitDate = () => {
    const submitEvent = enrollment.events.find(({ name }) => name === 'submit');
    return submitEvent?.created_at;
  };

  return (
    <Link
      to={`/${enrollment.target_api.replace(/_/g, '-')}/${enrollment.id}`}
      className="quick-view"
      state={{
        previousPath: `${location.pathname || '/'}${window.location.search}`,
      }}
    >
      <div className="quick-view-informations quick-view-informations--small">
        {!enrollment.consulted_by_instructor && (
          <div className="quick-view-header">
            <Badge type={BadgeType.new} icon={true} small={true}>
              Nouveau
            </Badge>
          </div>
        )}
        <div
          className={`quick-view-title ${
            enrollment.consulted_by_instructor ? '' : 'quick-view-title--new'
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
