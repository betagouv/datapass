import { MouseEventHandler } from 'react';
import ConfirmationModal from '../../ConfirmationModal';

type DisconnectionModalProps = {
  disconnectionUrl: string;
  handleCancel: MouseEventHandler<HTMLElement>;
};

export const DisconnectionModal: React.FC<DisconnectionModalProps> = ({
  disconnectionUrl,
  handleCancel,
}) => {
  return (
    <ConfirmationModal
      title="Vous allez être déconnecté"
      handleConfirm={() => (window.location.href = disconnectionUrl)}
      handleCancel={handleCancel}
    >
      Afin de mettre à jour vos informations personnelles, vous allez être
      déconnecté.
    </ConfirmationModal>
  );
};

export default DisconnectionModal;
