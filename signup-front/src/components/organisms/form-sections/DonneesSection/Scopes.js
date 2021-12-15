import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './Scopes.css';
import ConfirmationModal from '../../ConfirmationModal';
import Helper from '../../../atoms/Helper';
import CheckboxInput from '../../../atoms/inputs/CheckboxInput';

const ModalContent = {
  rgpd: {
    title: 'Vous souhaitez ajouter des données',
    body: (
      <>
        <p>
          Afin de respecter le principe <b>RGPD</b> de minimisation de la
          circulation des données personnelles, nous effectuons un contrôle de
          cohérence entre les données demandées et l’usage décrit.
        </p>
        <p>
          <b>
            Une demande non conforme fera l’objet d’un retour pour
            rectification, et donc d’un délai supplémentaire.
          </b>
        </p>
      </>
    ),
  },
  fc_incomplete: {
    title: 'Cette donnée n’est pas vérifiée',
    body: 'Elle ne sera transmise que si elle est disponible chez le fournisseur d’identité.',
  },
  apientreprise_sensitive: {
    title: 'Avez-vous vraiment besoin de cette donnée ?',
    body:
      "Cette donnée est particulièrement sensible, elle n'est pas autorisée dans le cadre des " +
      '"marchés publics" et "pré-remplissage". Elle peut être autorisée pour certaines ' +
      '"aides et subventions publiques". ' +
      "Pour que votre demande d'accès à cette donnée aboutisse, vous devez justifier dans ce formulaire " +
      "d'un cadre légal adéquat et d'un contexte d'usage attestant de l'utilité de cette donnée pour votre service.",
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
                <CheckboxInput
                  onChange={
                    triggerWarning && !selectedScopes[value]
                      ? () => {
                          setWarningType(warningType || 'rgpd');
                          setWarningModalScope(value);
                        }
                      : handleChange
                  }
                  name={`scopes.${value}`}
                  disabled={disabledApplication || mandatory}
                  value={selectedScopes[value]}
                  ariaLabel={`Périmètre de données « ${label} »`}
                  label={
                    <>
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
                    </>
                  }
                />
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
          confirmLabel="Ajouter ces données"
          title={ModalContent[warningType].title}
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
