import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { collectionWithKeyToObject } from '../../../../lib';
import { isEmpty } from 'lodash';
import { getCachedOrganizationInformationPool } from '../../../../services/external';
import RadioInput from '../../../atoms/inputs/RadioInput';
import ConfirmationModal from '../../ConfirmationModal';
import { ExternalLinkIcon } from '../../../atoms/icons/fr-fi-icons';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

const OrganizationPrompt = ({
  selectedOrganizationId,
  onSelect,
  onClose,
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
        label: siretToNomRaisonSociale[siret]
          ? siretToNomRaisonSociale[siret].title
          : siret,
      })),
    [organizations, siretToNomRaisonSociale]
  );

  const handleJoinOrganization = () =>
    (window.location = `${BACK_HOST}/api/users/join_organization`);

  return (
    <>
      <ConfirmationModal
        title="Sélectionnez l’organisation à associer à cette demande"
        handleCancel={() => onClose()}
        handleConfirm={handleJoinOrganization}
        confirmLabel={
          <>
            Faire une demande pour une autre organisation{' '}
            <ExternalLinkIcon color="inherit" />
          </>
        }
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
