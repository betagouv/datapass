import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ConfirmationModal from '../../ConfirmationModal';
import CheckboxInput from '../../../atoms/inputs/CheckboxInput';
import FieldsetWrapper from '../../../atoms/inputs/FieldsetWrapper';
import Link from '../../../atoms/hyperTexts/Link';
import Helper from '../../../atoms/Helper';

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
            Une demande d’habilitation non conforme fera l’objet d’un retour
            pour rectification, et donc d’un délai supplémentaire.
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
          title={ModalContent[warningType].title}
        >
          <p>{ModalContent[warningType].body} </p>
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
