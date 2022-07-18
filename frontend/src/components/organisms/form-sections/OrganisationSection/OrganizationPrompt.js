import { uniqueId } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { getCachedOrganizationInformation } from '../../../../services/external';
import WarningIcon from '../../../atoms/icons/warning';
import FieldsetWrapper from '../../../atoms/inputs/FieldsetWrapper';
import Label from '../../../atoms/inputs/Label';
import Loader from '../../../atoms/Loader';
import ConfirmationModal from '../../ConfirmationModal';

// This function contains temporary code as auth.api.gouv.fr should soon return organisation title in /userinfo
// All the to do should be resolved then
const OrganizationPrompt = ({
  selectedOrganizationId,
  onSelect,
  onClose,
  onJoinOrganization,
  organizations,
}) => {
  const handleChange = ({ target: { value } }) => onSelect(parseInt(value));

  const [id] = useState(uniqueId('organization_id'));

  return (
    <>
      <ConfirmationModal
        title="Sélectionnez l’organisation à associer à cette habilitation"
        handleCancel={onClose}
        handleConfirm={onJoinOrganization}
        confirmLabel="Demander une habilitation pour une autre organisation"
      >
        {
          // TODO use RadioInput
        }
        <FieldsetWrapper>
          {organizations.map(({ id: optionId, siret }) => (
            <OrganizationPromptInput
              id={optionId}
              siret={siret}
              value={selectedOrganizationId}
              fieldSetId={id}
              onChange={handleChange}
            />
          ))}
        </FieldsetWrapper>
      </ConfirmationModal>
    </>
  );
};

// TODO use a separate file
const OrganizationPromptInput = ({
  id,
  siret,
  value,
  fieldSetId,
  onChange,
}) => {
  const [label, setLabel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    const fetchCachedOrganizationInformation = async (siret) => {
      try {
        const { title } = await getCachedOrganizationInformation(siret);
        setLabel(title);
        setLoading(false);
        setError(false);
      } catch (e) {
        setLoading(false);
        setError(true);
      }
    };

    if (!label) {
      fetchCachedOrganizationInformation(siret);
    }
  }, [label, siret]);

  return (
    <div key={`${fieldSetId}-${id}`} className="fr-radio-group">
      <input
        type="radio"
        name="organization_id"
        id={`${fieldSetId}-${id}`}
        value={id}
        checked={value === id}
        onChange={onChange}
        disabled={false}
        required={false}
      />
      {label ? (
        <Label id={`${fieldSetId}-${id}`} label={label} />
      ) : (
        <Label
          id={`${fieldSetId}-${id}`}
          label={
            <>
              {siret}
              {' '}
              {loading ? <Loader small /> : ''}
              {error ? <WarningIcon color={'orange'} /> : ''}
            </>
          }
        />
      )}
    </div>
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
