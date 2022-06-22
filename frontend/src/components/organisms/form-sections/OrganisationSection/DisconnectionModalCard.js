import ConfirmationModal from '../../ConfirmationModal';

export const DisconnectionModalCard = ({
  urlForDisconnectionPrompt,
  setUrlForDisconnectionPrompt,
}) => {
  return (
    <ConfirmationModal
      title="Vous allez être déconnecté"
      handleConfirm={() => (window.location = urlForDisconnectionPrompt)}
      handleCancel={() => setUrlForDisconnectionPrompt('')}
    >
      Afin de mettre à jour vos informations personnelles, vous allez être
      déconnecté.
    </ConfirmationModal>
  );
};

export default DisconnectionModalCard;
