import { isEmpty } from 'lodash';
import { useContext } from 'react';
import Badge, { BadgeType } from '../../../atoms/hyperTexts/Badge';
import Link from '../../../atoms/hyperTexts/Link';
import { StatusBadge } from '../../../molecules/StatusBadge';
import { FormContext } from '../../../templates/Form';
import { useDataProvider } from '../../../templates/hooks/use-data-provider';
import { ScrollablePanel } from '../../Scrollable';
import ActivityFeed from './ActivityFeed';
import './index.css';
import NotificationSubSection from './NotificationSubSection';
import { Event } from '../../../../config';
import Alert from '../../../atoms/Alert';
import useListItemNavigation from '../../../templates/hooks/use-list-item-navigation';
import { EnrollmentStatus } from '../../../../config/status-parameters';
import { useParams } from 'react-router-dom';

export const HeadSection = () => {
  const { snapshotId } = useParams();
  const { enrollment } = useContext(FormContext)!;

  const { goToItem } = useListItemNavigation();
  const { label } = useDataProvider(enrollment.target_api);

  return (
    <ScrollablePanel scrollableId="head">
      <div className="badge-sub-section fr-mb-3w">
        <>
          {enrollment.reopening && !snapshotId
            ? 'Mise à jour des informations'
            : 'Vous demandez l’accès à'}
        </>
        <h1>{label}</h1>
        <div className="datapass-badge-group">
          {enrollment.id && (
            <Badge type={BadgeType.info}>Habilitation n°{enrollment.id}</Badge>
          )}
          {enrollment.reopening && (
            <Badge type={BadgeType.purple}>Demande de mise à jour</Badge>
          )}
          <StatusBadge status={enrollment.status} />
          {enrollment.copied_from_enrollment_id && (
            <Link
              href={`/authorization-request/${enrollment.copied_from_enrollment_id}`}
            >
              <span>Copie de n°{enrollment.copied_from_enrollment_id}</span>
            </Link>
          )}
        </div>
      </div>
      {enrollment.reopening && enrollment.status === EnrollmentStatus.draft && (
        <div className="fr-py-5w">
          <Alert title="Mettez à jour votre habilitation sereinement">
            <p>
              Votre demande de mise à jour n’aura pas d’impact sur votre
              habilitation initialement validée. Nous mettrons à jour vos
              informations et conserverons les anciennes. De plus, dans le cas
              où cette demande de mise à jour est refusée, votre habilitation
              initiale reste bien évidemment valide !
            </p>
          </Alert>
        </div>
      )}
      {snapshotId && (
        <div className="fr-py-5w">
          <Alert title="Mise à jour de vos informations">
            <p>
              Vous avez demandé à mettre à jour certaines informations pour
              cette habilitation.
            </p>
            <Link
              inline
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                goToItem(enrollment.target_api, enrollment.id, e);
              }}
            >
              Voir les informations modifiées
            </Link>
          </Alert>
        </div>
      )}
      <div className="feed-sub-section fr-py-3w">
        {!isEmpty(enrollment.events) && (
          <ActivityFeed events={enrollment.events as Event[]} />
        )}
      </div>
      <div className="fr-pt-3w">
        <NotificationSubSection />
      </div>
    </ScrollablePanel>
  );
};

export default HeadSection;
