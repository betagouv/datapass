import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import AriaModal from '@justfixnyc/react-aria-modal';
import { collectionWithKeyToObject } from '../../../../lib';
import { isEmpty } from 'lodash';
import { getCachedOrganizationInformationPool } from '../../../../services/external';
import Button from '../../../atoms/Button';
import Link from '../../../atoms/Link';
import RadioInput from '../../../atoms/inputs/RadioInput';

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

  return (
    <AriaModal
      titleText="Sélectionnez l’organisation à associer à cette demande"
      // we use this no op function to close the modal
      onExit={() => onClose()}
      focusDialog
      getApplicationNode={() => document.getElementById('root')}
      scrollDisabled={false}
    >
      <div
        className="modal__backdrop"
        // we use this no op function to close the modal
        onClick={() => onClose()}
      >
        <div className="fr-modal__body" onClick={(e) => e.stopPropagation()}>
          <div className="fr-modal__header">
            <Link
              closeButton
              onClick={() => onClose()}
              aria-label="Conserver l’organisation actuelle"
            >
              Fermer
            </Link>
          </div>
          <div className="fr-modal__content">
            <h1 className="fr-modal__title">
              Faire une demande pour une autre organisation
            </h1>
            <RadioInput
              label="Sélectionnez l’organisation à associer à cette demande"
              options={options}
              name="organization_id"
              value={selectedOrganizationId}
              onChange={handleChange}
            />
          </div>
          <div className="fr-modal__footer">
            <Button
              large
              outline
              href={`${BACK_HOST}/api/users/join_organization`}
            >
              Faire une demande pour une autre organisation
            </Button>
          </div>
        </div>
      </div>
    </AriaModal>
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
