import React from 'react';
import AriaModal from '@justfixnyc/react-aria-modal';
import Button from '../atoms/Button';
import ButtonGroup from '../molecules/ButtonGroup';

const ConfirmationModal = ({
  handleConfirm,
  confirmLabel = 'Confirmer',
  handleCancel,
  cancelLabel = 'Annuler',
  title,
  children,
  type = '',
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
      <div className="fr-modal__body">
        <div className="fr-modal__header">
          <button
            className="fr-link--close fr-link"
            onClick={handleCancel}
            aria-label={cancelLabel}
          >
            Fermer
          </button>
        </div>
        <div className="fr-modal__content">
          <h1 className="fr-modal__title">{title}</h1>
          {children}
        </div>
        <div className="fr-modal__footer">
          <ButtonGroup alignRight>
            <Button outline large onClick={handleCancel}>
              {cancelLabel}
            </Button>
            <Button large type={type} onClick={handleConfirm}>
              {confirmLabel}
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  </AriaModal>
);

export default ConfirmationModal;
