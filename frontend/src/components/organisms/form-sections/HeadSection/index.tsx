import { isEmpty } from 'lodash';
import React, { useContext, useEffect, useRef, useState } from 'react';
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
import Button from '../../../atoms/hyperTexts/Button';
import { useAuth } from '../../AuthContext';
import { unarchiveEnrollment } from '../../../../services/enrollments';
import ConfirmationModal from '../../ConfirmationModal';
import Alert, { AlertType } from '../../../atoms/Alert';
import { Linkify } from '../../../molecules/Linkify';

export const HeadSection = () => {
  const {
    enrollment: { id, target_api, status, copied_from_enrollment_id, events },
  } = useContext(FormContext)!;

  const { label } = useDataProvider(target_api);
  const { getIsUserAnAdministrator } = useAuth();

  const isUserAnAdministrator = getIsUserAnAdministrator();
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const isArchived = status === 'archived';
  const [showAlert, setShowAlert] = useState(false);
  const alertRef = useRef(null);

  const openConfirmationModal = () => {
    setIsConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const handleUnarchive = () => {
    unarchiveEnrollment({ id: id });
    closeConfirmationModal();
    setShowAlert(true);
  };

  useEffect(() => {
    // Scroll to the alert when it is displayed
    if (showAlert && alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showAlert]);

  return (
    <ScrollablePanel scrollableId="head">
      <div className="badge-sub-section fr-mb-3w">
        <>Vous demandez l’accès à</>
        <div className="admin-unarchive-section">
          <h1>{label}</h1>
          <div>
            {!showAlert && isUserAnAdministrator && isArchived && (
              <Button
                secondary
                large
                icon="arrow-go-back"
                onClick={() => openConfirmationModal()}
              >
                Désarchiver
              </Button>
            )}

            {showAlert && (
              <div ref={alertRef}>
                <Alert type={AlertType.success}>
                  <Linkify message={"L'habilitation a bien été désarchivée"} />
                </Alert>
              </div>
            )}
          </div>
        </div>
        <div className="datapass-badge-group">
          {id && <Badge type={BadgeType.info}>Habilitation n°{id}</Badge>}
          <StatusBadge status={status} />
          {copied_from_enrollment_id && (
            <Link href={`/authorization-request/${copied_from_enrollment_id}`}>
              <span>Copie de n°{copied_from_enrollment_id}</span>
            </Link>
          )}
        </div>
      </div>
      <div className="feed-sub-section fr-py-3w">
        {!isEmpty(events) && <ActivityFeed events={events as Event[]} />}
      </div>
      <div className="fr-pt-3w">
        <NotificationSubSection />
      </div>

      {/* Render the ConfirmationModal */}
      {isConfirmationModalOpen && (
        <ConfirmationModal
          title="Voulez-vous décarchiver l'habilitation ?"
          handleConfirm={handleUnarchive}
          handleCancel={closeConfirmationModal}
        >
          <p>
            Vous êtes sur le point de désarchiver cette habilitation, elle
            reprendra son statut initial dans votre liste d'habilitations.
          </p>
        </ConfirmationModal>
      )}
    </ScrollablePanel>
  );
};

export default HeadSection;
