import React, { useCallback } from 'react';
import './style.css';
import Card from '../Card';
import Badge, { StatusBadge } from '../StatusBadge';
import { Enrollment } from '../../../config';
import { useDataProvider } from '../../templates/hooks/use-data-provider';
import Button from '../../atoms/hyperTexts/Button';

import './style.css';

type Props = {
  enrollment: Enrollment;
  onSelect: (
    target_api: string,
    id: number,
    e: React.MouseEvent<HTMLElement>
  ) => void;
  cardSize?: 'small' | 'large';
};

export const EnrollmentCard: React.FC<Props> = ({
  enrollment,
  onSelect,
  cardSize,
}) => {
  const { label, icon } = useDataProvider(enrollment.target_api);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      onSelect(enrollment.target_api, enrollment.id, e);
    },
    [enrollment, onSelect]
  );

  let className = 'enrollment-card';

  if (cardSize === 'large') {
    className += ' large';
  }

  const adjustTextToDesiredLength = (
    text: string | undefined,
    length: number
  ) => {
    if (!text) {
      return null;
    }

    if (text.length > length) {
      return text.slice(0, length) + '…';
    }

    return text;
  };

  return (
    <Card className={className}>
      <div className="enrollment-card-header">
        <Badge>n°{enrollment.id}</Badge>
        <StatusBadge status={enrollment.status} />
      </div>
      <div className="enrollment-card-body">
        {icon && cardSize === 'large' && (
          <div className="enrollment-card-image">
            <img src={`/images/${icon}`} alt={`logo ${label}`} />
          </div>
        )}
        <div className="enrollment-card-content">
          <div className="enrollment-card-subtitle">{label}</div>
          <div className="enrollment-card-title" title={enrollment.intitule}>
            {adjustTextToDesiredLength(enrollment.intitule, 60)}
          </div>
          <p
            className="enrollment-card-description"
            title={enrollment.description}
          >
            {adjustTextToDesiredLength(enrollment.description, 120)}
          </p>
          <Button onClick={handleClick}>Continuer</Button>
        </div>
      </div>
    </Card>
  );
};

export default EnrollmentCard;
