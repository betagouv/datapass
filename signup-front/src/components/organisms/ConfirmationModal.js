import React from 'react';
import AriaModal from '@justfixnyc/react-aria-modal';
import Button from '../atoms/Button';
import ButtonGroup from '../molecules/ButtonGroup';
import Link from '../atoms/Link';
import { InfoIcon } from '../atoms/icons/fr-fi-icons';

const ConfirmationModal = ({
  handleConfirm,
  confirmLabel = 'Confirmer',
  handleCancel,
  cancelLabel = 'Annuler',
  title,
  children,
}) => (
  <AriaModal
    titleText={title}
    onExit={handleCancel}
    focusDialog
    getApplicationNode={() => document.getElementById('root')}
    scrollDisabled={false}
    alert
  >
    <div className="modal__backdrop" onClick={handleCancel}>
      <div className="fr-modal__body" onClick={(e) => e.stopPropagation()}>
        <div className="fr-modal__header">
          <Link closeButton onClick={handleCancel} aria-label={cancelLabel}>
            Fermer
          </Link>
        </div>
        <div className="fr-modal__content">
          <h1 className="fr-modal__title fr-text-title--blue-france">
            <InfoIcon color="inherit" />
            {' '}
            {title}
          </h1>
          {children}
        </div>
        <div className="fr-modal__footer">
          <ButtonGroup alignRight>
            <Button outline large onClick={handleCancel}>
              {cancelLabel}
            </Button>
            <Button large onClick={handleConfirm}>
              {confirmLabel}
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  </AriaModal>
);

export default ConfirmationModal;
