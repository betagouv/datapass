import React from 'react';
import { Enrollment } from '../../templates/InstructorEnrollmentList';
import Badge from '../StatusBadge';
import './styles.css';
import { BadgeType } from '../../atoms/hyperTexts/Badge';
import Button from '../../atoms/hyperTexts/Button';
import useListItemNavigation from '../../templates/hooks/use-list-item-navigation';
import { ArrowRightIcon } from '../../atoms/icons/fr-fi-icons';

type Props = {
  enrollment: Enrollment;
};

export const EnrollmentQuickView: React.FC<Props> = ({ enrollment }) => {
  const { goToItem } = useListItemNavigation();

  return (
    <div className="enrollment-quick-view">
      <div className="enrollment-quick-view-informations">
        <div className="enrollment-quick-view-title">{enrollment.intitule}</div>
        <div className="enrollment-quick-view-date">soumis le 12/02/2020</div>
        <div className="enrollment-quick-view-footer">
          <Badge type={BadgeType.info}>{enrollment.id}</Badge>
          <div>{enrollment.nom_raison_sociale}</div>
        </div>
      </div>
      <div className="enrollment-quick-view-actions">
        <Button
          onClick={(event) =>
            goToItem(enrollment.target_api, enrollment.id, event)
          }
        >
          <ArrowRightIcon color="white" small />
        </Button>
      </div>
    </div>
  );
};

export default EnrollmentQuickView;
