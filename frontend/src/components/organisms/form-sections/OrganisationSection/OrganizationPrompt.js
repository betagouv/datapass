import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { collectionWithKeyToObject } from '../../../../lib';
import { isEmpty } from 'lodash';
import { getCachedOrganizationInformationPool } from '../../../../services/external';
import RadioInput from '../../../atoms/inputs/RadioInput';
import ConfirmationModal from '../../ConfirmationModal';

const OrganizationPrompt = ({
  selectedOrganizationId,
  onSelect,
  onClose,
  onJoinOrganization,
  organizations,
}) => {
  const handleChange = ({ target: { value } }) => onSelect(parseInt(value));

  const [siretToNomRaisonSociale, setSiretToNomRaisonSociale] = useState(
    collectionWithKeyToObject(organizations.map(({ siret }) => ({ id: siret })))
  );

  useEffect(() => {
    const fetchCachedOrganizationInformationPool = async (organizations) => {
      try {
        const organizationInformationPool =
          await getCachedOrganizationInformationPool(
            organizations.map(({ siret }) => siret)
          );
        const organizationInformationPoolWithKey =
          organizationInformationPool.map(({ title, siret }) => ({
            id: siret,
            title,
          }));
        setSiretToNomRaisonSociale(
          collectionWithKeyToObject(organizationInformationPoolWithKey)
        );
      } catch (e) {
        // silently fail
      }
    };
    if (!isEmpty(organizations)) {
      fetchCachedOrganizationInformationPool(organizations);
    }
  }, [organizations]);

  const options = useMemo(
    () =>
      organizations.map(({ id, siret }) => ({
        id,
        label: siretToNomRaisonSociale[siret]?.title || siret,
      })),
    [organizations, siretToNomRaisonSociale]
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
          options={options}
          name="organization_id"
          value={selectedOrganizationId}
          onChange={handleChange}
        />
      </ConfirmationModal>
    </>
  );
};

OrganizationPrompt.propTypes = {
  selectedOrganizationId: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  organizations: PropTypes.array.isRequired,
};

OrganizationPrompt.defaultProps = {
  selectedOrganizationId: null,
};

export default OrganizationPrompt;
