import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AriaModal from '@justfixnyc/react-aria-modal';
import { collectionWithKeyToObject } from '../../../../lib';
import { isEmpty } from 'lodash';
import { getCachedOrganizationInformationPool } from '../../../../services/external';
import Button from '../../../atoms/Button';

const BACK_HOST = process.env.VITE_BACK_HOST;

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

  return (
    <AriaModal
      titleText="Sélectionnez l’organisation à associer à cette demande :"
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
            <button
              className="fr-link--close fr-link"
              onClick={() => onClose()}
              aria-label="Conserver l’organisation actuelle"
            >
              Fermer
            </button>
          </div>
          <div className="fr-modal__content">
            <h1 className="fr-modal__title">
              Faire une demande pour une autre organisation
            </h1>
            <div className="form__group">
              <fieldset>
                <legend>
                  Sélectionnez l’organisation à associer à cette demande :
                </legend>
                {organizations.map(({ id, siret }) => (
                  <div key={id}>
                    <input
                      type="radio"
                      id={id}
                      value={id}
                      checked={id === selectedOrganizationId}
                      // Use onClick in addition of onChange because it allows to
                      // handle clicks on the already selected value.
                      onClick={handleChange}
                      onChange={handleChange}
                    />
                    <label htmlFor={id} className="label-inline">
                      {(siretToNomRaisonSociale[siret] &&
                        siretToNomRaisonSociale[siret].title) ||
                        siret}
                    </label>
                  </div>
                ))}
              </fieldset>
            </div>
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
