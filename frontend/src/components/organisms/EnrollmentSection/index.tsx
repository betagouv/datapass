import React from 'react';
import IconTitle, { NoDSFRIcons } from '../../molecules/IconTitle';
import { CardContainer } from '../../molecules/Card';
import EnrollmentCard from '../../molecules/EnrollmentCard';
import { Enrollment } from '../../../config';
import useListItemNavigation from '../../templates/hooks/use-list-item-navigation';

import './style.css';

type EnrollmentSectionProps = {
  enrollments: Enrollment[];
  title: string;
  icon: NoDSFRIcons;
  cardSize?: 'small' | 'large';
  highlighted?: boolean;
};

const EnrollmentSection: React.FC<EnrollmentSectionProps> = ({
  enrollments,
  title,
  icon,
  cardSize = 'small',
  highlighted = false,
}) => {
  let classNames = 'enrollment-section';

  if (highlighted) {
    classNames += ' highlighted';
  }

  const { goToItem } = useListItemNavigation();

  return (
    <div className={classNames}>
      <div className="page-container">
        <IconTitle title={title} icon={icon} noBorder small />
        <CardContainer>
          {enrollments.map((enrollment) => {
            return (
              <EnrollmentCard
                cardSize={cardSize}
                onSelect={goToItem}
                enrollment={enrollment}
              />
            );
          })}
        </CardContainer>
      </div>
    </div>
  );
};

export default EnrollmentSection;
