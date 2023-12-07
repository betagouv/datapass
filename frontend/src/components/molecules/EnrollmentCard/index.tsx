import React from 'react';
import Card from '../Card';
import Badge, { StatusBadge } from '../StatusBadge';
import { Enrollment, Event } from '../../../config';
import { useDataProvider } from '../../templates/hooks/use-data-provider';
import Button from '../../atoms/hyperTexts/Button';
import { EnrollmentStatus } from '../../../config/status-parameters';
import { reopenEnrollment } from '../../../services/enrollments';

import './style.css';
import { isReopenned } from '../../../lib';
import { EnrollmentEvent } from '../../../config/event-configuration';
import moment from 'moment';
import { ArrowWithTailRightIcon } from '../../atoms/icons/fr-fi-icons';

type Props = {
  enrollment: Enrollment;
  onSelect: (
    target_api: string,
    id: number,
    e: React.MouseEvent<HTMLElement>,
    snapshotId?: number
  ) => void;
  cardSize?: 'small' | 'large';
};

export const EnrollmentCard: React.FC<Props> = ({
  enrollment,
  onSelect,
  cardSize,
}) => {
  const { label, icon } = useDataProvider(enrollment.target_api);

  const isEnrollmentReopenned = isReopenned(enrollment);
  const lastSnapshotId = enrollment.events?.find(
    ({ name }) => name === EnrollmentEvent.validate
  )?.entity_id;

  let className = 'enrollment-card';

  if (cardSize === 'large') {
    className += ' large';
  }

  const onReopenClick = async (event: React.MouseEvent<HTMLElement>) => {
    const reopenedEnrollment = await reopenEnrollment({ id: enrollment.id });
    onSelect(reopenedEnrollment.target_api, reopenedEnrollment.id, event);
  };

  const getLastReopenDate = () => {
    let reopenEvents =
      enrollment?.events?.filter((event) => event.name === 'reopen') || [];

    let lastReopenEvent = reopenEvents.reduce((maxDateEvent, currentEvent) => {
      return !maxDateEvent || currentEvent.created_at > maxDateEvent.created_at
        ? currentEvent
        : maxDateEvent;
    }, null as Event | null);

    return lastReopenEvent?.created_at;
  };

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
    <div className={className}>
      <Card>
        <div className="enrollment-card-header">
          <Badge>n°{enrollment.id}</Badge>
          <StatusBadge
            status={
              isEnrollmentReopenned
                ? EnrollmentStatus.validated
                : enrollment.status
            }
          />
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
            <div className="enrollment-card-actions">
              <Button
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  onSelect(
                    enrollment.target_api,
                    enrollment.id,
                    e,
                    lastSnapshotId
                  );
                }}
              >
                Consulter
              </Button>
              {enrollment.status === EnrollmentStatus.validated && (
                <Button secondary onClick={onReopenClick}>
                  Mettre à jour
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
      {isReopenned(enrollment) && (
        <div className="enrollment-card-footer">
          <div className="enrollment-card-footer-details">
            <div className="enrollment-card-footer-details-title">
              Demande de mise à jour
            </div>
            <div>
              Faite le {moment(getLastReopenDate()).format('DD/MM/YYYY')}
            </div>
            <Button
              className="enrollment-card-footer-details-button"
              tertiaryNoOutline
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                onSelect(enrollment.target_api, enrollment.id, e);
              }}
            >
              Consulter
              <ArrowWithTailRightIcon small />
            </Button>
          </div>
          <div className="enrollment-card-footer-status">
            <StatusBadge status={enrollment.status} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentCard;
