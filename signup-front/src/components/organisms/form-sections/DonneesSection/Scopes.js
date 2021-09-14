import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './Scopes.css';
import ConfirmationModal from '../../ConfirmationModal';
import Helper from '../../../atoms/Helper';

const ModalContent = {
  rgpd: {
    title:
      'Assurez vous de ne pas demander une ou plusieurs données non utiles à vos traitements',
    body:
      'Afin de respecter le principe RGPD de minimisation de la circulation des ' +
      'données personnelles, nous effectuons un contrôle de cohérence entre les ' +
      'données demandées et l’usage décrit. Une demande non conforme fera ' +
      'l’objet d’un retour pour rectification, et donc d’un délai ' +
      'supplémentaire.',
  },
  fc_incomplete: {
    title: 'Cette donnée n’est pas vérifiée',
    body: 'Elle ne sera transmise que si elle est disponible chez le fournisseur d’identité.',
  },
};

const Scopes = ({
  title,
  scopes,
  selectedScopes,
  disabledApplication,
  handleChange,
  useCategoryStyle,
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

  return (
    <div className="form__group">
      <fieldset>
        {title &&
          (useCategoryStyle ? (
            <label className="typography__caption label">{title}</label>
          ) : (
            <p>{title}</p>
          ))}
        <div className="scope_container">
          {scopes.map(
            ({
              value,
              label,
              helper,
              mandatory,
              comment,
              triggerWarning,
              warningType,
              link,
            }) => (
              <div className="scope_item" key={value}>
                <input
                  type="checkbox"
                  onChange={
                    triggerWarning && !selectedScopes[value]
                      ? () => {
                          setWarningType(warningType || 'rgpd');
                          setWarningModalScope(value);
                        }
                      : handleChange
                  }
                  name={`scopes.${value}`}
                  id={`checkbox-scope-${value}`}
                  disabled={disabledApplication || mandatory}
                  checked={selectedScopes[value]}
                />
                <label
                  htmlFor={`checkbox-scope-${value}`}
                  className="label-inline"
                  aria-label={`Périmètre de données « ${label} »`}
                >
                  {label}
                  {mandatory && <i> (nécessaire)</i>}
                  {helper && <Helper title={helper} />}
                  {link && (
                    <>
                      {' '}
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Plus d’information sur la donnée ${label}`}
                      >
                        {''}
                      </a>
                    </>
                  )}
                </label>
                {comment && <div className="scope_comment">{comment}</div>}
              </div>
            )
          )}
        </div>
      </fieldset>
      {warningModalScope && (
        <ConfirmationModal
          handleCancel={() => setWarningModalScope(null)}
          handleConfirm={handleWarningModalClose}
          confirmLabel={`Demander la donnée « ${
            scopes.find(({ value }) => value === warningModalScope).label
          } »`}
          cancelLabel={`Ne pas demander la donnée « ${
            scopes.find(({ value }) => value === warningModalScope).label
          } »`}
          title={ModalContent[warningType].title}
          type="danger"
        >
          <p>{ModalContent[warningType].body} </p>
        </ConfirmationModal>
      )}
    </div>
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
