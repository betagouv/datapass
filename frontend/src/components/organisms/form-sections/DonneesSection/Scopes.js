import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ScopeWarningModalConfiguration from '../../../../config/scope-warning-modal-configuration';
import ConfirmationModal from '../../ConfirmationModal';
import CheckboxInput from '../../../atoms/inputs/CheckboxInput';
import FieldsetWrapper from '../../../atoms/inputs/FieldsetWrapper';
import Link from '../../../atoms/hyperTexts/Link';
import Helper from '../../../atoms/Helper';

const Scopes = ({
  title,
  scopes,
  selectedScopes,
  disabledApplication,
  handleChange,
}) => {
  const [warningModalScope, setWarningModalScope] = useState(null);
  const [warningType, setWarningType] = useState('rgpd');

  const handleWarningModalClose = () => {
    handleChange({
      target: {
        type: 'checkbox',
        checked: true,
        name: `scopes.${warningModalScope}`,
      },
    });
    setWarningModalScope(null);
    setWarningType('rgpd');
  };

  let titleToDisplay = title;

  // Adding helpers on group title is an exception made for DGFiP form.
  // This option must not be generalised. It should be removed ASAP.
  if (title === 'Années sur lesquelles porte votre demande') {
    titleToDisplay = (
      <>
        {title}{' '}
        <Helper
          title={
            'Le calendrier de basculement des millésimes est détaillé dans la documentation accessible via la rubrique « Comment choisir les données ? »'
          }
        ></Helper>
      </>
    );
  }

  return (
    <>
      <FieldsetWrapper title={titleToDisplay} grid>
        {scopes.map(
          ({
            value,
            label,
            helper,
            required,
            triggerWarning,
            warningType,
            link,
          }) => (
            <CheckboxInput
              key={value}
              onChange={
                triggerWarning && !selectedScopes[value]
                  ? () => {
                      setWarningType(warningType || 'rgpd');
                      setWarningModalScope(value);
                    }
                  : handleChange
              }
              name={`scopes.${value}`}
              disabled={disabledApplication || required}
              value={selectedScopes[value]}
              aria-label={`Périmètre de données « ${label} »`}
              label={
                <>
                  {link ? (
                    <span>
                      {label}
                      <Link
                        inline
                        newTab
                        href={link}
                        aria-label={`Plus d’information sur la donnée ${label}`}
                      >
                        {''}
                      </Link>
                    </span>
                  ) : (
                    label
                  )}
                </>
              }
              required={required}
              helper={helper}
            />
          )
        )}
      </FieldsetWrapper>
      {warningModalScope && (
        <ConfirmationModal
          handleCancel={() => setWarningModalScope(null)}
          handleConfirm={handleWarningModalClose}
          confirmLabel="Ajouter ces données"
          title={ScopeWarningModalConfiguration[warningType].title}
        >
          <p>{ScopeWarningModalConfiguration[warningType].body} </p>
        </ConfirmationModal>
      )}
    </>
  );
};

Scopes.defaultProps = {
  disabledApplication: false,
  title: null,
  useCategoryStyle: true,
};

Scopes.propTypes = {
  title: PropTypes.string,
  scopes: PropTypes.array.isRequired,
  selectedScopes: PropTypes.object.isRequired,
  disabledApplication: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  useCategoryStyle: PropTypes.bool,
};

export default Scopes;
