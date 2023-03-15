import React from 'react';
import { Enrollment } from '../../templates/InstructorEnrollmentList';
import { StatusBadge } from '../StatusBadge';
import './styles.css';
import { Link } from 'react-router-dom';
import { FrFiIcon } from '../../atoms/icons/fr-fi-icons';

type Props = {
  enrollment: Enrollment;
};

const MessageQuickView: React.FC<Props> = ({ enrollment }) => {
  return (
    <Link
      to={`/${enrollment.target_api.replace(/_/g, '-')}/${enrollment.id}`}
      className="quick-view"
    >
      <div className="quick-view-informations">
        <div className="quick-view-title">
          <div className="quick-view-icon">
            <FrFiIcon
              type="mail-fill"
              color="var(--text-action-high-blue-france)"
            />
          </div>
          {enrollment.nom_raison_sociale.toUpperCase()}
        </div>
        <div className="quick-view-footer quick-view-footer--span">
          <div className="quick-organization">reçu le 12/03/2023</div>
          <StatusBadge status={enrollment.status} />
        </div>
      </div>
    </Link>
  );
};

export default MessageQuickView;
