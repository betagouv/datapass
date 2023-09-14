import { useCallback, useMemo } from 'react';
import moment from 'moment';
import { chain } from 'lodash';
import './Enrollment.css';
import { useDataProvider } from '../hooks/use-data-provider';
import ActivityFeedWrapper from './ActivityFeedWrapper';
import Button from '../../atoms/hyperTexts/Button';
import { StatusBadge } from '../../molecules/StatusBadge';
import NextStepButton from '../../molecules/NextStepButton';
import { Enrollment as EnrollmentType } from '../../../config';

type EnrollmentProps = {
  id: EnrollmentType['id'];
  events: EnrollmentType['events'];
  target_api: EnrollmentType['target_api'];
  intitule: EnrollmentType['intitule'];
  description: EnrollmentType['description'];
  status: EnrollmentType['status'];
  onSelect: (
    target_api: string,
    id: number,
    e: React.MouseEvent<HTMLElement>
  ) => void;
};

const Enrollment: React.FC<EnrollmentProps> = ({
  id,
  events,
  target_api,
  intitule,
  description,
  status,
  onSelect,
}) => {
  const { label, icon } = useDataProvider(target_api);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      onSelect(target_api, id, e);
    },
    [id, target_api, onSelect]
  );

  const lastUpdateEvent = useMemo(() => {
    return chain(events)
      .sortBy('updated_at')
      .filter(({ name }) => ['created', 'updated'].includes(name))
      .last()
      .value();
  }, [events]);

  return (
    <div className="enrollment">
      <div className="enrollment-header">
        <div className="fs">
          {label}{' '}
          {icon && (
            <div>
              <img src={`/images/${icon}`} alt={`logo ${label}`} />
            </div>
          )}
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="enrollment-body">
        <div className="title">
          <div className="intitule">{intitule || 'Aucun intitulé'}</div>
          {lastUpdateEvent && (
            <div className="creation">
              Dernière modification le{' '}
              <b>{moment(lastUpdateEvent.created_at).format('L')}</b> par{' '}
              <b>{lastUpdateEvent.user.email}</b>
            </div>
          )}
        </div>

        <p className="description">{description || 'Aucune description'}</p>

        <ActivityFeedWrapper
          events={events}
          status={status}
          target_api={target_api}
        />

        <div className="enrollment-footer">
          <div>
            <b>N° {id}</b>
          </div>
          <div className="enrollment-actions">
            <NextStepButton target_api={target_api} status={status} />
            <Button large onClick={handleClick}>
              Consulter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enrollment;
