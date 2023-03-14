import React from 'react';
import { Enrollment } from '../../templates/InstructorEnrollmentList';
import Badge, { StatusBadge } from '../StatusBadge';
import './styles.css';
import { BadgeType } from '../../atoms/hyperTexts/Badge';
import { Link } from 'react-router-dom';
import { FrFiIcon } from '../../atoms/icons/fr-fi-icons';

type Props = {
  enrollment: Enrollment;
};

const MessageQuickView: React.FC<Props> = ({ enrollment }) => {
  return (
    <Link
      to={`/${enrollment.target_api.replace(/_/g, '-')}/${enrollment.id}`}
      className="enrollment-quick-view"
    >
      <div className="enrollment-quick-view-informations">
        <div className="enrollment-quick-view-title">
          <FrFiIcon
            type="mail-fill"
            color="var(--text-action-high-blue-france)"
          />
          {enrollment.nom_raison_sociale}
        </div>
        <div className="enrollment-quick-view-footer">
          <div className="enrollment-quick-organization">
            reçu le 12/03/2023
          </div>
          <StatusBadge status={enrollment.status} />
        </div>
      </div>
    </Link>
  );
};

export default MessageQuickView;
