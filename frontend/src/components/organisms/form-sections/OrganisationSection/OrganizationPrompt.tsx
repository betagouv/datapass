import React, { ChangeEventHandler, useMemo } from 'react';
import RadioInput from '../../../atoms/inputs/RadioInput';
import ConfirmationModal from '../../ConfirmationModal';
import { User } from '../../../templates/InstructorEnrollmentList';

type OrganizationPromptProps = {
  selectedOrganizationId: number;
  onSelect: Function;
  onClose: Function;
  onJoinOrganization: Function;
  organizations: User['organizations'];
};

const OrganizationPrompt: React.FC<OrganizationPromptProps> = ({
  selectedOrganizationId,
  onSelect,
  onClose,
  onJoinOrganization,
  organizations,
}) => {
  const onChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => onSelect(parseInt(value));

  const options = useMemo(
    () =>
      organizations?.map(({ id, label, siret }) => ({
        id,
        label: label || siret,
      })),
    [organizations]
  );

  return (
    <>
      <ConfirmationModal
        title="Sélectionnez l’organisation à associer à cette habilitation"
        handleCancel={onClose}
        handleConfirm={onJoinOrganization}
        confirmLabel="Demander une habilitation pour une autre organisation"
      >
        <RadioInput
          label="Liste des organisations"
          options={options}
          value={selectedOrganizationId}
          onChange={onChange}
        />
      </ConfirmationModal>
    </>
  );
};

export default OrganizationPrompt;
