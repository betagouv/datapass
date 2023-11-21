import React, { useCallback } from 'react';
import './style.css';
import Card from '../Card';
import Badge, { StatusBadge } from '../StatusBadge';
import { Enrollment } from '../../../config';
import { useDataProvider } from '../../templates/hooks/use-data-provider';
import Button from '../../atoms/hyperTexts/Button';

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

  return (
    <Card className="third-card">
      <Badge>n°{enrollment.id}</Badge>
      <div>{label}</div>

      {icon && cardSize === 'large' && (
        <div>
          <img src={`/images/${icon}`} alt={`logo ${label}`} />
        </div>
      )}

      <div>{enrollment.intitule}</div>
      <StatusBadge status={enrollment.status} />
      <p>{enrollment.description}</p>
      <Button large onClick={handleClick}>
        Continuer
      </Button>
    </Card>
  );
};

export default EnrollmentCard;
