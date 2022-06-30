import ConfirmationModal from '../../ConfirmationModal';

export const DisconnectionModal = ({ disconnectionUrl, handleCancel }) => {
  return (
    <ConfirmationModal
      title="Vous allez être déconnecté"
      handleConfirm={() => (window.location = disconnectionUrl)}
      handleCancel={handleCancel}
    >
      Afin de mettre à jour vos informations personnelles, vous allez être
      déconnecté.
    </ConfirmationModal>
  );
};

export default DisconnectionModal;
